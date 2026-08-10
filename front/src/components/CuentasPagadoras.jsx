import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5234/api';

export default function CuentasPagadoras() {
  const [cuentas, setCuentas] = useState([]);
  const [bancosList, setBancosList] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [notificacion, setNotificacion] = useState({ show: false, mensaje: '', tipo: 'success' });

  // Estado de edición (null = Modo Creación, ID = Modo Edición)
  const [idEditando, setIdEditando] = useState(null);

  // Campos del Formulario
  const [type, setType] = useState('J');
  const [rif, setRif] = useState('');
  const [titular, setTitular] = useState('');
  const [banco, setBanco] = useState('');
  const [nrocta, setNrocta] = useState('');
  const [mobile, setMobile] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    cargarCuentas();
    cargarBancos();
  }, []);

  const mostrarNotificacion = (mensaje, tipo = 'success') => {
    setNotificacion({ show: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: 'success' }), 4000);
  };

  const cargarBancos = () => {
    fetch(`${API_URL}/banks`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then(data => {
        const lista = Array.isArray(data) ? data : (data.data || data.$values || []);
        setBancosList(lista);
      })
      .catch(err => {
        console.error("Error al cargar bancos:", err);
        setBancosList([]);
      });
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
        console.error("Error al cargar cuentas pagadoras:", err);
        setCargando(false);
      });
  };

  const limpiarFormulario = () => {
    setIdEditando(null);
    setType('J');
    setRif('');
    setTitular('');
    setBanco('');
    setNrocta('');
    setMobile('');
    setBalance('');
  };

  const seleccionarParaEditar = (cuenta) => {
    setIdEditando(cuenta.idctapay);
    setType(cuenta.type || 'J');
    setRif(cuenta.rif || '');
    setTitular(cuenta.titular || '');
    setBanco(cuenta.banco || '');
    setNrocta(cuenta.nrocta || '');
    setMobile(cuenta.mobile || '');
    setBalance(cuenta.balance || '');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rif.trim() || !titular.trim() || !banco.trim() || !nrocta.trim() || !mobile.trim()) {
      mostrarNotificacion('Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const payload = {
      idctapay: idEditando ? parseInt(idEditando) : 0,
      type,
      rif,
      titular: titular.trim().toUpperCase(),
      banco,
      nrocta,
      mobile,
      balance: balance && !isNaN(parseFloat(balance)) ? parseFloat(balance) : 0.00
    };

    const esEdicion = idEditando !== null;
    const url = esEdicion ? `${API_URL}/cuentas-pagadoras/${idEditando}` : `${API_URL}/cuentas-pagadoras`;
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
        cargarCuentas();
        mostrarNotificacion(esEdicion ? '¡Cuenta modificada con éxito!' : '¡Cuenta registrada con éxito!');
      })
      .catch(err => {
        console.error("Error al procesar:", err);
        mostrarNotificacion('Hubo un error al procesar la cuenta.', 'error');
      });
  };

  const eliminarCuenta = (id) => {
    if (!window.confirm("¿Desea eliminar esta cuenta pagadora permanentemente?")) return;

    fetch(`${API_URL}/cuentas-pagadoras/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error("Error al eliminar");
        if (idEditando === id) limpiarFormulario();
        cargarCuentas();
        mostrarNotificacion('Cuenta pagadora eliminada correctamente.');
      })
      .catch(err => {
        console.error("Error al eliminar cuenta:", err);
        mostrarNotificacion('No se pudo eliminar la cuenta pagadora.', 'error');
      });
  };

  const cuentasFiltradas = cuentas.filter(item => {
    const term = busqueda.toLowerCase();
    return (
      (item.titular && item.titular.toLowerCase().includes(term)) ||
      (item.banco && item.banco.toLowerCase().includes(term)) ||
      (item.rif && item.rif.toLowerCase().includes(term)) ||
      (item.mobile && item.mobile.includes(term)) ||
      (item.nrocta && item.nrocta.includes(term))
    );
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
              onClick={() => setNotificacion({ show: false, mensaje: '', tipo: 'success' })}
              className="ml-2 text-white/70 hover:text-white text-sm p-1 rounded-lg transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Formulario de Registro / Edición */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <span>{idEditando ? '✏️' : '🏦'}</span> 
            {idEditando ? `Modificar Cuenta Pagadora #${idEditando}` : 'Registrar Cuenta Pagadora'}
          </h2>
          {idEditando && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">
              Modo Edición Activo
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Tipo y RIF/Cédula */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 uppercase tracking-wider">
                Documento (Tipo / RIF o CI) *
              </label>
              <div className="flex gap-2">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-xl focus:ring-zinc-500 focus:border-zinc-500 p-2.5 font-medium"
                >
                  <option value="J">J</option>
                  <option value="V">V</option>
                  <option value="E">E</option>
                  <option value="G">G</option>
                  <option value="P">P</option>
                </select>
                <input
                  type="text"
                  placeholder="Ej: 123456789"
                  value={rif}
                  onChange={(e) => setRif(e.target.value)}
                  required
                  className="flex-1 bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-xl focus:ring-zinc-500 focus:border-zinc-500 p-2.5"
                />
              </div>
            </div>

            {/* Titular */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 uppercase tracking-wider">
                Titular de la Cuenta *
              </label>
              <input
                type="text"
                placeholder="NOMBRE O RAZÓN SOCIAL"
                value={titular}
                onChange={(e) => setTitular(e.target.value.toUpperCase())}
                required
                className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-xl focus:ring-zinc-500 focus:border-zinc-500 p-2.5 uppercase font-medium"
              />
            </div>

            {/* Banco */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 uppercase tracking-wider">
                Banco *
              </label>
              <select
                value={banco}
                onChange={(e) => setBanco(e.target.value)}
                required
                className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-xl focus:ring-zinc-500 focus:border-zinc-500 p-2.5"
              >
                <option value="">
                  {bancosList.length === 0 ? '-- Cargando bancos... --' : '-- Seleccione un banco --'}
                </option>
                {bancosList.map((item, index) => {
                  const id = item.idbco || item.idbank || item.id || index;
                  const codigo = item.cbanco || item.code || '';
                  const nombre = item.xbanco || item.xBanco || item.name || item.nombre || 'Sin nombre';

                  return (
                    <option key={id} value={nombre}>
                      {codigo ? `${codigo} - ` : ''}{nombre}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Teléfono Asociado */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 uppercase tracking-wider">
                Teléfono Asociado (Pago Móvil) *
              </label>
              <input
                type="text"
                placeholder="04141234567"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-xl focus:ring-zinc-500 focus:border-zinc-500 p-2.5 font-mono"
              />
            </div>

            {/* Número de Cuenta */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 uppercase tracking-wider">
                Número de Cuenta (20 dígitos) *
              </label>
              <input
                type="text"
                maxLength={20}
                placeholder="01340000000000000000"
                value={nrocta}
                onChange={(e) => setNrocta(e.target.value)}
                required
                className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-xl focus:ring-zinc-500 focus:border-zinc-500 p-2.5 font-mono"
              />
            </div>

            {/* Balance Inicial */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 uppercase tracking-wider">
                Balance Inicial
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-xl focus:ring-zinc-500 focus:border-zinc-500 p-2.5"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {idEditando && (
              <button
                type="button"
                onClick={limpiarFormulario}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Cancelar Edición
              </button>
            )}
            <button
              type="submit"
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {idEditando ? 'Guardar Cambios' : 'Guardar Cuenta Pagadora'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Registros */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Cuentas Pagadoras Registradas</h3>
            <p className="text-xs text-zinc-500">Listado general de cuentas de pago configuradas</p>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Buscar por titular, RIF, banco..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-xl p-2.5 focus:ring-zinc-500 focus:border-zinc-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="bg-zinc-50 text-xs font-semibold text-zinc-700 uppercase tracking-wider border-b border-zinc-200">
              <tr>
                <th className="px-6 py-3.5">ID</th>
                <th className="px-6 py-3.5">RIF</th>
                <th className="px-6 py-3.5">Titular</th>
                <th className="px-6 py-3.5">Teléfono</th>
                <th className="px-6 py-3.5">N° Cuenta / Banco</th>
                <th className="px-6 py-3.5 text-right">Balance</th>
                <th className="px-6 py-3.5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {cargando ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-zinc-400">
                    Cargando cuentas pagadoras...
                  </td>
                </tr>
              ) : cuentasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-zinc-400">
                    No se encontraron cuentas pagadoras registradas.
                  </td>
                </tr>
              ) : (
                cuentasFiltradas.map((item) => (
                  <tr key={item.idctapay} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">#{item.idctapay}</td>
                    <td className="px-6 py-4 font-medium text-zinc-900">
                      <span className="inline-block bg-zinc-100 text-zinc-700 font-bold px-2 py-0.5 rounded text-xs mr-1">
                        {item.type}
                      </span>
                      {item.rif}
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-900">{item.titular}</td>
                    <td className="px-6 py-4 font-semibold text-zinc-900">{item.mobile || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-xs text-zinc-900">{item.nrocta}</div>
                      <div className="text-[11px] font-mono text-zinc-900 uppercase tracking-tight mt-0.5">
                        {item.banco}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-zinc-900">
                      Bs {Number(item.balance || 0).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Botón Editar con icono */}
                        <button
                          onClick={() => seleccionarParaEditar(item)}
                          title="Editar cuenta"
                          className="p-2 text-zinc-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        {/* Botón Eliminar con icono */}
                        <button
                          onClick={() => eliminarCuenta(item.idctapay)}
                          title="Eliminar cuenta"
                          className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}