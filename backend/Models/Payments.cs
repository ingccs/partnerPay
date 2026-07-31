using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("pagos")]
    public class Payment
    {
        [Key]
        [Column("idpago")]
        public int IdPago { get; set; }

        [Required]
        [Column("fec_dd")]
        public DateTime FecDd { get; set; }

        [Required]
        [Column("fec_ht")]
        public DateTime FecHt { get; set; }

        [Required]
        [Column("idhijo")]
        public int IdHijo { get; set; }

        [Required]
        [Column("mnt_pagado")]
        public int MntPagado { get; set; }

        [Required]
        [Column("frm_pago")]
        public int FrmPago { get; set; }

        [Required]
        [Column("referencia")]
        public string Referencia { get; set; } = string.Empty;

        [Required]
        [Column("fec_pago")]
        public DateTime FecPago { get; set; }
    }
}