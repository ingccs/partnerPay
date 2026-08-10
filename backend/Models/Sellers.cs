using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("sellers")]
    public class Seller
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idseller")]
        public int Idseller { get; set; }

        [Column("idpapa")]
        public int Idpapa { get; set; } = 0;

        [Column("code")]
        public string? Code { get; set; }

        [Column("typ")]
        public string Typ { get; set; } = "V";

        [Column("ci")]
        public string Ci { get; set; } = string.Empty;

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("lastname")]
        public string Lastname { get; set; } = string.Empty;

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("mobile")]
        public string Mobile { get; set; } = string.Empty;

        [Column("comission")]
        public decimal? Comission { get; set; } = 0.00m;

        [Column("cestado")]
        public int Cestado { get; set; }

        [Column("xcity")]
        public string Xcity { get; set; } = string.Empty;

        [Column("xdir")]
        public string Xdir { get; set; } = string.Empty;

        [Column("ecivil")]
        public string Ecivil { get; set; } = "S";

        [Column("sexx")]
        public string Sexx { get; set; } = "M";

        [Column("fecha_nac")]
        public DateTime FechaNac { get; set; } = DateTime.UtcNow;

        [Column("banco")]
        public string? Banco { get; set; }

        [Column("nrocta")]
        public string? Nrocta { get; set; }

        [Column("pdf_ced")]
        public byte[]? PdfCed { get; set; }

        [Column("pdf_rif")]
        public byte[]? PdfRif { get; set; }

        [Column("nivel")]
        public int Nivel { get; set; } = 1;

        [Column("fpay")]
        public int Fpay { get; set; } = 1;

        [Column("idestatus")]
        public int Idestatus { get; set; } = 1;
    }
}