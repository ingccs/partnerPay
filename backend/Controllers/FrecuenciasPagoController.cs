using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendApi.Data;
using BackendApi.Models;

namespace BackendApi.Controllers
{
    [Route("api/frecuencias-pago")]
    [ApiController]
    public class FrecuenciasPagoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FrecuenciasPagoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/frecuencias-pago
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FrecuenciaPago>>> GetFrecuencias()
        {
            try
            {
                var lista = await _context.FrecuenciasPago
                    .OrderBy(f => f.Idfqcypay)
                    .ToListAsync();

                return Ok(lista);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine($"❌ ERROR EN GET FRECUENCIAS: {ex.Message}");
                return StatusCode(500, ex.Message);
            }
        }

        // POST: api/frecuencias-pago
        [HttpPost]
        public async Task<ActionResult<FrecuenciaPago>> PostFrecuencia(FrecuenciaPago frecuencia)
        {
            _context.FrecuenciasPago.Add(frecuencia);
            await _context.SaveChangesAsync();
            return Ok(frecuencia);
        }

        // PUT: api/frecuencias-pago/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFrecuencia(int id, FrecuenciaPago frecuencia)
        {
            if (id != frecuencia.Idfqcypay) return BadRequest();

            _context.Entry(frecuencia).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/frecuencias-pago/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFrecuencia(int id)
        {
            var item = await _context.FrecuenciasPago.FindAsync(id);
            if (item == null) return NotFound();

            _context.FrecuenciasPago.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}