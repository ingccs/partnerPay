using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("parentesco")]
    public class Relationship
    {
        [Key]
        [Column("idparen")]
        public int IdParen { get; set; }

        [Required]
        [MaxLength(14)]
        [Column("parentesco")]
        public string ParentescoName { get; set; } = string.Empty;

        [Required]
        [Column("idestatus")]
        public int IdEstatus { get; set; }
    }
}