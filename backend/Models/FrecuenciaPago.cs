using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("frecuencia_pagos")]
    public class FrecuenciaPago
    {
        [Key]
        [Column("idfqcypay")]
        public int Idfqcypay { get; set; }

        [Column("freq")]
        public string Freq { get; set; } = string.Empty;

        [Column("num_dias")]
        public int NumDias { get; set; } = 1;
    }
}