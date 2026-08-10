import { useState, useEffect } from 'react';
import './App.css';

// Vistas
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardMetrics from './components/DashboardMetrics';
import Empresas from './components/Empresas';
import ModuloGenerico from './components/ModuloGenerico';
import Ramos from './components/Ramos';
import CuentasPagadoras from './components/CuentasPagadoras';
import Productos from './components/Productos';
import FrecuenciasPago from './components/FrecuenciasPago';

const API_URL = 'http://localhost:5234/api';

function App() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [errorLogin, setErrorLogin] = useState('');
  const [cargandoLogin, setCargandoLogin] = useState(false);

  // Sección activa por defecto configurada al Dashboard de Métricas ('analytics')
  const [seccionActiva, setSeccionActiva] = useState('analytics');
  const [menuConfigAbierto, setMenuConfigAbierto] = useState(true);

  // Estados del Módulo Empresas
  const [companies, setCompanies] = useState([]);
  const [compTyp, setCompTyp] = useState('J');
  const [compCi, setCompCi] = useState('');
  const [compName, setCompName] = useState('');
  const [compEmail, setCompEmail] = useState('');
  const [compMobile, setCompMobile] = useState('');
  const [compXDir, setCompXDir] = useState('');
  const [compIdEstatus, setCompIdEstatus] = useState(1);
  const [compCodexPr, setCompCodexPr] = useState('');
  const [idEditandoCompany, setIdEditandoCompany] = useState(null);

  // Estados/Ciudades de Venezuela
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [compCEstado, setCompCEstado] = useState('');
  const [compXCity, setCompXCity] = useState('');

  // Estados del Módulo Ramos
  const [ramos, setRamos] = useState([]);
  const [busquedaRamo, setBusquedaRamo] = useState('');

  // Estados para el Dashboard Global (Productos y Frecuencias)
  const [productos, setProductos] = useState([]);
  const [frecuencias, setFrecuencias] = useState([]);

  // Filtro de Ciudades por Estado
  const ciudadesFiltradas = citiesList.filter(city => {
    const estadoCiudad = String(city.cEstado ?? city.cestado ?? '');
    const estadoSeleccionado = String(compCEstado ?? '');
    return estadoCiudad === estadoSeleccionado;
  });

  const [notificacion, setNotificacion] = useState({ show: false, mensaje: '', tipo: 'success' });

  useEffect(() => {
    if (usuarioAutenticado) {
      cargarCompanies();
      cargarStates();
      cargarCities();
      cargarRamos();
      cargarProductosGlobal();
      cargarFrecuenciasGlobal();
    }
  }, [usuarioAutenticado]);

  const cargarStates = () => {
    fetch(`${API_URL}/states`)
      .then(res => res.json())
      .then(data => setStatesList(data))
      .catch(err => console.error("Error al cargar estados:", err));
  };

  const cargarCities = () => {
    fetch(`${API_URL}/cities`)
      .then(res => res.json())
      .then(data => setCitiesList(data))
      .catch(err => console.error("Error al cargar ciudades:", err));
  };

  const cargarCompanies = () => {
    fetch(`${API_URL}/companies`)
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(err => console.error("Error al cargar empresas:", err));
  };

  const cargarRamos = () => {
    fetch(`${API_URL}/ramos`)
      .then(res => res.json())
      .then(data => {
        const lista = Array.isArray(data) ? data : (data.data || data.$values || []);
        console.log("RAMOS CARGADOS EN APP.JSX:", lista); // Ver en F12
        setRamos(lista);
      })
      .catch(err => console.error("Error al cargar ramos:", err));
  };

  const cargarProductosGlobal = () => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        const lista = Array.isArray(data) ? data : (data.data || data.$values || []);
        setProductos(lista);
      })
      .catch(err => console.error("Error al cargar productos globalmente:", err));
  };

  const cargarFrecuenciasGlobal = () => {
    fetch(`${API_URL}/frecuencias-pago`)
      .then(res => res.json())
      .then(data => {
        const lista = Array.isArray(data) ? data : (data.data || data.$values || []);
        setFrecuencias(lista);
      })
      .catch(err => console.error("Error al cargar frecuencias globalmente:", err));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorLogin('');
    setCargandoLogin(true);

    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailLogin, password: passwordLogin })
    })
      .then(async res => {
        setCargandoLogin(false);
        if (!res.ok) throw new Error("Credenciales inválidas");
        return res.json();
      })
      .then(data => {
        setUsuarioAutenticado(data);
      })
      .catch(err => {
        setCargandoLogin(false);
        console.error("Error en login:", err);
        setErrorLogin("Credenciales incorrectas o error de conexión con la base de datos.");
      });
  };

  const handleLogout = () => {
    setUsuarioAutenticado(null);
    setEmailLogin('');
    setPasswordLogin('');
    setCompanies([]);
    setRamos([]);
    setProductos([]);
    setFrecuencias([]);
  };

  const limpiarFormularioCompany = () => {
    setIdEditandoCompany(null);
    setCompTyp('J');
    setCompCi('');
    setCompName('');
    setCompEmail('');
    setCompMobile('');
    setCompCEstado('');
    setCompXCity('');
    setCompXDir('');
    setCompCodexPr('');
    setCompIdEstatus(1);
  };

  const seleccionarParaEditarCompany = (comp) => {
    setIdEditandoCompany(comp.idCmpy || comp.id_cmpy || comp.id);
    setCompTyp(comp.typ || 'J');
    setCompCi(comp.ci ? String(comp.ci) : '');
    setCompName(comp.name || comp.xname || '');
    setCompEmail(comp.email || '');
    setCompMobile(comp.mobile || '');
    
    const valEstado = comp.cestado ?? comp.cEstado ?? comp.idEstado ?? '';
    setCompCEstado(valEstado !== '' ? String(valEstado) : '');

    setCompXDir(comp.xdir || comp.xDir || comp.xdirection || '');
    setCompCodexPr(comp.codexPr || comp.codex_pr || '');
    setCompIdEstatus(comp.idestatus ?? comp.idEstatus ?? 1);

    const nombreCiudad = comp.xcity || comp.xCity || '';
    setTimeout(() => {
      setCompXCity(nombreCiudad);
    }, 50);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitCompany = (e) => {
    e.preventDefault();
    const esEdicion = idEditandoCompany !== null;
    const url = esEdicion ? `${API_URL}/companies/${idEditandoCompany}` : `${API_URL}/companies`;
    const metodo = esEdicion ? 'PUT' : 'POST';

    const empresaPayload = {
      idCmpy: idEditandoCompany || 0,
      typ: compTyp,
      ci: compCi,
      name: compName,
      email: compEmail,
      mobile: compMobile,
      cestado: parseInt(compCEstado),
      xcity: compXCity,
      xdir: compXDir,
      codexPr: compCodexPr && compCodexPr.trim() !== '' ? compCodexPr.trim() : null,
      idestatus: parseInt(compIdEstatus)
    };

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(empresaPayload)
    })
    .then(async res => {
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ DETALLE DEL ERROR BACKEND:", res.status, errorText);
        throw new Error(errorText);
      }
      return res.status === 204 ? null : res.json();
    })
    .then(() => {
      limpiarFormularioCompany();
      cargarCompanies();
      setNotificacion({ 
        show: true, 
        mensaje: esEdicion ? '¡Empresa modificada exitosamente!' : '¡Empresa registrada exitosamente en el sistema!', 
        tipo: 'success' 
      });
      setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: 'success' }), 4000);
    })
    .catch(err => {
      console.error("DETALLE DEL ERROR EN EL BACKEND:", err);
      setNotificacion({ show: true, mensaje: 'Hubo un error al procesar el registro de la empresa.', tipo: 'error' });
      setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: 'error' }), 4000);
    });
  };

  const eliminarCompany = (id) => {
    if (!window.confirm("¿Desea eliminar esta empresa permanentemente?")) return;
    fetch(`${API_URL}/companies/${id}`, { method: 'DELETE' })
      .then(() => {
        if (idEditandoCompany === id) limpiarFormularioCompany();
        cargarCompanies();
      })
      .catch(err => console.error("Error al eliminar empresa:", err));
  };

  // Pantalla de Login
  if (!usuarioAutenticado) {
    return (
      <Login 
        emailLogin={emailLogin}
        setEmailLogin={setEmailLogin}
        passwordLogin={passwordLogin}
        setPasswordLogin={setPasswordLogin}
        errorLogin={errorLogin}
        cargandoLogin={cargandoLogin}
        handleLogin={handleLogin}
      />
    );
  }

  // Panel Administrativo Principal
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <Sidebar 
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
        menuConfigAbierto={menuConfigAbierto}
        setMenuConfigAbierto={setMenuConfigAbierto}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-zinc-50">
        <Header seccionActiva={seccionActiva} />

        <main className="p-6 sm:p-10 flex-1 max-w-7xl w-full mx-auto bg-zinc-50">
          {seccionActiva === 'analytics' || seccionActiva === 'dashboard' ? (
            <DashboardMetrics 
              companies={companies}
              ramos={ramos}
              productos={productos}
              frecuencias={frecuencias}
              setSeccionActiva={setSeccionActiva}
            />
          ) : seccionActiva === 'empresas' ? (
            <Empresas 
              notificacion={notificacion}
              setNotificacion={setNotificacion}
              handleSubmitCompany={handleSubmitCompany}
              compTyp={compTyp}
              setCompTyp={setCompTyp}
              compCi={compCi}
              setCompCi={setCompCi}
              compName={compName}
              setCompName={setCompName}
              compEmail={compEmail}
              setCompEmail={setCompEmail}
              compMobile={compMobile}
              setCompMobile={setCompMobile}
              compCEstado={compCEstado}
              setCompCEstado={setCompCEstado}
              setCompXCity={setCompXCity}
              compXCity={compXCity}
              statesList={statesList}
              ciudadesFiltradas={ciudadesFiltradas}
              compIdEstatus={compIdEstatus}
              setCompIdEstatus={setCompIdEstatus}
              compXDir={compXDir}
              setCompXDir={setCompXDir}
              compCodexPr={compCodexPr}
              setCompCodexPr={setCompCodexPr}
              companies={companies}
              eliminarCompany={eliminarCompany}
              seleccionarParaEditarCompany={seleccionarParaEditarCompany}
              idEditandoCompany={idEditandoCompany}
              limpiarFormularioCompany={limpiarFormularioCompany}
            />
          ) : seccionActiva === 'productos' ? (
            <Productos companiesList={companies} ramosList={ramos} />
          ) : seccionActiva === 'frecuencias_pago' ? (
            <FrecuenciasPago />
          ) : seccionActiva === 'ramos' ? (
            <Ramos 
              ramos={ramos}
              busquedaRamo={busquedaRamo}
              setBusquedaRamo={setBusquedaRamo}
            />
          ) : seccionActiva === 'cuentas_pagadoras' ? (
            <CuentasPagadoras />
          ) : (
            <ModuloGenerico seccionActiva={seccionActiva} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;