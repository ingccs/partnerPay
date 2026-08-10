import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5234/api';

export default function FrecuenciasPago() {
  const [frecuencias, setFrecuencias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [notificacion, setNotificacion] = useState({ show: false, mensaje: '', tipo: 'success' });

  // Estado Edición
  const [idEditando, setIdEditando] = useState(null);

  // Campos Formulario
  const [freq, setFreq] = useState('');
  const [numDias, setNumDias] = useState(1);

  useEffect(() => {
    cargarFrecuencias();
  }, []);

  const mostrarNotificacion = (mensaje, tipo = 'success') => {
    setNotificacion({ show: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: 'success' }), 4000);
  };

  const cargarFrecuencias = () => {
    setCargando(true);
    fetch(`${API_URL}/frecuencias-pago`)
      .then(async res => {
        if (!res.ok) {
          const errorMsg = await res.text();
          throw new Error(`HTTP Error ${res.status}: ${errorMsg}`);
        }
        return res.json();
      })
      .then(data => {
        const lista = Array.isArray(data) ? data : (data.data || data.$values || []);
        setFrecuencias(lista);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar frecuencias de pago:", err);
        setFrecuencias([]);
        setCargando(false);
      });
  };

  const limpiarFormulario = () => {
    setIdEditando(null);
    setFreq('');
    setNumDias(1);
  };

  const seleccionarParaEditar = (item) => {
    const id = item.idfqcypay ?? item.idFqcypay ?? item.id;
    const nombreFreq = item.freq ?? item.Freq ?? '';
    const dias = item.numDias ?? item.num_dias ?? 1;

    setIdEditando(id);
    setFreq(nombreFreq);
    setNumDias(dias);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!freq.trim()) {
      mostrarNotificacion('Por favor ingrese la frecuencia de pago.', 'error');
      return;
    }

    const payload = {
      idfqcypay: idEditando || 0,
      freq: freq.trim(),
      numDias: parseInt(numDias) || 0
    };

    const esEdicion = idEditando !== null;
    const url = esEdicion ? `${API_URL}/frecuencias-pago/${idEditando}` : `${API_URL}/frecuencias-pago`;
    const metodo = esEdicion ? 'PUT' : 'POST';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        return res.status === 204 ? null : res.json();
      })
      .then(() => {
        limpiarFormulario();
        cargarFrecuencias();
        mostrarNotificacion(esEdicion ? '¡Frecuencia modificada con éxito!' : '¡Frecuencia de pago creada con éxito!');
      })
      .catch(err => {
        console.error("Error al procesar frecuencia:", err);
        mostrarNotificacion('Hubo un error al procesar la frecuencia de pago.', 'error');
      });
  };

  const eliminarFrecuencia = (id) => {
    if (!window.confirm("¿Desea eliminar esta frecuencia de pago permanentemente?")) return;

    fetch(`${API_URL}/frecuencias-pago/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error("Error al eliminar");
        if (idEditando === id) limpiarFormulario();
        cargarFrecuencias();
        mostrarNotificacion('Frecuencia eliminada correctamente.');
      })
      .catch(err => {
        console.error("Error al eliminar frecuencia:", err);
        mostrarNotificacion('No se pudo eliminar la frecuencia de pago.', 'error');
      });
  };

  const frecuenciasFiltradas = frecuencias.filter(item => {
    const term = busqueda.toLowerCase();
    const descripcion = String(item.freq ?? item.Freq ?? '').toLowerCase();
    return descripcion.includes(term);
  });

  return (
    <div className="space-y-8">
      {/* Notificación Flotante de Alto Impacto (Toast) */}
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

      {/* Formulario de Registro / Edición */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-100">
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <span>📅</span> {idEditando ? `Modificar Frecuencia #${idEditando}` : 'Frecuencia de Liquidación de Pago'}
          </h2>
          {idEditando && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">
              Modo Edición Activo
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Frecuencia de Pago (Freq) *
              </label>
              <input
                type="text"
                placeholder="EJ: Inmediato, Semanal, Quincenal..."
                value={freq}
                onChange={(e) => setFreq(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Cantidad de Días *
              </label>
              <input
                type="number"
                min="0"
                placeholder="Ej: 1, 7, 15, 30"
                value={numDias}
                onChange={(e) => setNumDias(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-mono font-bold focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {idEditando && (
              <button
                type="button"
                onClick={limpiarFormulario}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-sm px-5 py-3 rounded-xl transition-all cursor-pointer"
              >
                Cancelar Edición
              </button>
            )}
            <button
              type="submit"
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {idEditando ? 'Guardar Cambios' : 'Crear Frecuencia de Pago'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Registros */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Frecuencias de Pago Registradas</h3>
            <p className="text-xs text-zinc-500">Configuración general de intervalos de pago y días correspondientes</p>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Buscar frecuencia..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl p-2.5 focus:outline-none focus:border-zinc-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Frecuencia de Pago</th>
                <th className="py-4 px-6 text-center">Cantidad de Días</th>
                <th className="py-4 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {cargando ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-zinc-400">
                    Cargando frecuencias de pago...
                  </td>
                </tr>
              ) : frecuenciasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-zinc-400">
                    No se encontraron frecuencias registradas.
                  </td>
                </tr>
              ) : (
                frecuenciasFiltradas.map((item) => {
                  const id = item.idfqcypay ?? item.idFqcypay ?? item.id;
                  const nombreFreq = item.freq ?? item.Freq ?? 'Sin Nombre';
                  const dias = item.numDias ?? item.num_dias ?? 0;

                  return (
                    <tr key={id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-zinc-500">#{id}</td>
                      <td className="py-4 px-6 font-bold text-zinc-900 text-sm">{nombreFreq}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-block font-mono font-bold text-xs bg-zinc-100 text-zinc-800 px-3 py-1 rounded-lg border border-zinc-200">
                          {dias} {dias === 1 ? 'día' : 'días'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => seleccionarParaEditar(item)}
                            title="Editar frecuencia"
                            className="p-2 text-zinc-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => eliminarFrecuencia(id)}
                            title="Eliminar frecuencia"
                            className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
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