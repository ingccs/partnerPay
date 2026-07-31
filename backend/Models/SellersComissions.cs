using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Models
{
    [Table("seller_coverage_comission")]
    [PrimaryKey(nameof(IdSeller), nameof(IdCoverage))] // Configuración de Clave Primaria Compuesta
    public class SellerCoverageComission
    {
        [Column("idseller")]
        public int IdSeller { get; set; }

        [MaxLength(8)]
        [Column("code")]
        public string? Code { get; set; }

        [Column("idcoverage")]
        public int IdCoverage { get; set; }

        [Column("comission", TypeName = "decimal(11,2)")]
        public decimal? Comission { get; set; }
    }
}