export default function DashboardItems({
  items,
  handleSubmitItem,
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  busqueda,
  setBusqueda,
  itemsFiltrados
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Registros</p>
            <h3 className="text-3xl font-extrabold text-zinc-900">{items.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-xl">📦</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Base de Datos</p>
            <h3 className="text-sm font-bold text-emerald-600 flex items-center gap-2 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> PostgreSQL Sincronizado
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-xl">⚡</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 mb-4 pb-2 border-b border-zinc-100">Nuevo Registro</h3>
          <form onSubmit={handleSubmitItem} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Nombre</label>
              <input 
                type="text" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                placeholder="Elemento..." 
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Descripción</label>
              <textarea 
                value={descripcion} 
                onChange={(e) => setDescripcion(e.target.value)} 
                placeholder="Detalles..." 
                rows="3"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900 resize-none"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-sm cursor-pointer">
              Guardar
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-zinc-900">Listado General</h3>
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-900 w-48 font-medium"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-400 text-[11px] font-bold uppercase">
                  <th className="py-3 px-6">Nombre</th>
                  <th className="py-3 px-6">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {itemsFiltrados.map((i) => (
                  <tr key={i.id} className="hover:bg-zinc-50">
                    <td className="py-3 px-6 font-semibold text-sm text-zinc-900">{i.nombre}</td>
                    <td className="py-3 px-6 text-sm text-zinc-500">{i.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}