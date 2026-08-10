using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idproduct")]
        public int Idproduct { get; set; }

        [Column("idcmpy")]
        public int Idcmpy { get; set; }

        [Column("idramo")]
        public int Idramo { get; set; }

        [Column("cramo_sisip")]
        public int? CramoSisip { get; set; }

        [Column("id_producto_sisip")]
        public int? IdProductoSisip { get; set; }

        [Column("cplan_sisip")]
        public string? CplanSisip { get; set; }

        [Column("idestatus")]
        public int Idestatus { get; set; } = 1;

        // Mapeo explícito de la lista de coberturas
        [InverseProperty("Product")]
        public List<ProductCoverage> Coverages { get; set; } = new();
    }

    [Table("products_coverage")]
    public class ProductCoverage
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idcoverage")]
        public int Idcoverage { get; set; }

        [Column("idproduct")]
        public int Idproduct { get; set; }

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("percent")]
        public decimal Percent { get; set; }

        // Mapeo explícito de la clave foránea hacia Product
        [ForeignKey("Idproduct")]
        [InverseProperty("Coverages")]
        public Product? Product { get; set; }
    }
}