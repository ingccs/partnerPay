import { useState, useEffect } from 'react';
import './App.css';

// Vistas
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Empresas from './components/Empresas';
import DashboardItems from './components/DashboardItems';
import ModuloGenerico from './components/ModuloGenerico';
import Ramos from './components/Ramos';

const API_URL = 'http://localhost:5234/api';

function App() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [errorLogin, setErrorLogin] = useState('');
  const [cargandoLogin, setCargandoLogin] = useState(false);

  const [seccionActiva, setSeccionActiva] = useState('items');
  const [menuConfigAbierto, setMenuConfigAbierto] = useState(true);

  // Estados de Módulo Principal (Items)
  const [items, setItems] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Estados del Módulo Empresas
  const [companies, setCompanies] = useState([]);
  const [compTyp, setCompTyp] = useState('J');
  const [compCi, setCompCi] = useState('');
  const [compName, setCompName] = useState('');
  const [compEmail, setCompEmail] = useState('');
  const [compMobile, setCompMobile] = useState('');
  const [compXDir, setCompXDir] = useState('');
  const [compIdEstatus, setCompIdEstatus] = useState(1);

  // Estados/Ciudades de Venezuela
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [compCEstado, setCompCEstado] = useState('');
  const [compXCity, setCompXCity] = useState('');

  // Estados del Módulo Ramos
  const [ramos, setRamos] = useState([]);
  const [busquedaRamo, setBusquedaRamo] = useState('');

  // Filtro
  const ciudadesFiltradas = citiesList.filter(city => {
    const estadoCiudad = String(city.cEstado ?? city.cestado ?? '');
    const estadoSeleccionado = String(compCEstado ?? '');
    return estadoCiudad === estadoSeleccionado;
  });

  const [notificacion, setNotificacion] = useState({ show: false, mensaje: '', tipo: 'success' });

  useEffect(() => {
    if (usuarioAutenticado) {
      cargarItems();
      cargarCompanies();
      cargarStates();
      cargarCities();
      cargarRamos();
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

  const cargarItems = () => {
    fetch(`${API_URL}/items`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Error al cargar items:", err));
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
      .then(data => setRamos(data))
      .catch(err => console.error("Error al cargar ramos:", err));
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
    setItems([]);
    setCompanies([]);
  };

  const handleSubmitItem = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion })
    })
    .then(() => {
      setNombre('');
      setDescripcion('');
      cargarItems();
    })
    .catch(err => console.error("Error al crear:", err));
  };

  const handleSubmitCompany = (e) => {
    e.preventDefault();
    const nuevaEmpresa = {
      typ: compTyp,
      ci: compCi,
      name: compName,
      email: compEmail,
      mobile: compMobile,
      cestado: parseInt(compCEstado),
      xcity: compXCity,
      xdir: compXDir,
      idestatus: parseInt(compIdEstatus)
    };

    fetch(`${API_URL}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaEmpresa)
    })
    .then(res => {
      if (!res.ok) throw new Error("Error al registrar empresa");
      return res.json();
    })
    .then(() => {
      setCompCi('');
      setCompName('');
      setCompEmail('');
      setCompMobile('');
      setCompCEstado('');
      setCompXCity('');
      setCompXDir('');
      cargarCompanies();
      setNotificacion({ show: true, mensaje: '¡Empresa registrada exitosamente en el sistema!', tipo: 'success' });
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
      .then(() => cargarCompanies())
      .catch(err => console.error("Error al eliminar empresa:", err));
  };

  const itemsFiltrados = items.filter(item => 
    item.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    (item.descripcion && item.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
  );

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
          {seccionActiva === 'empresas' ? (
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
              companies={companies}
              eliminarCompany={eliminarCompany}
            />
          ) : seccionActiva === 'items' ? (
            <DashboardItems 
              items={items}
              handleSubmitItem={handleSubmitItem}
              nombre={nombre}
              setNombre={setNombre}
              descripcion={descripcion}
              setDescripcion={setDescripcion}
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              itemsFiltrados={itemsFiltrados}
            />
          ) : seccionActiva === 'ramos' ? (
            <Ramos 
              ramos={ramos}
              busquedaRamo={busquedaRamo}
              setBusquedaRamo={setBusquedaRamo}
            />
          ) : (
            <ModuloGenerico seccionActiva={seccionActiva} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;