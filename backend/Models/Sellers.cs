using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("sellers")]
    public class Seller
    {
        [Key]
        [Column("idseller")]
        public int IdSeller { get; set; }

        [Required]
        [Column("idpapa")]
        public int IdPapa { get; set; }

        [Required]
        [MaxLength(8)]
        [Column("code")]
        public string Code { get; set; } = string.Empty;

        [Required]
        [MaxLength(1)]
        [Column("typ")]
        public string Typ { get; set; } = string.Empty;

        [Required]
        [MaxLength(9)]
        [Column("ci")]
        public string Ci { get; set; } = string.Empty;

        [Required]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("lastname")]
        public string Lastname { get; set; } = string.Empty;

        [Required]
        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Column("mobile")]
        public string Mobile { get; set; } = string.Empty;

        [Column("comission", TypeName = "decimal(11,2)")]
        public decimal? Comission { get; set; }

        [Column("cestado")]
        public int? CEstato { get; set; }

        [Column("xcity")]
        public string? XCity { get; set; }

        [Column("xdir")]
        public string? XDir { get; set; }

        [MaxLength(1)]
        [Column("ecivil")]
        public string? ECivil { get; set; }

        [MaxLength(1)]
        [Column("sexx")]
        public string? Sexx { get; set; }

        [Column("fecha_nac")]
        public DateTime? FechaNac { get; set; }

        [Column("banco")]
        public string? Banco { get; set; }

        [MaxLength(20)]
        [Column("nrocta")]
        public string? NroCta { get; set; }

        [Column("pdf_ced", TypeName = "bytea")]
        public byte[]? PdfCed { get; set; } // Mapeo para archivos binarios (cédula)

        [Column("pdf_rif", TypeName = "bytea")]
        public byte[]? PdfRif { get; set; } // Mapeo para archivos binarios (RIF)

        [Column("nivel")]
        public int? Nivel { get; set; }

        [MaxLength(8)]
        [Column("fpay")]
        public string? FPay { get; set; }

        [Column("idestatus")]
        public int? IdEstatus { get; set; } = 1;
    }
}