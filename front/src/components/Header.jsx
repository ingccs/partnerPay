export default function Header({ seccionActiva }) {
  const titulosSeccion = {
    items: 'Gestión General de Registros',
    analytics: 'Métricas y Rendimiento del Sistema',
    empresas: 'Directorio y Registro de Empresas',
    productos: 'Catálogo de Productos',
    ramos: 'Gestión de Ramos Operativos',
    cuentas_pagadoras: 'Cuentas Pagadoras',
    frecuencias_pago: 'Frecuencias de Pago',
    afiliados: 'Gestión de Afiliados y Vendedores',
    reportes: 'Centro de Reportes y Analítica',
    soporte: 'Soporte Técnico y Mesa de Ayuda'
  };

  return (
    <header className="h-20 bg-zinc-950 border-b border-zinc-800 px-6 sm:px-10 flex justify-between items-center sticky top-0 z-10 shadow-md">
      <div>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">PartnerPay</span>
        <h2 className="text-base font-bold text-white tracking-tight">
          {titulosSeccion[seccionActiva] || 'Módulo del Sistema'}
        </h2>
      </div>
      
      <div className="flex items-center gap-4 bg-zinc-900/90 py-2 px-3.5 rounded-2xl border border-zinc-800">
        <div className="text-right hidden sm:block">
          <span className="text-xs font-bold text-white block leading-tight">Super Admin</span>
          <span className="text-[10px] text-zinc-400 font-medium">admin@empresa.com</span>
        </div>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-zinc-700 to-zinc-800 border border-zinc-600 text-white flex items-center justify-center font-bold text-xs">
          SA
        </div>
      </div>
    </header>
  );
}