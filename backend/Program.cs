using Microsoft.EntityFrameworkCore;
using BackendApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Configurar la conexión a PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configuramos CORS para permitir la conexión desde el puerto de React
var misPermisos = "_misPermisos";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: misPermisos,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

builder.Services.AddControllers();

var app = builder.Build();

// app.UseHttpsRedirection();

app.UseCors(misPermisos);

app.UseAuthorization();

app.MapControllers();

app.Run();