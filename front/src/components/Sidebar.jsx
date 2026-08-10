import { useState } from 'react';

export default function Sidebar({ seccionActiva, setSeccionActiva }) {
  // Estado para controlar qué secciones están desplegadas (inician todas cerradas/false)
  const [seccionesAbiertas, setSeccionesAbiertas] = useState({
    configuracion: false,
    comercial: false,
    sistema: false
  });

  const toggleSeccion = (clave) => {
    setSeccionesAbiertas(prev => ({
      ...prev,
      [clave]: !prev[clave]
    }));
  };

  const handleSeleccionarOpcion = (itemKey) => {
    setSeccionActiva(itemKey);
  };

  return (
    <aside className="w-72 bg-zinc-950 border-r border-zinc-800 text-zinc-100 flex flex-col hidden md:flex shadow-2xl sticky top-0 h-screen shrink-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-400 text-zinc-950 font-black text-lg flex items-center justify-center shadow-lg">
          PP
        </div>
        <div>
          <h1 className="font-extrabold text-sm tracking-tight text-white">PartnerPay</h1>
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest block">Panel de Control</span>
        </div>
      </div>

      {/* Menú de Navegación Nivel Categorías */}
      <nav className="p-4 space-y-3 flex-1">
        
        {/* Dashboard Principal Directo */}
        <button
          onClick={() => handleSeleccionarOpcion('analytics')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            seccionActiva === 'analytics'
              ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
          }`}
        >
          <span className="text-base">📊</span>
          <span>Métricas Principales</span>
        </button>

        {/* Grupo 1: Configuración Operativa */}
        <div className="border border-zinc-800/60 rounded-2xl overflow-hidden bg-zinc-900/20">
          <button
            onClick={() => toggleSeccion('configuracion')}
            className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">⚙️</span>
              <span>Configuración Operativa</span>
            </div>
            <span className="text-[10px] text-zinc-500 transition-transform duration-200">
              {seccionesAbiertas.configuracion ? '▲' : '▼'}
            </span>
          </button>

          {seccionesAbiertas.configuracion && (
            <div className="p-2 space-y-1 bg-zinc-950/60 border-t border-zinc-800/50">
              <button
                onClick={() => handleSeleccionarOpcion('empresas')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  seccionActiva === 'empresas'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <span>🏢</span>
                <span>Empresas Proveedoras</span>
              </button>

              <button
                onClick={() => handleSeleccionarOpcion('ramos')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  seccionActiva === 'ramos'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <span>🏷️</span>
                <span>Ramos de Seguro</span>
              </button>

              <button
                onClick={() => handleSeleccionarOpcion('productos')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  seccionActiva === 'productos'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <span>📦</span>
                <span>Planes y Coberturas</span>
              </button>
            </div>
          )}
        </div>

        {/* Grupo 2: Gestión Comercial y Finanzas */}
        <div className="border border-zinc-800/60 rounded-2xl overflow-hidden bg-zinc-900/20">
          <button
            onClick={() => toggleSeccion('comercial')}
            className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">💼</span>
              <span>Comercial y Pago</span>
            </div>
            <span className="text-[10px] text-zinc-500 transition-transform duration-200">
              {seccionesAbiertas.comercial ? '▲' : '▼'}
            </span>
          </button>

          {seccionesAbiertas.comercial && (
            <div className="p-2 space-y-1 bg-zinc-950/60 border-t border-zinc-800/50">
              <button
                onClick={() => handleSeleccionarOpcion('afiliados')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  seccionActiva === 'afiliados'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <span>👥</span>
                <span>Afiliados / Vendedores</span>
              </button>

              <button
                onClick={() => handleSeleccionarOpcion('cuentas_pagadoras')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  seccionActiva === 'cuentas_pagadoras'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <span>🏦</span>
                <span>Cuentas Pagadoras</span>
              </button>

              <button
                onClick={() => handleSeleccionarOpcion('frecuencias_pago')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  seccionActiva === 'frecuencias_pago'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <span>📅</span>
                <span>Frecuencias de Pago</span>
              </button>
            </div>
          )}
        </div>

        {/* Grupo 3: Reportes y Soporte */}
        <div className="border border-zinc-800/60 rounded-2xl overflow-hidden bg-zinc-900/20">
          <button
            onClick={() => toggleSeccion('sistema')}
            className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm">📈</span>
              <span>Reportes y Ayuda</span>
            </div>
            <span className="text-[10px] text-zinc-500 transition-transform duration-200">
              {seccionesAbiertas.sistema ? '▲' : '▼'}
            </span>
          </button>

          {seccionesAbiertas.sistema && (
            <div className="p-2 space-y-1 bg-zinc-950/60 border-t border-zinc-800/50">
              <button
                onClick={() => handleSeleccionarOpcion('reportes')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  seccionActiva === 'reportes'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <span>📈</span>
                <span>Centro de Reportes</span>
              </button>

              <button
                onClick={() => handleSeleccionarOpcion('soporte')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  seccionActiva === 'soporte'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <span>🎧</span>
                <span>Soporte Técnico</span>
              </button>
            </div>
          )}
        </div>

      </nav>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-zinc-800/80 bg-zinc-950">
        <div className="p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800/80 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <span className="text-[11px] font-bold text-white block">API Backend .NET</span>
            <span className="text-[10px] text-zinc-400 font-mono">Conectado (5234)</span>
          </div>
        </div>
      </div>
    </aside>
  );
}