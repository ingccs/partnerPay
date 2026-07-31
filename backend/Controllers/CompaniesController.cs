using Microsoft.AspNetCore.Mvc;
using BackendApi.Data;
using BackendApi.Models;
using Microsoft.EntityFrameworkCore;

[Route("api/companies")]
[ApiController]
public class CompaniesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CompaniesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Company>>> GetCompanies()
    {
        return await _context.Set<Company>().ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Company>> PostCompany([FromBody] Company company)
    {
        if (company == null)
        {
            return BadRequest(new { message = "Datos de empresa inválidos." });
        }

        _context.Set<Company>().Add(company);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCompanies), new { id = company.IdCmpy }, company);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCompany(int id)
    {
        var company = await _context.Set<Company>().FindAsync(id);
        if (company == null)
        {
            return NotFound();
        }

        _context.Set<Company>().Remove(company);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}