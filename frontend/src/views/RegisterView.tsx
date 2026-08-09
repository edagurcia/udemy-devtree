import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ErrorMessage } from "../components/ErrorMessage";
import api from "../config/axios";
import type { RegisterData } from "../types";

export const RegisterView = () => {
  const initialValues: RegisterData = {
    name: "",
    email: "",
    handle: "",
    password: "",
    confirmPassword: "",
  };

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  const password = watch("password");

  const handleRegister = async (formData: RegisterData) => {
    try {
      const { data } = await api.post(`/auth/register`, formData);

      reset();

      toast.success(data.msg);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response?.data.error);
      }
    }
  };

  return (
    <>
      <h1 className="text-white text-2xl text-center">Crear Cuenta</h1>

      <div className="max-w-lg m-auto">
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="bg-white px-5 py-20 rounded-lg gap-y-3 mt-10"
        >
          <div className="grid grid-cols-1">
            <label htmlFor="name" className="text-2xl text-slate-500">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              placeholder="Tu Nombre"
              className="bg-slate-100 border-0 p-3 rounded-lg placeholder:text-slate-400"
              {...register("name", { required: "El nombre es obligatorio" })}
            />

            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>
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
            <label htmlFor="handle" className="text-2xl text-slate-500">
              Handle
            </label>
            <input
              id="handle"
              type="text"
              placeholder="Nombre de usuario: sin espacios"
              className="bg-slate-100 border-0 p-3 rounded-lg placeholder:text-slate-400"
              {...register("handle", { required: "El handle es obligatorio" })}
            />

            {errors.handle && (
              <ErrorMessage>{errors.handle.message}</ErrorMessage>
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

          <div className="grid grid-cols-1">
            <label
              htmlFor="password_confirmation"
              className="text-2xl text-slate-500"
            >
              Repetir Password
            </label>
            <input
              id="password_confirmation"
              type="password"
              placeholder="Repetir Password"
              className="bg-slate-100 border-0 p-3 rounded-lg placeholder:text-slate-400"
              {...register("confirmPassword", {
                required: "Confirmar la contraseña es obligatorio",
                validate: (val) =>
                  val === password || "Los passwords no son iguales",
              })}
            />

            {errors.confirmPassword && (
              <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
            )}
          </div>

          <input
            type="submit"
            className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer mt-5"
            value="Crear Cuenta"
          />
        </form>
      </div>

      <nav className="mt-10">
        <Link
          to={`/auth/login`}
          className="text-center text-white text-lg block"
        >
          Iniciar Sesión
        </Link>
      </nav>
    </>
  );
};
