import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const API_URL = 'http://localhost:5234/api';

export default function RedAfiliados({ sellers = [], cargarSellers }) {
  const [arbolRed, setArbolRed] = useState([]);
  const [mostrarCargaMasiva, setMostrarCargaMasiva] = useState(false);
  const [archivoExcel, setArchivoExcel] = useState(null);
  const [registrosExcel, setRegistrosExcel] = useState([]);
  const [cargandoProceso, setCargandoProceso] = useState(false);
  const [notificacion, setNotificacion] = useState({ show: false, mensaje: '', tipo: 'success' });

  useEffect(() => {
    estructurarArbol();
  }, [sellers]);

  const mostrarNotificacion = (mensaje, tipo = 'success') => {
    setNotificacion({ show: true, mensaje, tipo });
    setTimeout(() => setNotificacion({ show: false, mensaje: '', tipo: 'success' }), 4000);
  };

  // Construye la jerarquía eliminando duplicados por ID y Cédula
  const estructurarArbol = () => {
    if (!Array.isArray(sellers) || sellers.length === 0) {
      setArbolRed([]);
      return;
    }

    const mapa = {};
    const raices = [];

    // 1. Filtrar duplicados estrictos en el arreglo prop `sellers`
    sellers.forEach(s => {
      if (s && s.idseller) {
        mapa[s.idseller] = { ...s, hijos: [] };
      }
    });

    // 2. Ensamblar relaciones de hijos
    Object.values(mapa).forEach(s => {
      if (s.idpapa && s.idpapa !== 0 && mapa[s.idpapa]) {
        mapa[s.idpapa].hijos.push(s);
      } else {
        raices.push(s);
      }
    });

    setArbolRed(raices);
  };

  // Genera y descarga la plantilla modelo con formato de texto puro
  const descargarPlantillaExcel = () => {
    const datosEjemplo = [
      {
        Codigo: 'LIDER-01',
        CodigoPadre: '',
        TipoDoc: 'V',
        Cedula: '12345678',
        Nombres: 'PEDRO',
        Apellidos: 'PEREZ',
        Nivel: 1,
        Email: 'pedro@correo.com',
        Telefono: '04141112233',
        IDEstado: 1,
        Ciudad: 'CARACAS',
        Direccion: 'AV PRINCIPAL EDIF A',
        FechaNacimiento: '1990-01-15',
        Banco: 'BANCO MERCANTIL',
        NroCuenta: '01050011223344556677'
      },
      {
        Codigo: 'SUB-02',
        CodigoPadre: 'LIDER-01',
        TipoDoc: 'V',
        Cedula: '87654321',
        Nombres: 'JUAN',
        Apellidos: 'GOMEZ',
        Nivel: 2,
        Email: 'juan@correo.com',
        Telefono: '04249998877',
        IDEstado: 1,
        Ciudad: 'CARACAS',
        Direccion: 'CALLE REAL CASA 5',
        FechaNacimiento: '1995-05-20',
        Banco: '',
        NroCuenta: ''
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(datosEjemplo, { cellDates: false });

    Object.keys(worksheet).forEach(cell => {
      if (cell[0] === '!') return;
      if (worksheet[cell].v !== undefined) {
        worksheet[cell].t = 's';
        worksheet[cell].z = '@';
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla_Afiliados");
    XLSX.writeFile(workbook, "Plantilla_Carga_Masiva_Afiliados.xlsx");
  };

  // Lee el archivo Excel limpiando notación científica y desduplicando las filas ingresadas
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setArchivoExcel(file);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary', raw: false });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];

        const dataJson = XLSX.utils.sheet_to_json(ws, { raw: false, defval: '' });

        // Mapeo inicial
        const datosMapeados = dataJson.map(row => {
          const bancoVal = String(row.Banco || '').trim().toUpperCase();
          let nroCtaVal = String(row.NroCuenta || '').trim();

          if (nroCtaVal.includes('E+') || nroCtaVal.includes('e+')) {
            nroCtaVal = Number(nroCtaVal).toFixed(0);
          }

          const tieneCuentaCompleta = bancoVal.length > 0 && nroCtaVal.length >= 10;
          const estatusCalculado = tieneCuentaCompleta ? 1 : 2;

          return {
            code: String(row.Codigo || '').trim().toUpperCase(),
            codePadre: String(row.CodigoPadre || '').trim().toUpperCase(),
            typ: String(row.TipoDoc || 'V').trim().toUpperCase(),
            ci: String(row.Cedula || '').trim(),
            name: String(row.Nombres || '').trim().toUpperCase(),
            lastname: String(row.Apellidos || '').trim().toUpperCase(),
            nivel: parseInt(row.Nivel) || 1,
            email: String(row.Email || '').trim().toLowerCase(),
            mobile: String(row.Telefono || '').trim(),
            cestado: parseInt(row.IDEstado) || 1,
            xcity: String(row.Ciudad || '').trim().toUpperCase(),
            xdir: String(row.Direccion || '').trim().toUpperCase(),
            fechaNac: row.FechaNacimiento ? new Date(row.FechaNacimiento).toISOString() : new Date().toISOString(),
            banco: bancoVal !== '' ? bancoVal : null,
            nrocta: nroCtaVal !== '' ? nroCtaVal : null,
            ecivil: 'S',
            sexx: 'M',
            comission: 0.00,
            fpay: 1,
            idestatus: estatusCalculado,
            idpapa: 0
          };
        });

        // Desduplicar el arreglo cargado del Excel por Cédula antes de enviar
        const unicosExcelMap = new Map();
        datosMapeados.forEach(item => {
          if (item.ci) {
            unicosExcelMap.set(item.ci, item);
          }
        });

        setRegistrosExcel(Array.from(unicosExcelMap.values()));
      } catch (err) {
        console.error("Error al procesar Excel:", err);
        mostrarNotificacion("Error al leer el archivo Excel. Verifique que sea un documento .xlsx válido.", "error");
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleCargaMasiva = (e) => {
    e.preventDefault();

    if (registrosExcel.length === 0) {
      mostrarNotificacion('Seleccione un archivo Excel válido con registros.', 'error');
      return;
    }

    setCargandoProceso(true);

    fetch(`${API_URL}/sellers/carga-masiva`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrosExcel)
    })
      .then(async res => {
        setCargandoProceso(false);
        if (!res.ok) {
          const err = await res.text();
          throw new Error(err);
        }
        return res.json();
      })
      .then(() => {
        mostrarNotificacion('¡Carga masiva completada! Los registros existentes fueron actualizados sin duplicarse.');
        setArchivoExcel(null);
        setRegistrosExcel([]);
        setMostrarCargaMasiva(false);
        if (cargarSellers) cargarSellers();
      })
      .catch(err => {
        setCargandoProceso(false);
        mostrarNotificacion(`Error en el servidor: ${err.message}`, 'error');
      });
  };

  const renderNodo = (nodo, profundidad = 0) => {
    return (
      <div key={nodo.idseller} className={`my-2 ${profundidad > 0 ? 'ml-6 pl-4 border-l-2 border-zinc-200' : ''}`}>
        <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-zinc-200 shadow-sm hover:border-zinc-400 transition-all">
          <div className="flex items-center gap-3">
            <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
              nodo.nivel === 1 ? 'bg-zinc-900 text-white' : nodo.nivel === 2 ? 'bg-zinc-200 text-zinc-800' : 'bg-zinc-100 text-zinc-600'
            }`}>
              N{nodo.nivel || 1}
            </span>
            <div>
              <div className="font-bold text-zinc-900 text-sm">
                {nodo.name} {nodo.lastname}
              </div>
              <div className="text-xs text-zinc-500 font-mono">
                C.I: {nodo.typ}-{nodo.ci} | Código: <strong className="text-zinc-800">{nodo.code || 'S/C'}</strong>
                {nodo.nrocta && <span className="ml-2 text-zinc-400">| N° Cta: {nodo.nrocta}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-lg">
              Red Directa: {nodo.hijos.length} afiliados
            </span>
            <span className={`inline-flex items-center gap-1 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
              nodo.idestatus === 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {nodo.idestatus === 1 ? 'Online' : 'Manual'}
            </span>
          </div>
        </div>

        {nodo.hijos.length > 0 && (
          <div className="mt-1">
            {nodo.hijos.map(hijo => renderNodo(hijo, profundidad + 1))}
          </div>
        )}
      </div>
    );
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

      {/* Header y Acciones */}
      <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <span>🌳</span> Árbol de Jerarquía y Red de Afiliados
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Visualización jerárquica de líderes Nivel 1 y sus ramificaciones subordinadas
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMostrarCargaMasiva(!mostrarCargaMasiva)}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm ${
            mostrarCargaMasiva ? 'bg-zinc-100 text-zinc-800' : 'bg-zinc-900 text-white'
          }`}
        >
          {mostrarCargaMasiva ? '✕ Ocultar Carga Masiva' : '📥 Importar Red desde Excel (.xlsx)'}
        </button>
      </div>

      {/* Carga Masiva Formulario Excel */}
      {mostrarCargaMasiva && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <span>📊</span> Carga Masiva de Afiliados vía Plantilla Excel
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Los registros existentes serán actualizados automáticamente sin duplicarse.
              </p>
            </div>

            <button
              type="button"
              onClick={descargarPlantillaExcel}
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>📥 Descargar Plantilla Modelo (.xlsx)</span>
            </button>
          </div>

          <form onSubmit={handleCargaMasiva} className="space-y-5">
            <div className="p-6 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-300 text-center space-y-3">
              <div className="text-3xl">📄</div>
              <div>
                <label htmlFor="file-upload" className="font-bold text-xs text-zinc-900 hover:underline cursor-pointer">
                  Haga clic para seleccionar un archivo Excel
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-[11px] text-zinc-500 mt-1">Soporta formatos oficiales de Microsoft Excel (.xlsx, .xls)</p>
              </div>

              {archivoExcel && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-xl font-mono text-xs text-zinc-800 font-bold">
                  <span>📎 {archivoExcel.name}</span>
                  <span className="text-emerald-600">({registrosExcel.length} registros listos)</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setArchivoExcel(null);
                  setRegistrosExcel([]);
                  setMostrarCargaMasiva(false);
                }}
                className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={registrosExcel.length === 0 || cargandoProceso}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all ${
                  registrosExcel.length > 0 && !cargandoProceso
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer'
                    : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                }`}
              >
                {cargandoProceso ? 'Procesando en Servidor...' : `Procesar e Importar (${registrosExcel.length}) Registros`}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Árbol Jerárquico Visual */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
        <h3 className="text-sm font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">
          Estructura de Árbol de la Nómina
        </h3>
        {arbolRed.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-sm">
            No se han registrado afiliados en la red.
          </div>
        ) : (
          arbolRed.map(raiz => renderNodo(raiz))
        )}
      </div>
    </div>
  );
}