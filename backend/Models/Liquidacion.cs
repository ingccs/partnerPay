using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("liquidaciones")]
    public class Liquidacion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idliquidacion")]
        public int Idliquidacion { get; set; }

        [Column("idseller")]
        public int Idseller { get; set; }

        [Column("monto_total")]
        public decimal MontoTotal { get; set; }

        [Column("fecha_desde")]
        public DateTime FechaDesde { get; set; }

        [Column("fecha_hasta")]
        public DateTime FechaHasta { get; set; }

        [Column("tipo_pago")]
        public string TipoPago { get; set; } = "MANUAL";

        [Column("referencia_pago")]
        public string? ReferenciaPago { get; set; }

        [Column("observaciones")]
        public string? Observaciones { get; set; }

        [Column("fecha_pago")]
        public DateTime FechaPago { get; set; } = DateTime.UtcNow;
    }
}