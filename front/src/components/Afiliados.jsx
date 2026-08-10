import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5234/api';

export default function Afiliados({ statesList = [], ciudadesFiltradas = [], setCompCEstado, compCEstado }) {
  const [sellers, setSellers] = useState([]);
  const [bancosList, setBancosList] = useState([]);
  const [frecuenciasPagoList, setFrecuenciasPagoList] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [notificacion, setNotificacion] = useState({ show: false, mensaje: '', tipo: 'success' });

  // Control para expandir o contraer el formulario (inicia contraído)
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Estado Edición
  const [idEditando, setIdEditando] = useState(null);

  // Campos de la tabla SELLERS
  const [idpapa, setIdpapa] = useState(0);
  const [code, setCode] = useState('');
  const [typ, setTyp] = useState('V');
  const [ci, setCi] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [cestado, setCestado] = useState('');
  const [xcity, setXcity] = useState('');
  const [xdir, setXdir] = useState('');
  const [ecivil, setEcivil] = useState('S');
  const [sexx, setSexx] = useState('M');
  const [fechaNac, setFechaNac] = useState('');
  const [banco, setBanco] = useState('');
  const [nrocta, setNrocta] = useState('');
  const [nivel, setNivel] = useState(1);
  const [fpay, setFpay] = useState('');

  useEffect(() => {
    cargarSellers();
    cargarBancos();
    cargarFrecuenciasPago();
  }, []);

  const mostrarNotificacion = (mensaje, tipo = 'success') => {
    setNotificacion({ show: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: 'success' }), 4000);
  };

  const cargarBancos = () => {
    fetch(`${API_URL}/banks`)
      .then(res => res.json())
      .then(data => setBancosList(Array.isArray(data) ? data : (data.data || data.$values || [])))
      .catch(() => setBancosList([]));
  };

  const cargarFrecuenciasPago = () => {
    fetch(`${API_URL}/frecuencias-pago`)
      .then(res => res.json())
      .then(data => {
        const lista = Array.isArray(data) ? data : (data.data || data.$values || []);
        setFrecuenciasPagoList(lista);
        if (lista.length > 0 && !fpay) {
          const primerId = lista[0].idfqcypay ?? lista[0].idFqcypay ?? lista[0].id ?? 1;
          setFpay(String(primerId));
        }
      })
      .catch(err => {
        console.error("Error al cargar frecuencias de pago:", err);
        setFrecuenciasPagoList([]);
      });
  };

  const cargarSellers = () => {
    setCargando(true);
    fetch(`${API_URL}/sellers`)
      .then(async res => {
        if (!res.ok) throw new Error("Error en servidor");
        return res.json();
      })
      .then(data => {
        const lista = Array.isArray(data) ? data : (data.data || data.$values || []);
        setSellers(lista);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar afiliados:", err);
        setSellers([]);
        setCargando(false);
      });
  };

  const limpiarFormulario = () => {
    setIdEditando(null);
    setIdpapa(0);
    setCode('');
    setTyp('V');
    setCi('');
    setName('');
    setLastname('');
    setEmail('');
    setMobile('');
    setCestado('');
    setXcity('');
    setXdir('');
    setEcivil('S');
    setSexx('M');
    setFechaNac('');
    setBanco('');
    setNrocta('');
    setNivel(1);
    
    if (frecuenciasPagoList.length > 0) {
      const primerId = frecuenciasPagoList[0].idfqcypay ?? frecuenciasPagoList[0].idFqcypay ?? frecuenciasPagoList[0].id ?? 1;
      setFpay(String(primerId));
    } else {
      setFpay('');
    }
  };

  const seleccionarParaEditar = (item) => {
    setIdEditando(item.idseller);
    setIdpapa(item.idpapa || 0);
    setCode(item.code || '');
    setTyp(item.typ || 'V');
    setCi(item.ci || '');
    setName(item.name || '');
    setLastname(item.lastname || '');
    setEmail(item.email || '');
    setMobile(item.mobile || '');
    setCestado(item.cestado ? String(item.cestado) : '');
    setXdir(item.xdir || '');
    setEcivil(item.ecivil || 'S');
    setSexx(item.sexx || 'M');
    setFechaNac(item.fechaNac ? item.fechaNac.split('T')[0] : '');
    setBanco(item.banco || '');
    setNrocta(item.nrocta || '');
    setNivel(item.nivel || 1);
    setFpay(item.fpay ? String(item.fpay) : '');

    setTimeout(() => setXcity(item.xcity || ''), 50);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ci.trim() || !name.trim() || !lastname.trim() || !email.trim() || !mobile.trim() || !cestado || !fechaNac) {
      mostrarNotificacion('Por favor complete todos los campos obligatorios (*).', 'error');
      return;
    }

    const tieneDatosBancarios = banco.trim() !== '' && nrocta.trim() !== '';
    const estatusCalculado = tieneDatosBancarios ? 1 : 2;

    const payload = {
      idseller: idEditando || 0,
      idpapa: parseInt(idpapa) || 0,
      code: code.trim() || null,
      typ,
      ci: ci.trim(),
      name: name.trim().toUpperCase(),
      lastname: lastname.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      comission: 0.00,
      cestado: parseInt(cestado),
      xcity: xcity.trim().toUpperCase(),
      xdir: xdir.trim().toUpperCase(),
      ecivil,
      sexx,
      fechaNac: new Date(fechaNac).toISOString(),
      banco: banco || null,
      nrocta: nrocta.trim() || null,
      nivel: parseInt(nivel) || 1,
      fpay: parseInt(fpay) || 1,
      idestatus: estatusCalculado
    };

    const esEdicion = idEditando !== null;
    const url = esEdicion ? `${API_URL}/sellers/${idEditando}` : `${API_URL}/sellers`;
    const metodo = esEdicion ? 'PUT' : 'POST';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.status === 204 ? null : res.json();
      })
      .then(() => {
        limpiarFormulario();
        setMostrarFormulario(false);
        cargarSellers();
        mostrarNotificacion(esEdicion ? '¡Afiliado modificado con éxito!' : '¡Afiliado registrado con éxito!');
      })
      .catch(err => {
        console.error("Error al procesar afiliado:", err);
        mostrarNotificacion(`Error: ${err.message || 'No se pudo guardar el afiliado.'}`, 'error');
      });
  };

  const eliminarSeller = (id) => {
    if (!window.confirm("¿Desea eliminar este afiliado permanentemente?")) return;

    fetch(`${API_URL}/sellers/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error("Error al eliminar");
        if (idEditando === id) {
          limpiarFormulario();
          setMostrarFormulario(false);
        }
        cargarSellers();
        mostrarNotificacion('Afiliado eliminado correctamente.');
      })
      .catch(err => {
        console.error("Error al eliminar:", err);
        mostrarNotificacion('No se pudo eliminar el afiliado.', 'error');
      });
  };

  const sellersFiltrados = sellers.filter(item => {
    const term = busqueda.toLowerCase();
    const nombreCompleto = `${item.name || ''} ${item.lastname || ''}`.toLowerCase();
    const cedula = String(item.ci || '').toLowerCase();
    const codigo = String(item.code || '').toLowerCase();
    return nombreCompleto.includes(term) || cedula.includes(term) || codigo.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Notificación Flotante */}
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

      {/* Barra de Acciones y Toggle del Formulario */}
      <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <span>👥</span> Gestión de Afiliados y Vendedores
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Consulta y registro de la nómina de afiliados de la plataforma
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
          <span>{mostrarFormulario ? '✕ Ocultar Formulario' : '➕ Nuevo Afiliado / Vendedor'}</span>
        </button>
      </div>

      {/* Formulario Desplegable */}
      {mostrarFormulario && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <span>✏️</span> {idEditando ? `Modificar Afiliado #${idEditando}` : 'Ingresar Datos del Nuevo Afiliado'}
            </h3>
            {idEditando && (
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">
                Modo Edición Activo
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              {/* Línea 1: Documento, Nombres, Apellidos, Fecha Nacimiento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Documento (Tipo / C.I. o RIF) *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={typ}
                      onChange={(e) => setTyp(e.target.value)}
                      className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl p-3 font-medium focus:outline-none focus:border-zinc-900"
                    >
                      <option value="V">V</option>
                      <option value="E">E</option>
                      <option value="J">J</option>
                      <option value="G">G</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Ej: 12345678"
                      value={ci}
                      onChange={(e) => setCi(e.target.value.replace(/\D/g, ''))}
                      maxLength={9}
                      required
                      className="flex-1 bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl p-3 focus:outline-none focus:border-zinc-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    placeholder="Nombres del afiliado"
                    value={name}
                    onChange={(e) => setName(e.target.value.toUpperCase())}
                    required
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    placeholder="Apellidos del afiliado"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value.toUpperCase())}
                    required
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    value={fechaNac}
                    onChange={(e) => setFechaNac(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              {/* Línea 2: Código, Nivel, Correo, Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Código Afiliado (Codigo Externo)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. AFL-001"
                    value={code}
                    maxLength={9}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Nivel de Afiliado *
                  </label>
                  <select
                    value={nivel}
                    onChange={(e) => setNivel(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-mono font-bold focus:outline-none focus:border-zinc-900"
                  >
                    <option value={1}>Nivel 1</option>
                    <option value={2}>Nivel 2</option>
                    <option value={3}>Nivel 3</option>
                    <option value={4}>Nivel 4</option>
                    <option value={5}>Nivel 5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Teléfono Móvil *
                  </label>
                  <input
                    type="text"
                    placeholder="04141234567"
                    value={mobile}
                    maxLength={11}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    required
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-mono font-bold focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              {/* Línea 3: Estado Civil, Género, Estado, Ciudad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Estado Civil *
                  </label>
                  <select
                    value={ecivil}
                    onChange={(e) => setEcivil(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
                  >
                    <option value="S">Soltero(a)</option>
                    <option value="C">Casado(a)</option>
                    <option value="D">Divorciado(a)</option>
                    <option value="V">Viudo(a)</option>
                    <option value="C">Concubinato</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Género *
                  </label>
                  <select
                    value={sexx}
                    onChange={(e) => setSexx(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Estado *
                  </label>
                  <select
                    value={cestado}
                    onChange={(e) => {
                      setCestado(e.target.value);
                      setXcity('');
                    }}
                    required
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
                  >
                    <option value="">Seleccione Estado...</option>
                    {statesList.map((st) => {
                      const valEstado = String(st.cestado ?? st.cEstado ?? st.idEstado ?? '');
                      return (
                        <option key={st.idEstado || valEstado} value={valEstado}>
                          {st.xDescripcionL ? st.xDescripcionL.trim() : st.xdescripcionL}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Ciudad (Xcity) *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. CARACAS, GUARENAS"
                    value={xcity}
                    onChange={(e) => setXcity(e.target.value.toUpperCase())}
                    required
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900 uppercase"
                  />
                </div>
              </div>

              {/* Línea 4: Dirección Fiscal */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  Dirección Fiscal (Xdir) *
                </label>
                <input
                  type="text"
                  placeholder="Av. Principal, Edificio, Casa..."
                  value={xdir}
                  onChange={(e) => setXdir(e.target.value.toUpperCase())}
                  required
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900 uppercase"
                />
              </div>
            </div>

            {/* Recuadro Diferenciado para Datos Financieros y Pago */}
            <div className="p-5 sm:p-6 bg-zinc-50/80 rounded-2xl border border-zinc-200/90 shadow-inner space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60">
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2">
                  <span>💳</span> Información Bancaria y Forma de Pago
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-zinc-200 text-zinc-700 rounded-full uppercase tracking-wider">
                  Datos Opcionales
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Banco
                  </label>
                  <select
                    value={banco}
                    onChange={(e) => setBanco(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
                  >
                    <option value="">-- Seleccione Banco --</option>
                    {bancosList.map((item, index) => {
                      const nombre = item.xbanco || item.xBanco || item.name || item.nombre || 'Sin nombre';
                      return (
                        <option key={index} value={nombre}>
                          {nombre}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Número de Cuenta (20 dígitos)
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="01340000000000000000"
                    value={nrocta}
                    onChange={(e) => setNrocta(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-sm font-mono focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Forma de Pago (Fpay) *
                  </label>
                  <select
                    value={fpay}
                    onChange={(e) => setFpay(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
                  >
                    {frecuenciasPagoList.length === 0 ? (
                      <option value="">Cargando formas de pago...</option>
                    ) : (
                      frecuenciasPagoList.map((item, index) => {
                        const idFreq = item.idfqcypay ?? item.idFqcypay ?? item.id ?? index;
                        const nombreFreq = item.freq ?? item.Freq ?? item.fpay ?? 'Sin Nombre';
                        return (
                          <option key={idFreq} value={idFreq}>
                            {nombreFreq}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>
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
                {idEditando ? 'Guardar Cambios en Afiliado' : 'Registrar Afiliado'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de Registros Visible por Defecto */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Afiliados y Vendedores Registrados</h3>
            <p className="text-xs text-zinc-500">Listado general de la nómina de afiliados activos e inactivos</p>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Buscar por nombre, C.I. o código..."
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
                <th className="py-4 px-6">ID / Código</th>
                <th className="py-4 px-6">C.I. / RIF</th>
                <th className="py-4 px-6">Nombre Completo</th>
                <th className="py-4 px-6">Contacto</th>
                <th className="py-4 px-6 text-center">Nivel</th>
                <th className="py-4 px-6 text-center">Estatus</th>
                <th className="py-4 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {cargando ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-zinc-400">
                    Cargando afiliados...
                  </td>
                </tr>
              ) : sellersFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-zinc-400">
                    No se encontraron afiliados registrados.
                  </td>
                </tr>
              ) : (
                sellersFiltrados.map((item) => {
                  const estatusVal = item.idestatus ?? item.idEstatus ?? 2;
                  const esOnline = estatusVal === 1;

                  return (
                    <tr key={item.idseller} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs text-zinc-500">
                        #{item.idseller} <br/>
                        <span className="font-bold text-zinc-900">{item.code || 'S/C'}</span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-zinc-900 text-sm">{item.typ}-{item.ci}</td>
                      <td className="py-4 px-6 font-bold text-zinc-900 text-sm">{item.name} {item.lastname}</td>
                      <td className="py-4 px-6 text-zinc-500 text-xs">
                        {item.email} <br/>
                        <span className="font-mono font-bold text-zinc-700">{item.mobile}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-block font-mono font-bold text-xs bg-zinc-100 text-zinc-800 px-3 py-1 rounded-lg border border-zinc-200">
                          Nivel {item.nivel || 1}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm ${
                            esOnline
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                              : 'bg-rose-50 text-rose-700 border-rose-200/80'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              esOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                            }`}
                          ></span>
                          {esOnline ? 'online' : 'manual'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => seleccionarParaEditar(item)}
                            title="Editar afiliado"
                            className="p-2 text-zinc-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => eliminarSeller(item.idseller)}
                            title="Eliminar afiliado"
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