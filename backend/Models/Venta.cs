using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("ventas")]
    public class Venta
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idventa")]
        public int Idventa { get; set; }

        [Column("idseller")]
        public int Idseller { get; set; }

        [Column("idproduct")]
        public int Idproduct { get; set; }

        [Column("nro_poliza")]
        public string NroPoliza { get; set; } = string.Empty;

        [Column("nro_recibo")]
        public string NroRecibo { get; set; } = string.Empty;

        [Column("monto_prima")]
        public decimal MontoPrima { get; set; }

        [Column("fecha_emision")]
        public DateTime FechaEmision { get; set; } = DateTime.UtcNow;

        [Column("fecha_venta")]
        public DateTime FechaVenta { get; set; } = DateTime.UtcNow;
    }
}