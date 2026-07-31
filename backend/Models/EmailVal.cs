using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("validaciones_email")]
    public class EmailValidation
    {
        [Key]
        [Column("idvalidacion")]
        public int IdValidacion { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("correo")]
        public string Correo { get; set; } = string.Empty;

        [Required]
        [Column("codigo")]
        public int Codigo { get; set; }

        [Required]
        [Column("idestatus")]
        public int IdEstatus { get; set; }
    }
}