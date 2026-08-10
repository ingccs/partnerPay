import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5234/api';

export default function ActualizarSaldos() {
  const [cuentas, setCuentas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState('');
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [notificacion, setNotificacion] = useState({ show: false, mensaje: '', tipo: 'success' });

  // Control para expandir o contraer el formulario (inicia contraído)
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    cargarCuentas();
    cargarHistorial();
  }, []);

  const mostrarNotificacion = (mensaje, tipo = 'success') => {
    setNotificacion({ show: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: 'success' }), 4000);
  };

  const cargarCuentas = () => {
    setCargando(true);
    fetch(`${API_URL}/cuentas-pagadoras`)
      .then(res => res.json())
      .then(data => {
        const lista = Array.isArray(data) ? data : (data.data || data.$values || []);
        setCuentas(lista);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar cuentas:", err);
        setCuentas([]);
        setCargando(false);
      });
  };

  const cargarHistorial = (id = '') => {
    const query = id ? `?idctapay=${id}` : '';
    fetch(`${API_URL}/cuentas-pagadoras/historial-balances${query}`)
      .then(res => res.json())
      .then(data => {
        const lista = Array.isArray(data) ? data : (data.data || data.$values || []);
        setHistorial(lista);
      })
      .catch(err => {
        console.error("Error al cargar historial:", err);
        setHistorial([]);
      });
  };

  const handleSeleccionarCuenta = (e) => {
    const id = e.target.value;
    setCuentaSeleccionada(id);
    const c = cuentas.find(item => String(item.idctapay) === String(id));
    if (c) {
      setNuevoMonto(c.balance || '');
    } else {
      setNuevoMonto('');
    }
    cargarHistorial(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cuentaSeleccionada || nuevoMonto === '') {
      mostrarNotificacion('Por favor seleccione una cuenta e ingrese el nuevo saldo.', 'error');
      return;
    }

    const payload = {
      idctapay: parseInt(cuentaSeleccionada),
      nuevoBalance: parseFloat(nuevoMonto)
    };

    fetch(`${API_URL}/cuentas-pagadoras/actualizar-balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText);
        }
        return res.json();
      })
      .then(() => {
        mostrarNotificacion('¡Saldo actualizado y registrado en historial con éxito!');
        setCuentaSeleccionada('');
        setNuevoMonto('');
        setMostrarFormulario(false);
        cargarCuentas();
        cargarHistorial();
      })
      .catch(err => {
        console.error("Error al actualizar saldo:", err);
        mostrarNotificacion('Hubo un error al actualizar el saldo de la cuenta.', 'error');
      });
  };

  const cuentaActualObj = cuentas.find(c => String(c.idctapay) === String(cuentaSeleccionada));

  return (
    <div className="space-y-6">
      {/* Toast Notificación */}
      {notificacion.show && (
        <div className="fixed top-6 right-6 z-50 animate-bounce duration-300">
          <div
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border-2 text-white font-bold backdrop-blur-md transition-all transform scale-105 ${
              notificacion.tipo === 'success'
                ? 'bg-emerald-600/95 border-emerald-400 shadow-emerald-900/30'
                : 'bg-rose-600/95 border-rose-400 shadow-rose-900/30'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0">
              {notificacion.tipo === 'success' ? '🎉' : '⚠️'}
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-white/80 font-black">
                {notificacion.tipo === 'success' ? '¡Operación Exitosa!' : '¡Atención!'}
              </h4>
              <p className="text-sm font-extrabold text-white mt-0.5">
                {notificacion.mensaje}
              </p>
            </div>
            <button
              onClick={() => setNotificacion({ ...notificacion, show: false })}
              className="ml-2 text-white/70 hover:text-white text-sm p-1 rounded-lg transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Barra de Acciones y Toggle del Formulario */}
      <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <span>💵</span> Actualización Manual de Saldos
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Carga de saldos y registro de auditoría para cuentas pagadoras
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (mostrarFormulario) {
              setCuentaSeleccionada('');
              setNuevoMonto('');
            }
            setMostrarFormulario(!mostrarFormulario);
          }}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
            mostrarFormulario
              ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
              : 'bg-zinc-900 hover:bg-zinc-800 text-white'
          }`}
        >
          <span>{mostrarFormulario ? '✕ Ocultar Formulario' : '➕ Actualizar Saldo'}</span>
        </button>
      </div>

      {/* Formulario Desplegable */}
      {mostrarFormulario && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-100">
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <span>💵</span> Actualización Manual de Saldos en Cuentas Pagadoras
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Selector de Cuenta */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  Seleccionar Cuenta Pagadora *
                </label>
                <select
                  value={cuentaSeleccionada}
                  onChange={handleSeleccionarCuenta}
                  required
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
                >
                  <option value="">-- Seleccione una Cuenta Pagadora --</option>
                  {cuentas.map((c) => (
                    <option key={c.idctapay} value={c.idctapay}>
                      {c.banco} | {c.titular} ({c.type}-{c.rif}) - N° {c.nrocta}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nuevo Saldo */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  Nuevo Balance (Bs) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={nuevoMonto}
                  onChange={(e) => setNuevoMonto(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-mono font-bold focus:outline-none focus:border-zinc-900"
                />
              </div>
            </div>

            {/* Resumen del saldo actual al seleccionar */}
            {cuentaActualObj && (
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between text-xs font-medium">
                <span className="text-zinc-600">
                  Saldo Actual Registrado: <strong className="text-zinc-900 font-mono">Bs {Number(cuentaActualObj.balance || 0).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</strong>
                </span>
                <span className="text-zinc-400 font-mono">ID Cuenta #{cuentaActualObj.idctapay}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCuentaSeleccionada('');
                  setNuevoMonto('');
                  setMostrarFormulario(false);
                }}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-sm px-5 py-3 rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Actualizar Saldo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de Auditoría / Historial Visible por Defecto */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Historial y Auditoría de Saldos Cargados</h3>
            <p className="text-xs text-zinc-500">Registro cronológico de fecha, hora y variaciones de monto por cuenta</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-4 px-6">ID Historial</th>
                <th className="py-4 px-6">Cuenta Pagadora</th>
                <th className="py-4 px-6 text-right">Saldo Anterior</th>
                <th className="py-4 px-6 text-right">Nuevo Saldo</th>
                <th className="py-4 px-6 text-center">Fecha y Hora de Carga</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {cargando ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-zinc-400">
                    Cargando historial de balances...
                  </td>
                </tr>
              ) : historial.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-zinc-400">
                    No se registran cambios de saldo en el historial.
                  </td>
                </tr>
              ) : (
                historial.map((h) => {
                  const cuentaObj = cuentas.find(c => c.idctapay === h.idctapay);
                  const nombreCuenta = cuentaObj ? `${cuentaObj.banco} (${cuentaObj.titular})` : `Cuenta #${h.idctapay}`;
                  const fechaFmt = new Date(h.fechaRegistro).toLocaleString('es-VE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  });

                  return (
                    <tr key={h.idhistorial} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-zinc-500">#{h.idhistorial}</td>
                      <td className="py-4 px-6 font-bold text-zinc-900 text-sm">{nombreCuenta}</td>
                      <td className="py-4 px-6 text-right font-mono text-zinc-500 text-xs">
                        Bs {Number(h.montoAnterior || 0).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-emerald-700 text-sm">
                        Bs {Number(h.montoNuevo || 0).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-center font-mono text-xs text-zinc-600">
                        {fechaFmt}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}