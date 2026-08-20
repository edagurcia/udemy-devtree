import type { ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ErrorMessage } from "../components/ErrorMessage";
import type { ProfileData, UserType } from "../types";
import { updateUser, uploadImage } from "../api/DevTreeAPI";

export const ProfileView = () => {
  const queryClient = useQueryClient();
  const data: UserType = queryClient.getQueryData(["user"])!;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileData>({
    defaultValues: {
      handle: data.handle,
      description: data.description,
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateUser,
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: (res) => {
      toast.success(res);
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], (prevData: UserType) => {
        return {
          ...prevData,
          image: data.image,
        };
      });
    },
  });

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    if (e.target.files) {
      uploadImageMutation.mutate(e.target.files[0]);
    }
  };

  const handleUserProfileForm = (formData: ProfileData) => {
    updateProfileMutation.mutate(formData);
  };

  return (
    <form
      className="bg-white p-10 rounded-lg space-y-5"
      onSubmit={handleSubmit(handleUserProfileForm)}
    >
      <legend className="text-2xl text-slate-800 text-center">
        Editar Información
      </legend>
      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="handle">Handle:</label>
        <input
          type="text"
          className="border-0 bg-slate-100 rounded-lg p-2"
          placeholder="handle o Nombre de Usuario"
          {...register("handle", {
            required: "El nombre de usuario es obligatorio",
          })}
        />

        {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="description">Descripción:</label>
        <textarea
          className="border-0 bg-slate-100 rounded-lg p-2"
          placeholder="Tu Descripción"
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <label htmlFor="handle">Imagen:</label>
        <input
          id="image"
          type="file"
          name="handle"
          className="border-0 bg-slate-100 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      <input
        type="submit"
        className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
        value="Guardar Cambios"
        disabled={updateProfileMutation.isPending}
      />
    </form>
  );
};
