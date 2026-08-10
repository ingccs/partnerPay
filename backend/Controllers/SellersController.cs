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