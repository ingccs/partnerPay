using Microsoft.AspNetCore.Mvc;
using BackendApi.Data;
using BackendApi.Models;
using Microsoft.EntityFrameworkCore;

[Route("api/banks")]
[ApiController]
public class BanksController : ControllerBase
{
    private readonly AppDbContext _context;

    public BanksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Bank>>> GetBanks()
    {
        return await _context.Set<Bank>().ToListAsync();
    }
}