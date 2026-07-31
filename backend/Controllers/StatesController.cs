using Microsoft.AspNetCore.Mvc;
using BackendApi.Data;
using BackendApi.Models;
using Microsoft.EntityFrameworkCore;

[Route("api/states")]
[ApiController]
public class StatesController : ControllerBase
{
    private readonly AppDbContext _context;

    public StatesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<State>>> GetStates()
    {
        return await _context.Set<State>().ToListAsync();
    }
}