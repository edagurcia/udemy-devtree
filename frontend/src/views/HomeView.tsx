import { Header } from "../components/Header";
import { SearchForm } from "../components/SearchForm";

export const HomeView = () => {
  return (
    <>
      <Header />

      <main className="md:bg-home bg-cover bg-top bg-no-repeat bg-gray-100 min-h-screen pt-12 pb-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-0">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-6xl font-black leading-tight">
              Todas tus <span className="text-cyan-400">redes sociales</span> en
              un enlace
            </h1>

            <p className="text-slate-800 text-xl">
              Únete a mas de 200k developers de todo el mundo, comparte tu
              perfil y tus redes sociales.
            </p>

            <SearchForm />
          </div>
        </div>
      </main>
    </>
  );
};
