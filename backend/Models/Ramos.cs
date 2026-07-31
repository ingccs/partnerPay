using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("ramos")]
    public class Ramo
    {
        [Key]
        [Column("idramo")]
        public int IdRamo { get; set; }

        [Column("cramo_sisip")]
        public int? CRamoSisip { get; set; } // Permitido nulo

        [Required]
        [Column("xramo_sisip")]
        public string XRamoSisip { get; set; } = string.Empty;

        [Column("condicionado", TypeName = "bytea")]
        public byte[]? Condicionado { get; set; } // Mapeo óptimo para longblob / BLOB en PostgreSQL
    }
}