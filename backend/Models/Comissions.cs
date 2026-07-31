using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("comissions")]
    public class Comission
    {
        [Key]
        [Column("idcomission")]
        public int IdComission { get; set; }

        [Required]
        [Column("idpoliza")]
        public int IdPoliza { get; set; }

        [Required]
        [Column("code")]
        public int Code { get; set; }

        [Column("idcoverage")]
        public int? IdCoverage { get; set; } // Permitido nulo

        [Required]
        [Column("comission", TypeName = "decimal(11,2)")]
        public decimal CommissionAmount { get; set; }

        [Required]
        [Column("date_register")]
        public DateTime DateRegister { get; set; } = DateTime.Now;

        [Required]
        [Column("enviado")]
        public int Enviado { get; set; } = 0;

        [Column("date_send")]
        public DateTime? DateSend { get; set; } // Permitido nulo

        [Required]
        [Column("pagado")]
        public int Pagado { get; set; } = 0;

        [Column("date_pay")]
        public DateTime? DatePay { get; set; } // Permitido nulo

        [Column("ref_pay")]
        public string? RefPay { get; set; } // Permitido nulo
    }
}