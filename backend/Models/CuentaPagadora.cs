using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("cuentas_pagadoras")]
    public class CuentaPagadora
    {
        [Key]
        [Column("idctapay")]
        public int Idctapay { get; set; }

        [Column("type")]
        public string Type { get; set; } = string.Empty;

        [Column("rif")]
        public string Rif { get; set; } = string.Empty;

        [Column("titular")]
        public string Titular { get; set; } = string.Empty;

        [Column("banco")]
        public string Banco { get; set; } = string.Empty;

        [Column("mobile")]
        public string Mobile { get; set; } = string.Empty;

        [Column("nrocta")]
        public string Nrocta { get; set; } = string.Empty;

        [Column("balance")]
        public decimal Balance { get; set; }
    }
}