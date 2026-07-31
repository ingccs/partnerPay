export default function Sidebar({ seccionActiva, setSeccionActiva, menuConfigAbierto, setMenuConfigAbierto, handleLogout }) {
  return (
    <aside className="w-72 bg-zinc-950 border-r border-zinc-800 text-zinc-100 flex flex-col hidden md:flex shadow-2xl">
      <div className="p-6 border-b border-zinc-800 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-zinc-850 border border-zinc-700 text-white font-extrabold flex items-center justify-center text-sm">
          DS
        </div>
        <div>
          <h3 className="text-xs font-bold text-white tracking-wide">PartnerPay</h3>
          <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">Enterprise Suite</span>
        </div>
      </div>

      <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">Principal</div>
        
        <button 
          onClick={() => setSeccionActiva('items')}
          className={`w-full text-left px-3.5 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-3 cursor-pointer ${seccionActiva === 'items' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}
        >
          <span>📋</span> Gestión de Registros
        </button>
        
        <button 
          onClick={() => setSeccionActiva('analytics')}
          className={`w-full text-left px-3.5 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-3 cursor-pointer ${seccionActiva === 'analytics' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}
        >
          <span>📊</span> Métricas del Sistema
        </button>

        <div className="pt-4 pb-2">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">Administración</div>
          
          <div className="bg-zinc-900/60 rounded-2xl p-1.5 border border-zinc-800/80">
            <button 
              onClick={() => setMenuConfigAbierto(!menuConfigAbierto)}
              className="w-full text-left px-3 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-between text-zinc-300 hover:text-white cursor-pointer"
            >
              <span className="flex items-center gap-3"><span>⚙️</span> Configurar</span>
              <span className={`text-[10px] text-zinc-400 transition-transform duration-200 ${menuConfigAbierto ? 'rotate-90 text-white' : ''}`}>▶</span>
            </button>

            {menuConfigAbierto && (
              <div className="pl-3 mt-1 space-y-1 border-l border-zinc-800 ml-4 py-1">
                <button onClick={() => setSeccionActiva('empresas')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${seccionActiva === 'empresas' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}>
                  Empresas
                </button>
                <button onClick={() => setSeccionActiva('productos')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${seccionActiva === 'productos' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}>
                  Productos
                </button>
                <button onClick={() => setSeccionActiva('ramos')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${seccionActiva === 'ramos' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}>
                  Ramos
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-zinc-800 bg-zinc-950">
        <button 
          onClick={handleLogout}
          className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-red-950/60 hover:text-red-400 text-zinc-300 rounded-xl font-semibold text-xs transition-all cursor-pointer border border-zinc-800 flex items-center justify-center gap-2"
        >
          <span>🚪</span> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}