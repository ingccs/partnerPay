using Microsoft.AspNetCore.Mvc;
using BackendApi.Data;
using BackendApi.Models;
using Microsoft.EntityFrameworkCore;

[Route("api/cities")]
[ApiController]
public class CitiesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CitiesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<City>>> GetCities()
    {
        return await _context.Set<City>().ToListAsync();
    }
}