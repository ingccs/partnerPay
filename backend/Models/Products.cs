using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        [Column("idproduct")]
        public int IdProduct { get; set; }

        [Required]
        [Column("idcmpy")]
        public int IdCmpy { get; set; }

        [Required]
        [Column("idramo")]
        public int IdRamo { get; set; }

        [Column("cramo_sisip")]
        public int? CRamoSisip { get; set; } // Permitido nulo (DEFAULT NULL)

        [Required]
        [Column("id_producto_sisip")]
        public int IdProductoSisip { get; set; }

        [Required]
        [Column("cplan_sisip")]
        public string CPlanSisip { get; set; } = string.Empty;

        [Required]
        [Column("idestatus")]
        public int IdEstatus { get; set; }
    }
}