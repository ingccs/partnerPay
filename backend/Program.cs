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

// Configuración de Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "PartnerPay Enterprise Suite API",
        Version = "v1",
        Description = "Documentación oficial e interactiva de servicios web para PartnerPay."
    });
});

var app = builder.Build();

// Mostrar página detallada de excepciones e interfaz de Swagger en entorno de desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "PartnerPay API v1");
        // Deja Swagger directamente en la raíz para acceso inmediato
        c.RoutePrefix = string.Empty;
    });
}

// app.UseHttpsRedirection();

app.UseCors(misPermisos);

app.UseAuthorization();

app.MapControllers();

app.Run();