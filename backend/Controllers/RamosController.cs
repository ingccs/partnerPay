using Microsoft.AspNetCore.Mvc;
using BackendApi.Data;
using BackendApi.Models;
using Microsoft.EntityFrameworkCore;

[Route("api/ramos")]
[ApiController]

public class RamosController : ControllerBase
{
    private readonly AppDbContext _context;

    public RamosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetRamos()
    {
        var ramos = await _context.Ramos.ToListAsync();
        return Ok(ramos); 
    }
}