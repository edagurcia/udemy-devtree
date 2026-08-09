import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ErrorMessage } from "../components/ErrorMessage";
import api from "../config/axios";
import type { LoginData } from "../types";

export const LoginView = () => {
  const initialValues: LoginData = {
    email: "",
    password: "",
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  const handleLogin = async (formData: LoginData) => {
    try {
      const { data } = await api.post(`/auth/login`, formData);

      reset();

      toast.success(data.msg);

      sessionStorage.setItem("AUTH_TOKEN", data.jwt);
    } catch (error) {
      sessionStorage.removeItem("AUTH_TOKEN");

      if (isAxiosError(error) && error.response) {
        toast.error(error.response?.data.error);
      }
    }
  };

  return (
    <>
      <h1 className="text-white text-lg text-center">Iniciar Sesión</h1>

      <div className="max-w-lg m-auto">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="bg-white px-5 py-20 rounded-lg gap-y-3 mt-10"
        >
          <div className="grid grid-cols-1">
            <label htmlFor="email" className="text-2xl text-slate-500">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email de Registro"
              className="bg-slate-100 border-0 p-3 rounded-lg placeholder:text-slate-400"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "E-mail no válido",
                },
              })}
            />

            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </div>

          <div className="grid grid-cols-1">
            <label htmlFor="password" className="text-2xl text-slate-500">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password de Registro"
              className="bg-slate-100 border-0 p-3 rounded-lg placeholder:text-slate-400"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "Debe ser mínimo 8 caracteres",
                },
              })}
            />

            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>

          <input
            type="submit"
            className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer mt-5"
            value="Iniciar Sesión"
          />
        </form>
      </div>

      <nav className="mt-10">
        <Link
          to={`/auth/register`}
          className="text-center text-white text-lg block"
        >
          ¿No tienes una cuenta?
        </Link>
      </nav>
    </>
  );
};
