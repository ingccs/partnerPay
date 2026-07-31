using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("products_user")]
    public class ProductUser
    {
        [Key]
        [Column("idoption")]
        public int IdOption { get; set; }

        [Required]
        [Column("idseller")]
        public int IdSeller { get; set; }

        [Required]
        [Column("idproduct")]
        public int IdProduct { get; set; }

        [Required]
        [Column("permiso")]
        public int Permiso { get; set; }

        [Required]
        [Column("comission", TypeName = "decimal(11,2)")]
        public decimal Comission { get; set; } = 0.00m;
    }
}