using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendApi.Data;
using BackendApi.Models;

namespace BackendApi.Controllers
{
    [Route("api/comisiones")]
    [ApiController]
    public class ComisionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ComisionesController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/comisiones/registrar-venta
        // Registra la venta y calcula los residuales automáticamente según el árbol MLM
        [HttpPost("registrar-venta")]
        public async Task<IActionResult> RegistrarVenta([FromBody] RegistrarVentaDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var vendedorVenta = await _context.Sellers.FindAsync(dto.Idseller);
                if (vendedorVenta == null) return NotFound("Vendedor no encontrado.");

                var producto = await _context.Products.FindAsync(dto.Idproduct);
                if (producto == null) return NotFound("Producto no encontrado.");

                // 1. Guardar la venta
                var venta = new Venta
                {
                    Idseller = dto.Idseller,
                    Idproduct = dto.Idproduct,
                    NroPoliza = dto.NroPoliza.Trim().ToUpper(),
                    NroRecibo = dto.NroRecibo.Trim().ToUpper(),
                    MontoPrima = dto.MontoPrima,
                    FechaEmision = dto.FechaEmision.ToUniversalTime(),
                    FechaVenta = DateTime.UtcNow
                };

                _context.Ventas.Add(venta);
                await _context.SaveChangesAsync();

                // 2. Reparto de comisiones en la cadena ascendente
                // Techo de comisión base configurado (Ej: 15% o tomado de las coberturas)
                decimal porcentajeBaseTotal = 15.00m; 

                var vendedorActual = vendedorVenta;
                decimal porcentajeAcumuladoRepartido = 0.00m;

                while (vendedorActual != null && porcentajeAcumuladoRepartido < porcentajeBaseTotal)
                {
                    // Asignación escalonada según nivel
                    decimal porcentajeAsignado = vendedorActual.Nivel switch
                    {
                        3 => 5.00m,  // Directa al vendedor Nivel 3
                        2 => 3.00m,  // Residual al Nivel 2
                        1 => porcentajeBaseTotal - porcentajeAcumuladoRepartido, // Sobrante directo al Nivel 1
                        _ => 2.00m
                    };

                    if (porcentajeAsignado > (porcentajeBaseTotal - porcentajeAcumuladoRepartido))
                    {
                        porcentajeAsignado = porcentajeBaseTotal - porcentajeAcumuladoRepartido;
                    }

                    if (porcentajeAsignado > 0)
                    {
                        decimal montoComision = (dto.MontoPrima * porcentajeAsignado) / 100m;

                        var comision = new ComisionVenta
                        {
                            Idventa = venta.Idventa,
                            Idseller = vendedorActual.Idseller,
                            NivelBeneficiario = vendedorActual.Nivel,
                            Porcentaje = porcentajeAsignado,
                            MontoComision = montoComision,
                            TipoComision = vendedorActual.Idseller == dto.Idseller ? "DIRECTA" : "RESIDUAL",
                            IdestatusPago = 0,
                            FechaRegistro = DateTime.UtcNow
                        };

                        _context.ComisionesVentas.Add(comision);
                        porcentajeAcumuladoRepartido += porcentajeAsignado;
                    }

                    // Subir al padre en la red
                    if (vendedorActual.Idpapa != 0)
                    {
                        vendedorActual = await _context.Sellers.FindAsync(vendedorActual.Idpapa);
                    }
                    else
                    {
                        vendedorActual = null;
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { mensaje = "Venta y comisiones MLM registradas con éxito.", idventa = venta.Idventa });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                var msg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Error al registrar venta: {msg}");
            }
        }

        // GET: api/comisiones/acumuladas
        [HttpGet("acumuladas")]
        public async Task<IActionResult> GetComisionesAcumuladas([FromQuery] int idseller, [FromQuery] DateTime desde, [FromQuery] DateTime hasta)
        {
            try
            {
                var desdeUtc = desde.ToUniversalTime();
                var hastaUtc = hasta.ToUniversalTime().AddDays(1).AddTicks(-1);

                var list = await _context.ComisionesVentas
                    .Where(c => c.Idseller == idseller && c.IdestatusPago == 0 && c.FechaRegistro >= desdeUtc && c.FechaRegistro <= hastaUtc)
                    .ToListAsync();

                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // POST: api/comisiones/liquidar
        [HttpPost("liquidar")]
        public async Task<IActionResult> LiquidarComisiones([FromBody] LiquidarComisionesDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var liquidacion = new Liquidacion
                {
                    Idseller = dto.Idseller,
                    MontoTotal = dto.MontoTotal,
                    FechaDesde = dto.FechaDesde.ToUniversalTime(),
                    FechaHasta = dto.FechaHasta.ToUniversalTime(),
                    TipoPago = dto.TipoPago,
                    ReferenciaPago = dto.ReferenciaPago,
                    Observaciones = dto.Observaciones,
                    FechaPago = DateTime.UtcNow
                };

                _context.Liquidaciones.Add(liquidacion);
                await _context.SaveChangesAsync();

                // Cambiar el estatus de las comisiones a 1 (Pagado)
                if (dto.IdsComisiones != null && dto.IdsComisiones.Count > 0)
                {
                    var comisiones = await _context.ComisionesVentas
                        .Where(c => dto.IdsComisiones.Contains(c.Idcomision))
                        .ToListAsync();

                    foreach (var com in comisiones)
                    {
                        com.IdestatusPago = 1;
                        com.Idliquidacion = liquidacion.Idliquidacion;
                    }

                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
                return Ok(new { mensaje = "Comisiones liquidadas exitosamente." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ex.Message);
            }
        }
    }
}