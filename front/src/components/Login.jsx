export default function Login({ emailLogin, setEmailLogin, passwordLogin, setPasswordLogin, errorLogin, cargandoLogin, handleLogin }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black font-sans text-zinc-100 px-4">
      <div className="w-full max-w-md bg-zinc-900/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-zinc-800 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-zinc-700 to-zinc-900 border border-zinc-700 text-white font-black flex items-center justify-center text-xl mb-4">
            DS
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">PartnerPay</h1>
          <p className="text-xs text-zinc-400 mt-1 font-medium tracking-wide uppercase">Plataforma Administrativa Central</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              value={emailLogin} 
              onChange={(e) => setEmailLogin(e.target.value)} 
              placeholder="admin@empresa.com" 
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 text-sm font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Contraseña</label>
            <input 
              type="password" 
              value={passwordLogin} 
              onChange={(e) => setPasswordLogin(e.target.value)} 
              placeholder="••••••••" 
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 text-sm font-medium"
              required
            />
          </div>
          {errorLogin && (
            <div className="p-3 bg-red-950/50 border border-red-900/50 rounded-xl text-red-400 text-xs font-medium text-center">
              {errorLogin}
            </div>
          )}
          <button 
            type="submit" 
            disabled={cargandoLogin}
            className="w-full py-3.5 bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl transition-all shadow-lg text-sm cursor-pointer mt-2"
          >
            {cargandoLogin ? 'Verificando...' : 'Acceder al Sistema'}
          </button>
        </form>
        <div className="mt-8 text-center text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">
          Development Soft, C.A.
        </div>
      </div>
    </div>
  );
}