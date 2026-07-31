using Microsoft.AspNetCore.Mvc;
using BackendApi.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
        {
            return BadRequest(new { message = "Debe proporcionar correo y contraseña." });
        }

        // Convertir la contraseña que escribió el usuario a SHA-256
        string passwordHash = ConvertirSha256(model.Password);

        // Buscar en la base de datos usando el hash generado
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserLogin == model.Email && u.Clave == passwordHash);

        if (user == null)
        {
            return Unauthorized(new { message = "Credenciales incorrectas" });
        }

        return Ok(new { 
            success = true, 
            email = user.UserLogin, 
            name = user.UserName 
        });
    }

    // Método auxiliar para encriptar en SHA-256 igual que en la BD
    private string ConvertirSha256(string texto)
    {
        using (SHA256 sha256Hash = SHA256.Create())
        {
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(texto));
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }
            return builder.ToString();
        }
    }
}

public class LoginDto
{
    public string Email { get; set; }
    public string Password { get; set; }
}