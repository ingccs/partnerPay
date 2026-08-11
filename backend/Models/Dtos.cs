using System;
using System.Collections.Generic;

namespace BackendApi.Models
{
    public class RegistrarVentaDto
    {
        public int Idseller { get; set; }
        public int Idproduct { get; set; }
        public string NroPoliza { get; set; } = string.Empty;
        public string NroRecibo { get; set; } = string.Empty;
        public decimal MontoPrima { get; set; }
        public DateTime FechaEmision { get; set; }
    }

    public class LiquidarComisionesDto
    {
        public int Idseller { get; set; }
        public decimal MontoTotal { get; set; }
        public DateTime FechaDesde { get; set; }
        public DateTime FechaHasta { get; set; }
        public string TipoPago { get; set; } = "MANUAL";
        public string? ReferenciaPago { get; set; }
        public string? Observaciones { get; set; }
        public List<int> IdsComisiones { get; set; } = new();
    }
}