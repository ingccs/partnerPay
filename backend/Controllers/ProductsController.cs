using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendApi.Data;
using BackendApi.Models;

namespace BackendApi.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            try
            {
                var products = await _context.Products
                    .Include(p => p.Coverages)
                    .AsNoTracking()
                    .OrderByDescending(p => p.Idproduct)
                    .ToListAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                var msg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                Console.WriteLine($"❌ ERROR GET /api/products: {msg}");
                return StatusCode(500, $"Error en servidor: {msg}");
            }
        }

        // GET: api/products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Coverages)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.Idproduct == id);

                if (product == null) return NotFound();

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // POST: api/products
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct([FromBody] Product product)
        {
            try
            {
                // Separar coberturas para asignación limpia de ID
                var coberturas = product.Coverages ?? new List<ProductCoverage>();
                product.Coverages = new List<ProductCoverage>();

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                // Asignar el ID recién generado por PostgreSQL a las coberturas
                if (coberturas.Count > 0)
                {
                    foreach (var cov in coberturas)
                    {
                        cov.Idcoverage = 0; // Dejar que la secuencia de PostgreSQL genere el PK
                        cov.Idproduct = product.Idproduct;
                        cov.Product = null;
                        _context.ProductsCoverage.Add(cov);
                    }
                    await _context.SaveChangesAsync();
                }

                // Cargar el producto completo para retorno
                var productoGuardado = await _context.Products
                    .Include(p => p.Coverages)
                    .FirstOrDefaultAsync(p => p.Idproduct == product.Idproduct);

                return CreatedAtAction(nameof(GetProduct), new { id = product.Idproduct }, productoGuardado);
            }
            catch (Exception ex)
            {
                var innerMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                Console.WriteLine($"❌ ERROR POST /api/products: {innerMsg}");
                return StatusCode(500, $"Error en servidor: {innerMsg}");
            }
        }

        // PUT: api/products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, [FromBody] Product product)
        {
            if (id != product.Idproduct) return BadRequest("El ID no coincide.");

            var existingProduct = await _context.Products
                .Include(p => p.Coverages)
                .FirstOrDefaultAsync(p => p.Idproduct == id);

            if (existingProduct == null) return NotFound();

            existingProduct.Idcmpy = product.Idcmpy;
            existingProduct.Idramo = product.Idramo;
            existingProduct.CramoSisip = product.CramoSisip;
            existingProduct.IdProductoSisip = product.IdProductoSisip;
            existingProduct.CplanSisip = product.CplanSisip;
            existingProduct.Idestatus = product.Idestatus;

            // Reemplazar coberturas de forma segura
            _context.ProductsCoverage.RemoveRange(existingProduct.Coverages);

            if (product.Coverages != null && product.Coverages.Count > 0)
            {
                foreach (var cov in product.Coverages)
                {
                    cov.Idcoverage = 0;
                    cov.Idproduct = id;
                    cov.Product = null;
                    _context.ProductsCoverage.Add(cov);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                var innerMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                Console.WriteLine($"❌ ERROR PUT /api/products/{id}: {innerMsg}");
                return StatusCode(500, $"Error en servidor: {innerMsg}");
            }
        }

        // DELETE: api/products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null) return NotFound();

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}