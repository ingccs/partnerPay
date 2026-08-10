using Microsoft.EntityFrameworkCore;
using BackendApi.Data;
using System.Text.Json.Serialization;
using System.Text.Json;

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

// Configuración de Controladores + Evitar ciclos de serialización JSON en Entity Framework
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Ignora referencias circulares al incluir relaciones como Products -> Coverages
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        // Fuerza nombres de propiedades compatibles con React (camelCase)
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

var app = builder.Build();

// Mostrar página detallada de excepciones en entorno de desarrollo para diagnóstico rápido
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// app.UseHttpsRedirection();

app.UseCors(misPermisos);

app.UseAuthorization();

app.MapControllers();

app.Run();