import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5234/api';

export default function Productos({ companiesList = [], ramosList = [] }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [notificacion, setNotificacion] = useState({ show: false, mensaje: '', tipo: 'success' });

  // Control para expandir o contraer el formulario (inicia contraído)
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [idEditando, setIdEditando] = useState(null);

  const [idcmpy, setIdcmpy] = useState('');
  const [idramo, setIdramo] = useState('');
  const [cramoSisip, setCramoSisip] = useState('');
  const [idProductoSisip, setIdProductoSisip] = useState('');
  const [cplanSisip, setCplanSisip] = useState('');
  const [idestatus, setIdestatus] = useState(1);

  const [coverages, setCoverages] = useState([
    { name: '', percent: '' }
  ]);

  const empresasSeguras = Array.isArray(companiesList) ? companiesList : [];
  const ramosSeguros = Array.isArray(ramosList) ? ramosList : [];

  useEffect(() => {
    cargarProductos();
  }, []);

  const mostrarNotificacion = (mensaje, tipo = 'success') => {
    setNotificacion({ show: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: 'success' }), 4000);
  };

  const cargarProductos = () => {
    setCargando(true);
    fetch(`${API_URL}/products`)
      .then(async res => {
        if (!res.ok) {
          const textErr = await res.text();
          console.error("❌ RESPUESTA ERROR EN GET /api/products:", res.status, textErr);
          throw new Error(`HTTP Error ${res.status}: ${textErr}`);
        }
        return res.json();
      })
      .then(data => {
        const lista = Array.isArray(data) ? data : (data.data || data.$values || []);
        console.log("PRODUCTOS DESDE BD:", lista);
        setProductos(lista);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar productos:", err);
        setProductos([]);
        setCargando(false);
      });
  };

  const handleAddCoverage = () => {
    setCoverages([...coverages, { name: '', percent: '' }]);
  };

  const handleRemoveCoverage = (index) => {
    if (coverages.length === 1) return;
    setCoverages(coverages.filter((_, i) => i !== index));
  };

  const handleCoverageChange = (index, field, value) => {
    const updated = [...coverages];
    updated[index][field] = value;
    setCoverages(updated);
  };

  const limpiarFormulario = () => {
    setIdEditando(null);
    setIdcmpy('');
    setIdramo('');
    setCramoSisip('');
    setIdProductoSisip('');
    setCplanSisip('');
    setIdestatus(1);
    setCoverages([{ name: '', percent: '' }]);
  };

  const seleccionarParaEditar = (prod) => {
    const id = prod.idproduct ?? prod.idProduct ?? prod.id;
    setIdEditando(id);
    setIdcmpy(prod.idcmpy ? String(prod.idcmpy) : '');
    setIdramo(prod.idramo ? String(prod.idramo) : '');
    setCramoSisip(prod.cramoSisip ?? prod.cramo_sisip ?? '');
    setIdProductoSisip(prod.idProductoSisip ?? prod.id_producto_sisip ?? '');
    setCplanSisip(prod.cplanSisip ?? prod.cplan_sisip ?? '');
    setIdestatus(prod.idestatus ?? 1);

    const rawCoverages = prod.coverages ?? prod.Coverages ?? [];
    const listCov = Array.isArray(rawCoverages) ? rawCoverages : (rawCoverages.$values || []);

    if (listCov.length > 0) {
      setCoverages(listCov.map(c => ({ name: c.name || '', percent: c.percent || '' })));
    } else {
      setCoverages([{ name: '', percent: '' }]);
    }

    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!idcmpy || !idramo || !cplanSisip.trim()) {
      mostrarNotificacion('Por favor seleccione la empresa, ramo y nombre del plan.', 'error');
      return;
    }

    // Filtrar coberturas válidas
    const coberturasValidas = coverages
      .filter(c => c.name && c.name.trim() !== '')
      .map(c => ({
        name: c.name.trim().toUpperCase(),
        percent: parseFloat(c.percent) || 0.00
      }));

    const payload = {
      idproduct: idEditando || 0,
      idcmpy: parseInt(idcmpy),
      idramo: parseInt(idramo),
      cramoSisip: cramoSisip ? parseInt(cramoSisip) : null,
      idProductoSisip: idProductoSisip ? parseInt(idProductoSisip) : null,
      cplanSisip: cplanSisip.trim().toUpperCase(),
      idestatus: parseInt(idestatus),
      coverages: coberturasValidas
    };

    //console.log("📤 PAYLOAD ENVIADO A /api/products:", payload);

    const esEdicion = idEditando !== null;
    const url = esEdicion ? `${API_URL}/products/${idEditando}` : `${API_URL}/products`;
    const metodo = esEdicion ? 'PUT' : 'POST';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ ERROR DESDE EL BACKEND (.NET/PostgreSQL):", res.status, errorText);
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
        return res.status === 204 ? null : res.json();
      })
      .then(() => {
        limpiarFormulario();
        setMostrarFormulario(false);
        cargarProductos();
        mostrarNotificacion(esEdicion ? '¡Producto actualizado con éxito!' : '¡Producto y Coberturas registrados con éxito!');
      })
      .catch(err => {
        console.error("Error al procesar producto:", err);
        mostrarNotificacion(`Error: ${err.message || 'Hubo un error al procesar el producto.'}`, 'error');
      });
  };

  const eliminarProducto = (id) => {
    if (!window.confirm("¿Desea eliminar este producto y todas sus coberturas asociadas?")) return;

    fetch(`${API_URL}/products/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error("Error al eliminar");
        if (idEditando === id) {
          limpiarFormulario();
          setMostrarFormulario(false);
        }
        cargarProductos();
        mostrarNotificacion('Producto eliminado correctamente.');
      })
      .catch(err => {
        console.error("Error al eliminar producto:", err);
        mostrarNotificacion('No se pudo eliminar el producto.', 'error');
      });
  };

  const productosFiltrados = productos.filter(item => {
    const term = busqueda.toLowerCase();
    const plan = String(item.cplanSisip ?? item.cplan_sisip ?? '').toLowerCase();
    return plan.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Notificación Flotante (Toast) */}
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
            <span>📦</span> Planes y Coberturas
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Administración de productos, planes ofertados y sus coberturas asociadas
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (mostrarFormulario && idEditando) {
              limpiarFormulario();
            }
            setMostrarFormulario(!mostrarFormulario);
          }}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
            mostrarFormulario
              ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
              : 'bg-zinc-900 hover:bg-zinc-800 text-white'
          }`}
        >
          <span>{mostrarFormulario ? '✕ Ocultar Formulario' : '➕ Nuevo Plan / Producto'}</span>
        </button>
      </div>

      {/* Formulario Desplegable */}
      {mostrarFormulario && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <span>✏️</span> {idEditando ? `Modificar Plan/Producto #${idEditando}` : 'Registrar Nuevo Plan / Producto'}
            </h3>
            {idEditando && (
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">
                Modo Edición Activo
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  Proveedor de Servicio (Empresa) *
                </label>
                <select
                  value={idcmpy}
                  onChange={(e) => setIdcmpy(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
                >
                  <option value="">-- Seleccione Proveedor --</option>
                  {empresasSeguras.map((c, idx) => {
                    const companyId = c.idCmpy ?? c.idcmpy ?? c.id_cmpy ?? c.id ?? `comp-${idx}`;
                    return (
                      <option key={`company-${companyId}-${idx}`} value={c.idCmpy ?? c.idcmpy ?? c.id_cmpy ?? c.id}>
                        {c.name || c.xname || `Empresa #${companyId}`} ({c.typ || 'J'}-{c.ci || ''})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  Ramo *
                </label>
                <select
                  value={idramo}
                  onChange={(e) => setIdramo(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
                >
                  <option value="">-- Seleccione Ramo --</option>
                  {ramosSeguros.map((r, idx) => {
                    const ramoId = r.idRamo ?? r.idramo ?? r.id_ramo ?? r.id;
                    const nombreRamo = r.xRamoSisip || r.xramoSisip || r.xramo || r.nombre || `Ramo #${ramoId}`;

                    return (
                      <option key={`ramo-opt-${ramoId ?? idx}`} value={ramoId}>
                        {nombreRamo}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  Nombre del Plan (CPlan SISIP) *
                </label>
                <input
                  type="text"
                  placeholder="EJ: PLAN SALUD GOLD 2026"
                  value={cplanSisip}
                  onChange={(e) => setCplanSisip(e.target.value.toUpperCase())}
                  required
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  Código Ramo SISIP
                </label>
                <input
                  type="number"
                  placeholder="Ej. 101"
                  value={cramoSisip}
                  onChange={(e) => setCramoSisip(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  ID Producto SISIP
                </label>
                <input
                  type="number"
                  placeholder="Ej. 505"
                  value={idProductoSisip}
                  onChange={(e) => setIdProductoSisip(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  Estatus
                </label>
                <select
                  value={idestatus}
                  onChange={(e) => setIdestatus(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>
              </div>
            </div>

            {/* Sub-formulario de Coberturas */}
            <div className="pt-4 border-t border-zinc-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2">
                  <span>🛡️</span> Coberturas Asociadas y Porcentajes de Comisión
                </h3>
                <button
                  type="button"
                  onClick={handleAddCoverage}
                  className="text-xs font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  + Agregar Cobertura
                </button>
              </div>

              <div className="space-y-3">
                {coverages.map((cov, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Nombre de Cobertura (Ej: Hospitalización y Cirugía)"
                        value={cov.name}
                        onChange={(e) => handleCoverageChange(idx, 'name', e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900 uppercase"
                      />
                    </div>
                    <div className="w-40">
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Comisión %"
                          value={cov.percent}
                          onChange={(e) => handleCoverageChange(idx, 'percent', e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-zinc-300 rounded-xl text-zinc-900 text-sm font-mono font-bold focus:outline-none focus:border-zinc-900 pr-8"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-zinc-400 font-bold">%</span>
                      </div>
                    </div>
                    {coverages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCoverage(idx)}
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  limpiarFormulario();
                  setMostrarFormulario(false);
                }}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-sm px-5 py-3 rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                {idEditando ? 'Guardar Cambios en Producto' : 'Guardar Producto y Coberturas'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de Registros Visible por Defecto */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Planes y Productos Registrados</h3>
            <p className="text-xs text-zinc-500">Listado general con coberturas y proveedor asociado</p>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Buscar por nombre de plan..."
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
                <th className="py-4 px-6">Proveedor (Empresa)</th>
                <th className="py-4 px-6">Nombre del Plan</th>
                <th className="py-4 px-6">Coberturas asociadas</th>
                <th className="py-4 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {cargando ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-zinc-400">
                    Cargando productos y coberturas...
                  </td>
                </tr>
              ) : productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-zinc-400">
                    No se encontraron productos registrados.
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((item) => {
                  const prodId = item.idproduct ?? item.idProduct ?? item.id;
                  const planNombre = item.cplanSisip ?? item.cplan_sisip ?? 'Sin Nombre';

                  const empresaObj = empresasSeguras.find(c => {
                    const cId = c.idCmpy ?? c.idcmpy ?? c.id_cmpy ?? c.id;
                    return String(cId) === String(item.idcmpy);
                  });

                  const nombreEmpresa = empresaObj ? (empresaObj.name || empresaObj.xname) : `Empresa #${item.idcmpy}`;

                  const rawCoverages = item.coverages ?? item.Coverages ?? [];
                  const coberturas = Array.isArray(rawCoverages) ? rawCoverages : (rawCoverages.$values || []);

                  return (
                    <tr key={prodId} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-zinc-500">#{prodId}</td>
                      <td className="py-4 px-6 font-semibold text-zinc-900 text-sm">{nombreEmpresa}</td>
                      <td className="py-4 px-6 font-bold text-zinc-900 text-sm">{planNombre}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1.5">
                          {coberturas.length === 0 ? (
                            <span className="text-xs text-zinc-400 font-medium">Sin coberturas</span>
                          ) : (
                            coberturas.map((cov, cIdx) => (
                              <span key={cIdx} className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-zinc-200">
                                <span>{cov.name}</span>
                                <span className="text-emerald-700 font-mono font-bold">({cov.percent}%)</span>
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => seleccionarParaEditar(item)}
                            title="Editar producto"
                            className="p-2 text-zinc-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => eliminarProducto(prodId)}
                            title="Eliminar producto"
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