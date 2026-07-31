using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("maciudades")]
    public class City
    {
        [Key]
        [Column("idciudad")]
        public int IdCiudad { get; set; }

        [Required]
        [Column("cpais")]
        public int CPais { get; set; }

        [Required]
        [Column("cestado")]
        public int CEstado { get; set; }

        [Required]
        [Column("cciudad")]
        public int CCiudad { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("ciu_descripcion_l")]
        public string CiuDescripcionL { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [Column("ciu_descripcion_c")]
        public string CiuDescripcionC { get; set; } = string.Empty;
    }
}