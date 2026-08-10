using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("historial_balances")]
    public class HistorialBalance
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idhistorial")]
        public int Idhistorial { get; set; }

        [Column("idctapay")]
        public int Idctapay { get; set; }

        [Column("monto_anterior")]
        public decimal MontoAnterior { get; set; }

        [Column("monto_nuevo")]
        public decimal MontoNuevo { get; set; }

        [Column("fecha_registro")]
        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
    }
}