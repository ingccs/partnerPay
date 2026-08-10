using Microsoft.AspNetCore.Mvc;
using BackendApi.Data;
using BackendApi.Models;
using Microsoft.EntityFrameworkCore;

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
}