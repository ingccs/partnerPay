export default function DashboardMetrics({ 
  companies = [], 
  ramos = [], 
  productos = [], 
  frecuencias = [],
  setSeccionActiva 
}) {

  // Cálculos dinámicos
  const totalProveedores = companies.length;
  const proveedoresActivos = companies.filter(c => (c.idestatus ?? c.idEstatus ?? 1) === 1).length;
  
  const totalRamos = ramos.length;
  
  const totalPlanes = productos.length;
  const planesActivos = productos.filter(p => (p.idestatus ?? p.idEstatus ?? 1) === 1).length;

  const totalFrecuencias = frecuencias.length;

  // Cálculo total de coberturas configuradas a nivel global
  const totalCoberturasConfiguradas = productos.reduce((acc, prod) => {
    const rawCov = prod.coverages ?? prod.Coverages ?? [];
    const covList = Array.isArray(rawCov) ? rawCov : (rawCov.$values || []);
    return acc + covList.length;
  }, 0);

  // Estimación referencial para el MVP de Pólizas (puedes enlazarlo a tu tabla de pólizas luego)
  const polizasEmitidasMock = 128; 
  const primaPromedioMock = "$ 450.00";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner de Bienvenida y Resumen General */}
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-850 to-zinc-950 p-8 sm:p-10 rounded-3xl border border-zinc-800 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <span>🚀</span> Control Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              PartnerPay Visión General
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl font-medium">
              Seguimiento tiempo real con estadísticas de proveedores, ramos, catálogo de planes y servicios activos.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSeccionActiva('productos')}
              className="bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs px-5 py-3 rounded-2xl transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>📦</span> + Nuevo Plan
            </button>
            <button
              onClick={() => setSeccionActiva('empresas')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-5 py-3 rounded-2xl transition-all border border-zinc-700 cursor-pointer flex items-center gap-2"
            >
              <span>🏢</span> Registrar Proveedor
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Cards KPIs Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Proveedores */}
        <div 
          onClick={() => setSeccionActiva('empresas')}
          className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🏢
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
              {proveedoresActivos} Activas
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Proveedores</p>
          <h3 className="text-3xl font-black text-zinc-900 mt-1 font-mono">{totalProveedores}</h3>
          <p className="text-[11px] text-zinc-500 mt-2 font-medium">Empresas aseguradoras y servicios</p>
        </div>

        {/* Card 2: Planes y Productos */}
        <div 
          onClick={() => setSeccionActiva('productos')}
          className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              📦
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800">
              {planesActivos} Vigentes
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Planes & Coberturas</p>
          <h3 className="text-3xl font-black text-zinc-900 mt-1 font-mono">{totalPlanes}</h3>
          <p className="text-[11px] text-zinc-500 mt-2 font-medium">{totalCoberturasConfiguradas} coberturas asociadas</p>
        </div>

        {/* Card 3: Ramos */}
        <div 
          onClick={() => setSeccionActiva('ramos')}
          className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🛡️
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700">
              SISIP
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ramos Habilitados</p>
          <h3 className="text-3xl font-black text-zinc-900 mt-1 font-mono">{totalRamos}</h3>
          <p className="text-[11px] text-zinc-500 mt-2 font-medium">Categorías de pólizas operativas</p>
        </div>

        {/* Card 4: Pólizas Emitidas / Operaciones */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-xl">
              📄
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800">
              Global
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Pólizas Registradas</p>
          <h3 className="text-3xl font-black text-zinc-900 mt-1 font-mono">{polizasEmitidasMock}</h3>
          <p className="text-[11px] text-zinc-500 mt-2 font-medium">Ticket Promedio: {primaPromedioMock}</p>
        </div>

      </div>

      {/* Sección Secundaria: Desglose Rápido & Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tabla de Planes Destacados */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <span>⚡</span> Planes Recientemente Registrados
                </h3>
                <p className="text-xs text-zinc-500">Últimas configuraciones ingresadas a la plataforma</p>
              </div>
              <button 
                onClick={() => setSeccionActiva('productos')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
              >
                Ver todos →
              </button>
            </div>

            {productos.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-sm">
                Aún no hay productos registrados en el sistema.
              </div>
            ) : (
              <div className="space-y-3">
                {productos.slice(0, 4).map((prod, idx) => {
                  const planNombre = prod.cplanSisip ?? prod.cplan_sisip ?? 'Plan General';
                  const rawCov = prod.coverages ?? prod.Coverages ?? [];
                  const covList = Array.isArray(rawCov) ? rawCov : (rawCov.$values || []);

                  // Empresa asociada
                  const empresaObj = companies.find(c => String(c.idCmpy ?? c.idcmpy ?? c.id) === String(prod.idcmpy));
                  const empresaNombre = empresaObj ? (empresaObj.name || empresaObj.xname) : `Proveedor #${prod.idcmpy}`;

                  return (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 hover:border-zinc-300 transition-all">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                          P#{prod.idproduct}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900">{planNombre}</h4>
                          <p className="text-xs text-zinc-500 font-medium">{empresaNombre}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                          {covList.length} Coberturas
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Card Lateral de Estado Operativo */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-900 mb-1 flex items-center gap-2">
              <span>⚙️</span> Tablas Operativas del Sistema
            </h3>
            <p className="text-xs text-zinc-500 mb-6">Mapeo de módulos principales</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <span className="text-xs font-bold text-zinc-700">Frecuencias de Pago</span>
                <span className="text-xs font-bold text-zinc-900 font-mono">{totalFrecuencias} registradas</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <span className="text-xs font-bold text-zinc-700">Ramos Configurados</span>
                <span className="text-xs font-bold text-zinc-900 font-mono">{totalRamos} categorías</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <span className="text-xs font-bold text-zinc-700">Sincronización PostgreSQL</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase">
                  Conectado
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">
              PartnerPay Engine v2026.1
            </span>
            <button 
              onClick={() => setSeccionActiva('frecuencias_pago')}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Gestionar Frecuencias de Pago
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}