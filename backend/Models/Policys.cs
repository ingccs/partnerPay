using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("polizas")]
    public class Policy
    {
        [Key]
        [Column("idpoliza")]
        public int IdPoliza { get; set; }

        [Required]
        [Column("nro_policy")]
        public string NroPolicy { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        [Column("nro_receipt")]
        public string NroReceipt { get; set; } = string.Empty;

        [Required]
        [Column("cramo_sisip")]
        public int CRamoSisip { get; set; }

        [Required]
        [Column("plan")]
        public string Plan { get; set; } = string.Empty;

        [Required]
        [MaxLength(1)]
        [Column("frequency")]
        public string Frequency { get; set; } = string.Empty;

        [Required]
        [Column("date_emission")]
        public DateTime DateEmission { get; set; }

        [Required]
        [Column("date_admission")]
        public DateTime DateAdmission { get; set; }

        [Required]
        [Column("date_dd_policy")]
        public DateTime DateDdPolicy { get; set; }

        [Required]
        [Column("date_ht_policy")]
        public DateTime DateHtPolicy { get; set; }

        [Required]
        [Column("date_dd_receipt")]
        public DateTime DateDdReceipt { get; set; }

        [Required]
        [Column("date_ht_receipt")]
        public DateTime DateHtReceipt { get; set; }

        [Required]
        [Column("date_pay")]
        public DateTime DatePay { get; set; }

        [Required]
        [Column("prima", TypeName = "decimal(11,2)")]
        public decimal Prima { get; set; }

        [Required]
        [Column("yearpolicy")]
        public int YearPolicy { get; set; }

        [Required]
        [Column("monthpolicy")]
        public int MonthPolicy { get; set; }

        [Column("tasabcv", TypeName = "decimal(11,2)")]
        public decimal? TasaBcv { get; set; } // Permitido nulo (DEFAULT NULL)

        [Required]
        [Column("idcmpy")]
        public int IdCmpy { get; set; }

        [Required]
        [Column("idproduct")]
        public int IdProduct { get; set; }
    }
}