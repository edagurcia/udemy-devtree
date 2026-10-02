import { Link } from "react-router-dom";

export const HomeNavigation = () => {
  return (
    <>
      <Link
        to={"/auth/login"}
        className="text-white p-2 uppercase font-black cursor-pointer"
      >
        Iniciar sesión
      </Link>

      <Link
        to={"/auth/register"}
        className="bg-lime-500 text-slate-800 p-2 uppercase font-black cursor-pointer rounded-lg"
      >
        Registrarme
      </Link>
    </>
  );
};
