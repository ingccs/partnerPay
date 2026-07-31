using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("estatus")]
    public class AllEstatus
    {
        [Key]
        [Column("idestatus")]
        public int IdEstatus { get; set; }

        [Required]
        [Column("estatus")]
        public string Estatus { get; set; } = string.Empty;
    }
}