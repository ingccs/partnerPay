using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("comisiones_ventas")]
    public class ComisionVenta
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("idcomision")]
        public int Idcomision { get; set; }

        [Column("idventa")]
        public int Idventa { get; set; }

        [Column("idseller")]
        public int Idseller { get; set; }

        [Column("nivel_beneficiario")]
        public int NivelBeneficiario { get; set; }

        [Column("porcentaje")]
        public decimal Porcentaje { get; set; }

        [Column("monto_comision")]
        public decimal MontoComision { get; set; }

        [Column("tipo_comision")]
        public string TipoComision { get; set; } = "DIRECTA";

        [Column("idestatus_pago")]
        public int IdestatusPago { get; set; } = 0; // 0 = Pendiente, 1 = Pagado

        [Column("idliquidacion")]
        public int? Idliquidacion { get; set; }

        [Column("fecha_registro")]
        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
    }
}