export default function Empresas({
  notificacion,
  setNotificacion,
  handleSubmitCompany,
  compTyp,
  setCompTyp,
  compCi,
  setCompCi,
  compName,
  setCompName,
  compEmail,
  setCompEmail,
  compMobile,
  setCompMobile,
  compCEstado,
  setCompCEstado,
  setCompXCity,
  compXCity,
  statesList,
  ciudadesFiltradas,
  compIdEstatus,
  setCompIdEstatus,
  compXDir,
  setCompXDir,
  companies,
  eliminarCompany
}) {
  return (
    <div className="space-y-8">
      {notificacion.show && (
        <div className={`mb-6 p-4 rounded-2xl border flex items-center justify-between transition-all shadow-sm ${
          notificacion.tipo === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-lg">
              {notificacion.tipo === 'success' ? '✅' : '⚠️'}
            </span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">
                {notificacion.tipo === 'success' ? 'Operación Exitosa' : 'Atención Requerida'}
              </h4>
              <p className="text-sm font-medium mt-0.5">{notificacion.mensaje}</p>
            </div>
          </div>
          <button 
            onClick={() => setNotificacion({ show: false, mensaje: '', tipo: 'success' })}
            className="text-xs font-bold opacity-60 hover:opacity-100 cursor-pointer px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Formulario de Registro de Empresas */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm">
        <h3 className="text-base font-bold text-zinc-900 mb-6 pb-3 border-b border-zinc-100 flex items-center gap-2">
          <span>🏢</span> Registrar Nueva Empresa
        </h3>

        <form onSubmit={handleSubmitCompany} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Tipo (Typ)</label>
            <select 
              value={compTyp} 
              onChange={(e) => setCompTyp(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
            >
              <option value="J">J - Jurídico</option>
              <option value="G">G - Gubernamental</option>
              <option value="V">V - Personal</option>
              <option value="E">E - Extranjero</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">R.I.F. / C.I. (Ci)</label>
            <input 
              type="text" 
              value={compCi} 
              onChange={(e) => setCompCi(e.target.value.replace(/\D/g, ''))} 
              placeholder="Ej. 123456789" 
              maxLength={9}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Nombre de Empresa</label>
            <input 
              type="text" 
              value={compName} 
              onChange={(e) => setCompName(e.target.value)} 
              placeholder="Development Soft, C.A." 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              value={compEmail} 
              onChange={(e) => setCompEmail(e.target.value)} 
              placeholder="contacto@empresa.com" 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Teléfono Móvil</label>
            <input 
              type="text" 
              value={compMobile} 
              onChange={(e) => setCompMobile(e.target.value.replace(/\D/g, ''))} 
              placeholder="04141234567" 
              maxLength={11}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Estado del País</label>
            <select 
              value={compCEstado} 
              onChange={(e) => {
                setCompCEstado(e.target.value);
                setCompXCity('');
              }} 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
              required
            >
              <option value="">Seleccione un estado...</option>
              {statesList.map((state) => {
                const valEstado = state.cestado ?? state.idEstado;
                return (
                  <option key={state.idEstado} value={valEstado}>
                    {state.xDescripcionL.trim()}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Ciudad (XCity)</label>
            <select 
              value={compXCity} 
              onChange={(e) => setCompXCity(e.target.value)} 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
              required
              disabled={!compCEstado}
            >
              <option value="">{compCEstado ? "Seleccione una ciudad..." : "Primero seleccione un estado..."}</option>
              {ciudadesFiltradas.map((city) => {
                const nombreCiudad = String(city.ciuDescripcionL || "").trim();
                return (
                  <option key={city.idCiudad} value={nombreCiudad}>
                    {nombreCiudad}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Estatus (IdEstatus)</label>
            <select 
              value={compIdEstatus} 
              onChange={(e) => setCompIdEstatus(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
            >
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Dirección Fiscal (XDir)</label>
            <input 
              type="text" 
              value={compXDir} 
              onChange={(e) => setCompXDir(e.target.value)} 
              placeholder="Av. Principal, Edificio..." 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
              required
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3 pt-2">
            <button 
              type="submit" 
              className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-all text-sm cursor-pointer shadow-sm"
            >
              Guardar Empresa en Base de Datos
            </button>
          </div>
        </form>
      </div>

      {/* Listado de Empresas Registradas */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-900">Empresas Registradas en el Sistema</h3>
        </div>

        {companies.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 text-sm font-medium">
            No hay empresas registradas actualmente.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">RIF / CI</th>
                  <th className="py-4 px-6">Razón Social</th>
                  <th className="py-4 px-6">Contacto</th>
                  <th className="py-4 px-6">Ciudad</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {companies.map((comp) => (
                  <tr key={comp.idCmpy} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-zinc-900 text-sm">{comp.typ}-{comp.ci}</td>
                    <td className="py-4 px-6 font-semibold text-zinc-900 text-sm">{comp.name}</td>
                    <td className="py-4 px-6 text-zinc-500 text-sm">{comp.email} <br/><span className="text-xs text-zinc-400">{comp.mobile}</span></td>
                    <td className="py-4 px-6 text-zinc-500 text-sm">{comp.xcity}</td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => eliminarCompany(comp.idCmpy)} 
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all cursor-pointer border border-red-200"
                      >
                        Eliminar
                      </button>
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