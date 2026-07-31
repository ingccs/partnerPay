export default function ModuloGenerico({ seccionActiva }) {
  return (
    <div className="bg-white p-12 rounded-3xl border border-zinc-200 text-center max-w-xl mx-auto my-12 shadow-sm">
      <h3 className="text-lg font-bold text-zinc-900 mb-2">Módulo: {seccionActiva.toUpperCase()}</h3>
      <p className="text-sm text-zinc-500">Sección enlazada y lista para operar.</p>
    </div>
  );
}