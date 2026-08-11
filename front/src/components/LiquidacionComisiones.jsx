import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5234/api';

export default function LiquidacionComisiones({ sellers = [] }) {
  const [comisionesPendientes, setComisionesPendientes] = useState([]);
  const [sellerSeleccionado, setSellerSeleccionado] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [referenciaPago, setReferenciaPago] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [cargando, setCargando] = useState(false);
  const [notificacion, setNotificacion] = useState({ show: false, mensaje: '', tipo: 'success' });

  const mostrarNotificacion = (mensaje, tipo = 'success') => {
    setNotificacion({ show: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: 'success' }), 4000);
  };

  const buscarComisionesAcumuladas = () => {
    if (!sellerSeleccionado || !fechaDesde || !fechaHasta) {
      mostrarNotificacion('Seleccione el afiliado y el rango completo de fechas.', 'error');
      return;
    }

    setCargando(true);
    fetch(`${API_URL}/comisiones/acumuladas?idseller=${sellerSeleccionado}&desde=${fechaDesde}&hasta=${fechaHasta}`)
      .then(res => res.json())
      .then(data => {
        const lista = Array.isArray(data) ? data : (data.data || data.$values || []);
        setComisionesPendientes(lista);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al consultar comisiones:", err);
        setComisionesPendientes([]);
        setCargando(false);
      });
  };

  const totalAcumulado = comisionesPendientes.reduce((acc, curr) => acc + (parseFloat(curr.montoComision) || 0), 0);
  const afiliadoObj = sellers.find(s => String(s.idseller) === String(sellerSeleccionado));
  const esManual = afiliadoObj && afiliadoObj.idestatus !== 1;

  const handleProcesarLiquidacion = (e) => {
    e.preventDefault();

    if (totalAcumulado <= 0) {
      mostrarNotificacion('No hay comisiones acumuladas pendientes por liquidar en el período.', 'error');
      return;
    }

    if (esManual && !referenciaPago.trim()) {
      mostrarNotificacion('Ingrese el número de referencia del pago externo.', 'error');
      return;
    }

    const payload = {
      idseller: parseInt(sellerSeleccionado),
      montoTotal: totalAcumulado,
      fechaDesde,
      fechaHasta,
      tipoPago: esManual ? 'MANUAL' : 'AUTOMATICO',
      referenciaPago: esManual ? referenciaPago.trim() : 'PAGO_ONLINE_AUT',
      observaciones: observaciones.trim(),
      idsComisiones: comisionesPendientes.map(c => c.idcomision)
    };

    fetch(`${API_URL}/comisiones/liquidar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.text();
          throw new Error(err);
        }
        return res.json();
      })
      .then(() => {
        mostrarNotificacion('¡Liquidación procesada e historial actualizado con éxito!');
        setComisionesPendientes([]);
        setReferenciaPago('');
        setObservaciones('');
      })
      .catch(err => {
        mostrarNotificacion(`Error: ${err.message}`, 'error');
      });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notificación */}
      {notificacion.show && (
        <div className="fixed top-6 right-6 z-50 animate-bounce duration-300">
          <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border-2 text-white font-bold backdrop-blur-md ${
            notificacion.tipo === 'success' ? 'bg-emerald-600/95 border-emerald-400' : 'bg-rose-600/95 border-rose-400'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0">
              {notificacion.tipo === 'success' ? '🎉' : '⚠️'}
            </div>
            <div>
              <h4 className="text-xs uppercase font-black text-white/80">
                {notificacion.tipo === 'success' ? '¡Operación Exitosa!' : '¡Atención!'}
              </h4>
              <p className="text-sm font-extrabold text-white mt-0.5">{notificacion.mensaje}</p>
            </div>
            <button onClick={() => setNotificacion({ ...notificacion, show: false })} className="ml-2 text-white/70 hover:text-white">✕</button>
          </div>
        </div>
      )}

      {/* Selector de Rango y Afiliado */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2 pb-3 border-b border-zinc-100">
          <span>💳</span> Liquidación de Comisiones y Residuales por Rango
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Afiliado / Vendedor *
            </label>
            <select
              value={sellerSeleccionado}
              onChange={(e) => setSellerSeleccionado(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
            >
              <option value="">-- Seleccionar Afiliado --</option>
              {sellers.map(s => (
                <option key={s.idseller} value={s.idseller}>
                  [{s.nivel ? `Nivel ${s.nivel}` : 'S/N'}] {s.name} {s.lastname} ({s.typ}-{s.ci}) - Status: {s.idestatus === 1 ? 'Online' : 'Manual'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Fecha Desde *
            </label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Fecha Hasta *
            </label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={buscarComisionesAcumuladas}
            className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
          >
            Consultar Acumulado Pendiente
          </button>
        </div>
      </div>

      {/* Resumen del Período y Formulario de Carga */}
      {afiliadoObj && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-zinc-50 rounded-2xl border border-zinc-200">
            <div>
              <span className="text-xs uppercase font-extrabold text-zinc-400 block tracking-wider">Afiliado Beneficiario</span>
              <h3 className="text-base font-bold text-zinc-900">{afiliadoObj.name} {afiliadoObj.lastname}</h3>
              <span className="text-xs text-zinc-500 font-mono">Modo de Pago: {esManual ? 'Manual / Comprobante Externo' : 'Automático / Online'}</span>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase font-extrabold text-zinc-400 block tracking-wider">Monto Acumulado a Liquidar</span>
              <span className="text-2xl font-black font-mono text-emerald-700">
                Bs {Number(totalAcumulado).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <form onSubmit={handleProcesarLiquidacion} className="space-y-4">
            {esManual ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 bg-amber-50/50 rounded-2xl border border-amber-200/80">
                <div>
                  <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                    N° Referencia / Comprobante Externo *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. REF-992838112"
                    value={referenciaPago}
                    onChange={(e) => setReferenciaPago(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border border-amber-300 rounded-xl text-zinc-900 text-sm font-mono font-bold focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                    Observaciones / Nota
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Pago realizado por transferencia manual Banesco"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-amber-300 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between">
                <span>✓ Afiliado con cuenta bancaria activa. La orden de dispersión se procesará vía API pagadora.</span>
                <span className="font-mono">{afiliadoObj.banco} - {afiliadoObj.nrocta}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={totalAcumulado <= 0}
                className={`px-8 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all ${
                  totalAcumulado > 0
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer'
                    : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                }`}
              >
                {esManual ? 'Registrar Pago Manual y Limpiar Período' : 'Generar Orden de Liquidación Online'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}