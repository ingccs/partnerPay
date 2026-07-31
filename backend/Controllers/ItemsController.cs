using Microsoft.AspNetCore.Mvc;
using BackendApi.Models;

[Route("api/[controller]")]
[ApiController]
public class ItemsController : ControllerBase
{
    // Una lista estática en memoria para simular la base de datos por ahora
    private static List<ItemModel> listaItems = new List<ItemModel>
    {
        new ItemModel { Id = 1, Nombre = "Laptop", Descripcion = "Computadora de trabajo" },
        new ItemModel { Id = 2, Nombre = "Teclado", Descripcion = "Teclado mecánico RGB" }
    };

    // 1. OBTENER TODOS (GET)
    [HttpGet]
    public ActionResult<IEnumerable<ItemModel>> Get()
    {
        return Ok(listaItems);
    }

    // 2. CREAR NUEVO (POST)
    [HttpPost]
    public ActionResult<ItemModel> Post([FromBody] ItemModel nuevoItem)
    {
        nuevoItem.Id = listaItems.Count > 0 ? listaItems.Max(i => i.Id) + 1 : 1;
        listaItems.Add(nuevoItem);
        return Ok(nuevoItem);
    }

    // 3. MODIFICAR / EDITAR (PUT)
    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] ItemModel itemActualizado)
    {
        var itemExistente = listaItems.FirstOrDefault(i => i.Id == id);
        if (itemExistente == null)
        {
            return NotFound();
        }

        itemExistente.Nombre = itemActualizado.Nombre;
        itemExistente.Descripcion = itemActualizado.Descripcion;

        return NoContent();
    }

    // 4. ELIMINAR (DELETE)
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var item = listaItems.FirstOrDefault(i => i.Id == id);
        if (item == null)
        {
            return NotFound();
        }

        listaItems.Remove(item);
        return NoContent();
    }
}