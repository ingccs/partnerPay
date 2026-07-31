using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("maestados")]
    public class State
    {
        [Key]
        [Column("idestado")]
        public int IdEstado { get; set; }

        [Required]
        [Column("cpais")]
        public int CPais { get; set; }

        [Required]
        [Column("cestado")]
        public int CEstado { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("xdescripcion_l")]
        public string XDescripcionL { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        [Column("xdescripcion_c")]
        public string XDescripcionC { get; set; } = string.Empty;
    }
}