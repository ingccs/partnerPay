using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("products_coverage")]
    public class ProductCoverage
    {
        [Key]
        [Column("idcoverage")]
        public int IdCoverage { get; set; }

        [Required]
        [Column("idproduct")]
        public int IdProduct { get; set; }

        [Required]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("percent", TypeName = "decimal(11,2)")]
        public decimal Percent { get; set; }
    }
}