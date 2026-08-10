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
  compCodexPr,
  setCompCodexPr,
  companies,
  eliminarCompany,
  seleccionarParaEditarCompany,
  idEditandoCompany,
  limpiarFormularioCompany
}) {
  return (
    <div className="space-y-8">
      {/* Notificación Flotante de Alto Impacto (Toast) */}
      {notificacion.show && (
        <div className="fixed top-6 right-6 z-50 animate-bounce duration-300">
          <div
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border-2 text-white font-bold backdrop-blur-md transition-all transform scale-105 ${
              notificacion.tipo === 'success'
                ? 'bg-emerald-600/95 border-emerald-400 shadow-emerald-900/30'
                : 'bg-rose-600/95 border-rose-400 shadow-rose-900/30'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0">
              {notificacion.tipo === 'success' ? '🎉' : '⚠️'}
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-white/80 font-black">
                {notificacion.tipo === 'success' ? '¡Operación Exitosa!' : '¡Atención!'}
              </h4>
              <p className="text-sm font-extrabold text-white mt-0.5">
                {notificacion.mensaje}
              </p>
            </div>
            <button
              onClick={() => setNotificacion({ show: false, mensaje: '', tipo: 'success' })}
              className="ml-2 text-white/70 hover:text-white text-sm p-1 rounded-lg transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Formulario de Registro / Edición de Empresas */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-100">
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <span>{idEditandoCompany ? '✏️' : '🏢'}</span> 
            {idEditandoCompany ? `Modificar Empresa #${idEditandoCompany}` : 'Nuevo Proveedor de Servicio'}
          </h3>
          {idEditandoCompany && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">
              Modo Edición Activo
            </span>
          )}
        </div>

        <form onSubmit={handleSubmitCompany} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Código Proveedor (Opcional) */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
              Código Proveedor (Si existe) <span className="text-zinc-400 font-normal">(Opcional)</span>
            </label>
            <input 
              type="text" 
              value={compCodexPr} 
              onChange={(e) => setCompCodexPr(e.target.value)} 
              placeholder="Auto (ID) si se deja vacío" 
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 text-sm font-medium focus:outline-none focus:border-zinc-900"
            />
          </div>

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
                const valEstado = String(state.cestado ?? state.cEstado ?? state.idEstado ?? '');
                return (
                  <option key={state.idEstado || valEstado} value={valEstado}>
                    {state.xDescripcionL ? state.xDescripcionL.trim() : state.xdescripcionL}
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
                const nombreCiudad = String(city.ciuDescripcionL || city.xdescripcionL || "").trim();
                return (
                  <option key={city.idCiudad || nombreCiudad} value={nombreCiudad}>
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

          <div className="sm:col-span-2 lg:col-span-3 pt-2 flex justify-end gap-3">
            {idEditandoCompany && limpiarFormularioCompany && (
              <button
                type="button"
                onClick={limpiarFormularioCompany}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-sm px-5 py-3.5 rounded-xl transition-all cursor-pointer"
              >
                Cancelar Edición
              </button>
            )}
            <button 
              type="submit" 
              className="w-full sm:w-auto py-3.5 px-8 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-all text-sm cursor-pointer shadow-sm"
            >
              {idEditandoCompany ? 'Guardar Cambios en Empresa' : 'Crear Proveedor de Servicio'}
            </button>
          </div>
        </form>
      </div>

      {/* Listado de Empresas Registradas */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-900">Proveedores de Servicios Registrados</h3>
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
                  <th className="py-4 px-6">Código Prov.</th>
                  <th className="py-4 px-6">RIF / CI</th>
                  <th className="py-4 px-6">Razón Social</th>
                  <th className="py-4 px-6">Contacto</th>
                  <th className="py-4 px-6">Ubicación / Dirección</th>
                  <th className="py-4 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {companies.map((comp) => {
                  // Obtención del objeto estado para mostrar su descripción
                  const idEstadoComp = String(comp.cestado ?? comp.cEstado ?? '');
                  const estadoObj = statesList.find(st => String(st.cestado ?? st.cEstado ?? st.idEstado ?? '') === idEstadoComp);
                  const nombreEstado = estadoObj ? (estadoObj.xDescripcionL || estadoObj.xdescripcionL || '').trim() : '';
                  const ciudadComp = comp.xcity || comp.xCity || '';
                  const direccionComp = comp.xdir || comp.xDir || '';

                  return (
                    <tr key={comp.idCmpy || comp.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-zinc-900 text-xs">
                        {comp.codexPr || comp.codex_pr || comp.idCmpy}
                      </td>
                      <td className="py-4 px-6 font-semibold text-zinc-900 text-sm">{comp.typ}-{comp.ci}</td>
                      <td className="py-4 px-6 font-semibold text-zinc-900 text-sm">{comp.name}</td>
                      <td className="py-4 px-6 text-zinc-500 text-sm">
                        {comp.email} <br/>
                        <span className="text-xs text-zinc-400 font-mono">{comp.mobile}</span>
                      </td>
                      <td className="py-4 px-6 text-zinc-600 text-sm">
                        <div className="font-semibold text-zinc-900">
                          {nombreEstado ? `${nombreEstado} - ` : ''}{ciudadComp || 'Sin ciudad'}
                        </div>
                        {direccionComp && (
                          <div className="text-xs text-zinc-400 truncate max-w-xs" title={direccionComp}>
                            {direccionComp}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {seleccionarParaEditarCompany && (
                            <button
                              onClick={() => seleccionarParaEditarCompany(comp)}
                              title="Editar empresa"
                              className="p-2 text-zinc-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => eliminarCompany(comp.idCmpy || comp.id)}
                            title="Eliminar empresa"
                            className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}