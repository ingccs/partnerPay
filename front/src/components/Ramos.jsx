import { useState } from 'react';

export default function Ramos({ ramos, busquedaRamo, setBusquedaRamo }) {
  // Filtro local para buscar por descripción o código SISIP
  const ramosFiltrados = ramos.filter(ramo => 
    ramo.xRamoSisip.toLowerCase().includes(busquedaRamo.toLowerCase()) || 
    (ramo.cRamoSisip && String(ramo.cRamoSisip).includes(busquedaRamo))
  );

  return (
    <div className="space-y-8">
      {/* Tarjetas KPI Informativas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Ramos Registrados</p>
            <h3 className="text-3xl font-extrabold text-zinc-900">{ramos.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-xl">📑</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Estado del Módulo</p>
            <h3 className="text-sm font-bold text-emerald-600 flex items-center gap-2 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Sincronizado con BD
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-xl">⚡</div>
        </div>
      </div>

      {/* Listado y Tabla de Ramos */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Directorio de Ramos Operativos</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Consulta de registros de ramos SISIP</p>
          </div>
          <input 
            type="text" 
            placeholder="Buscar por nombre o código..." 
            value={busquedaRamo}
            onChange={(e) => setBusquedaRamo(e.target.value)}
            className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-900 w-full sm:w-64 font-medium text-zinc-900"
          />
        </div>

        {ramosFiltrados.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 text-sm font-medium">
            No se encontraron ramos registrados o que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-400 text-[11px] font-bold uppercase tracking-wider">
                  
                  <th className="py-4 px-6">Código SISIP</th>
                  <th className="py-4 px-6">Descripción</th>
                  <th className="py-4 px-6 text-center">Condicionado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {ramosFiltrados.map((ramo) => (
                  <tr key={ramo.idRamo} className="hover:bg-zinc-50/60 transition-colors">
                    
                    <td className="py-4 px-6 font-medium text-zinc-600 text-sm">
                      {ramo.cRamoSisip !== null && ramo.cRamoSisip !== undefined ? ramo.cRamoSisip : <span className="text-zinc-400 italic">N/A</span>}
                    </td>
                    <td className="py-4 px-6 font-semibold text-zinc-900 text-sm">{ramo.xRamoSisip}</td>
                    <td className="py-4 px-6 text-center">
                      {ramo.condicionado ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
                          Disponible ({Math.round(ramo.condicionado.length / 1024)} KB)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-zinc-100 text-zinc-500 rounded-lg text-xs font-medium">
                          Sin archivo
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}