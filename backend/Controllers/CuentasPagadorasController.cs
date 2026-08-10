using Microsoft.AspNetCore.Mvc;
using BackendApi.Data;
using BackendApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Controllers
{
    [Route("api/cuentas-pagadoras")]
    [ApiController]
    public class CuentasPagadorasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CuentasPagadorasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CuentaPagadora>>> GetCuentas()
        {
            return await _context.Set<CuentaPagadora>().OrderByDescending(c => c.Idctapay).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CuentaPagadora>> GetCuenta(int id)
        {
            var cuenta = await _context.Set<CuentaPagadora>().FindAsync(id);
            if (cuenta == null) return NotFound();
            return cuenta;
        }

        [HttpPost]
        public async Task<ActionResult<CuentaPagadora>> PostCuenta(CuentaPagadora cuenta)
        {
            _context.Set<CuentaPagadora>().Add(cuenta);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCuenta), new { id = cuenta.Idctapay }, cuenta);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCuenta(int id, CuentaPagadora cuenta)
        {
            if (id != cuenta.Idctapay) return BadRequest();

            _context.Entry(cuenta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Set<CuentaPagadora>().Any(e => e.Idctapay == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCuenta(int id)
        {
            var cuenta = await _context.Set<CuentaPagadora>().FindAsync(id);
            if (cuenta == null) return NotFound();

            _context.Set<CuentaPagadora>().Remove(cuenta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/cuentas-pagadoras/actualizar-balance
        [HttpPost("actualizar-balance")]
        public async Task<IActionResult> ActualizarBalance([FromBody] ActualizarBalanceDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var cuenta = await _context.Set<CuentaPagadora>().FindAsync(dto.Idctapay);
                if (cuenta == null) return NotFound("Cuenta pagadora no encontrada.");

                decimal montoAnterior = cuenta.Balance;

                // 1. Actualizar balance de la cuenta
                cuenta.Balance = dto.NuevoBalance;

                // 2. Registrar el movimiento en la tabla de auditoría/historial
                var historial = new HistorialBalance
                {
                    Idctapay = dto.Idctapay,
                    MontoAnterior = montoAnterior,
                    MontoNuevo = dto.NuevoBalance,
                    FechaRegistro = DateTime.UtcNow
                };

                _context.Set<HistorialBalance>().Add(historial);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { mensaje = "Balance actualizado e historial registrado correctamente." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                var msg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Error al actualizar el balance: {msg}");
            }
        }

        // GET: api/cuentas-pagadoras/historial-balances
        [HttpGet("historial-balances")]
        public async Task<ActionResult<IEnumerable<HistorialBalance>>> GetHistorialBalances([FromQuery] int? idctapay)
        {
            try
            {
                var query = _context.Set<HistorialBalance>().AsQueryable();

                if (idctapay.HasValue && idctapay.Value > 0)
                {
                    query = query.Where(h => h.Idctapay == idctapay.Value);
                }

                var historial = await query.OrderByDescending(h => h.FechaRegistro).ToListAsync();
                return Ok(historial);
            }
            catch (Exception ex)
            {
                var msg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Error al consultar historial: {msg}");
            }
        }
    }
}