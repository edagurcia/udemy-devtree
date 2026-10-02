import { Link } from "react-router-dom";

export const NotFoundView = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-24 text-center text-slate-100 rounded-2xl">
      <div className="relative flex items-center justify-center">
        <div className="absolute -inset-4 rounded-full bg-indigo-500/20 blur-2xl" />
        <span className="relative text-9xl font-extrabold tracking-widest text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-sky-400 to-emerald-400">
          404
        </span>
      </div>

      <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-5xl">
        Usuario no encontrado
      </h1>

      <p className="mt-4 max-w-md text-base text-slate-400">
        Lo sentimos, el handle del usuario que buscas no existe, ha sido movida
        o el enlace es incorrecto.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 focus-visible:outline-2 focus-visible:outline-indigo-400"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
};
