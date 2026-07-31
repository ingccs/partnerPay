using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("responseapis")]
    public class ApiResponse
    {
        [Key]
        [Column("idresponse")]
        public int IdResponse { get; set; }

        [Column("idprepoliza")]
        public int? IdPrepoliza { get; set; } // Permitido nulo

        [Column("respuesta")]
        public string? Respuesta { get; set; } // Permitido nulo

        [Column("jsonn")]
        public string? Jsonn { get; set; } // Permitido nulo (para almacenar cadenas JSON largas)
    }
}