using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendApi.Data;
using BackendApi.Models;

namespace BackendApi.Controllers
{
    [Route("api/sellers")]
    [ApiController]
    public class SellersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SellersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/sellers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Seller>>> GetSellers()
        {
            try
            {
                var sellers = await _context.Sellers
                    .AsNoTracking()
                    .OrderByDescending(s => s.Idseller)
                    .ToListAsync();

                return Ok(sellers);
            }
            catch (Exception ex)
            {
                var msg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Error en servidor: {msg}");
            }
        }

        // GET: api/sellers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Seller>> GetSeller(int id)
        {
            var seller = await _context.Sellers.FindAsync(id);
            if (seller == null) return NotFound();
            return Ok(seller);
        }

        // POST: api/sellers
        [HttpPost]
        public async Task<ActionResult<Seller>> PostSeller([FromBody] Seller seller)
        {
            try
            {
                seller.Idseller = 0;
                seller.Name = seller.Name.Trim().ToUpper();
                seller.Lastname = seller.Lastname.Trim().ToUpper();
                seller.Xcity = seller.Xcity.Trim().ToUpper();
                seller.Xdir = seller.Xdir.Trim().ToUpper();

                _context.Sellers.Add(seller);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetSeller), new { id = seller.Idseller }, seller);
            }
            catch (Exception ex)
            {
                var innerMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Error en servidor: {innerMsg}");
            }
        }

        // PUT: api/sellers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSeller(int id, [FromBody] Seller seller)
        {
            if (id != seller.Idseller) return BadRequest("El ID no coincide.");

            var existing = await _context.Sellers.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Idpapa = seller.Idpapa;
            existing.Code = seller.Code;
            existing.Typ = seller.Typ;
            existing.Ci = seller.Ci;
            existing.Name = seller.Name.Trim().ToUpper();
            existing.Lastname = seller.Lastname.Trim().ToUpper();
            existing.Email = seller.Email;
            existing.Mobile = seller.Mobile;
            existing.Comission = seller.Comission;
            existing.Cestado = seller.Cestado;
            existing.Xcity = seller.Xcity.Trim().ToUpper();
            existing.Xdir = seller.Xdir.Trim().ToUpper();
            existing.Ecivil = seller.Ecivil;
            existing.Sexx = seller.Sexx;
            existing.FechaNac = seller.FechaNac;
            existing.Banco = seller.Banco;
            existing.Nrocta = seller.Nrocta;
            existing.Nivel = seller.Nivel;
            existing.Fpay = seller.Fpay; // Asignación entera
            existing.Idestatus = seller.Idestatus;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                var innerMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Error en servidor: {innerMsg}");
            }
        }

        // POST: api/sellers/carga-masiva
        [HttpPost("carga-masiva")]
        public async Task<IActionResult> CargaMasivaSellers([FromBody] List<CargaMasivaSellerDto> listaSellers)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 1. Filtrar en memoria la lista entrante para no procesar códigos/cédulas duplicados dentro del mismo Excel
                var listaSinDuplicadosExcel = listaSellers
                    .GroupBy(s => new { Ci = s.Ci.Trim(), Code = (s.Code ?? "").Trim().ToUpper() })
                    .Select(g => g.First())
                    .ToList();

                // 2. Traer de la base de datos todos los vendedores existentes para comparar por Cédula y Código
                var cedulasExistentes = await _context.Sellers.ToDictionaryAsync(s => s.Ci.Trim(), s => s);
                var codigosExistentes = await _context.Sellers
                    .Where(s => !string.IsNullOrEmpty(s.Code))
                    .ToDictionaryAsync(s => s.Code!.Trim().ToUpper(), s => s);

                var mapaCodigosNuevos = new Dictionary<string, Seller>();

                // 3. Primera pasada: Insertar nuevos o Actualizar existentes evitando duplicados
                foreach (var item in listaSinDuplicadosExcel)
                {
                    string ciClean = item.Ci.Trim();
                    string codeClean = !string.IsNullOrEmpty(item.Code) ? item.Code.Trim().ToUpper() : "";

                    Seller sellerTarget;

                    // Verificar si el vendedor ya existe en la BD por Cédula o Código
                    if (cedulasExistentes.TryGetValue(ciClean, out var sellerExistente) || 
                    (!string.IsNullOrEmpty(codeClean) && codigosExistentes.TryGetValue(codeClean, out sellerExistente)))
                    {
                        // ACTUALIZAR REGISTRO EXISTENTE (No duplica)
                        sellerTarget = sellerExistente;
                        sellerTarget.Name = item.Name.Trim().ToUpper();
                        sellerTarget.Lastname = item.Lastname.Trim().ToUpper();
                        sellerTarget.Email = item.Email.Trim().ToLower();
                        sellerTarget.Mobile = item.Mobile.Trim();
                        sellerTarget.Cestado = item.Cestado;
                        sellerTarget.Xcity = item.Xcity.Trim().ToUpper();
                        sellerTarget.Xdir = item.Xdir.Trim().ToUpper();
                        sellerTarget.Nivel = item.Nivel;
                        if (!string.IsNullOrEmpty(item.Banco)) sellerTarget.Banco = item.Banco.Trim().ToUpper();
                        if (!string.IsNullOrEmpty(item.Nrocta)) sellerTarget.Nrocta = item.Nrocta.Trim();
                        sellerTarget.Idestatus = item.Idestatus;
                        if (!string.IsNullOrEmpty(codeClean)) sellerTarget.Code = codeClean;
                    }
                    else
                    {
                        // INSERTAR NUEVO REGISTRO
                        sellerTarget = new Seller
                        {
                            Idseller = 0,
                            Code = !string.IsNullOrEmpty(codeClean) ? codeClean : null,
                            Typ = item.Typ,
                            Ci = ciClean,
                            Name = item.Name.Trim().ToUpper(),
                            Lastname = item.Lastname.Trim().ToUpper(),
                            Email = item.Email.Trim().ToLower(),
                            Mobile = item.Mobile.Trim(),
                            Cestado = item.Cestado,
                            Xcity = item.Xcity.Trim().ToUpper(),
                            Xdir = item.Xdir.Trim().ToUpper(),
                            Ecivil = item.Ecivil,
                            Sexx = item.Sexx,
                            FechaNac = item.FechaNac,
                            Nivel = item.Nivel,
                            Banco = !string.IsNullOrEmpty(item.Banco) ? item.Banco.Trim().ToUpper() : null,
                            Nrocta = !string.IsNullOrEmpty(item.Nrocta) ? item.Nrocta.Trim() : null,
                            Idestatus = item.Idestatus,
                            Fpay = item.Fpay,
                            Idpapa = 0
                        };

                        _context.Sellers.Add(sellerTarget);
                    }

                    if (!string.IsNullOrEmpty(codeClean))
                    {
                        mapaCodigosNuevos[codeClean] = sellerTarget;
                    }
                }

                // Guardar cambios primarios para obtener los IDs
                await _context.SaveChangesAsync();

                // 4. Segunda pasada: Resolver y asociar el Idpapa vía CodePadre
                foreach (var item in listaSinDuplicadosExcel)
                {
                    if (!string.IsNullOrEmpty(item.CodePadre))
                    {
                        string codePadreClean = item.CodePadre.Trim().ToUpper();
                        int idPapaResuelto = 0;

                        if (codigosExistentes.TryGetValue(codePadreClean, out var padreExistente))
                        {
                            idPapaResuelto = padreExistente.Idseller;
                        }
                        else if (mapaCodigosNuevos.TryGetValue(codePadreClean, out var nuevoPadre))
                        {
                            idPapaResuelto = nuevoPadre.Idseller;
                        }

                        if (idPapaResuelto > 0)
                        {
                            string codeHijoClean = !string.IsNullOrEmpty(item.Code) ? item.Code.Trim().ToUpper() : "";
                            if (!string.IsNullOrEmpty(codeHijoClean) && mapaCodigosNuevos.TryGetValue(codeHijoClean, out var sellerHijo))
                            {
                                sellerHijo.Idpapa = idPapaResuelto;
                            }
                            else if (cedulasExistentes.TryGetValue(item.Ci.Trim(), out var sellerHijoCedula))
                            {
                                sellerHijoCedula.Idpapa = idPapaResuelto;
                            }
                        }
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { mensaje = "Carga masiva procesada sin duplicar registros." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                var msg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Error en carga masiva: {msg}");
            }
        }

        // DELETE: api/sellers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSeller(int id)
        {
            try
            {
                var seller = await _context.Sellers.FindAsync(id);
                if (seller == null) return NotFound();

                _context.Sellers.Remove(seller);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}