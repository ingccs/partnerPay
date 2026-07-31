using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("banks")] // Nombre opcional para la tabla en PostgreSQL
    public class Bank
    {
        [Key]
        [Column("idbco")]
        public int IdBco { get; set; }

        [Required]
        [MaxLength(4)]
        [Column("cbanco")]
        public string CBanco { get; set; } = string.Empty;

        [Required]
        [Column("xbanco")]
        public string XBanco { get; set; } = string.Empty;

        [Required]
        [Column("idestatus")]
        public int IdEstatus { get; set; }
    }
}