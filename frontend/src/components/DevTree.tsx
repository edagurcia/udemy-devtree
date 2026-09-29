import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import NavigationTabs from "../components/NavigationTabs";
import { DevTreeLink } from "./DevTreeLink";
import { updateUser } from "../api/DevTreeAPI";
import type { SocialType, UserType } from "../types";

type Props = {
  data: UserType;
};

export const DevTree = ({ data }: Props) => {
  const queryClient = useQueryClient();

  const getParsedLinks = (): SocialType[] => {
    try {
      return JSON.parse(data.links);
    } catch {
      return [];
    }
  };

  const [enabledLinks, setEnabledLinks] = useState<SocialType[]>(() =>
    getParsedLinks().filter((item) => item.enabled),
  );

  const { mutate } = useMutation({
    mutationFn: updateUser,
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Orden actualizado correctamente");
    },
  });

  useEffect(() => {
    const enabled = getParsedLinks().filter((item) => item.enabled);
    setEnabledLinks(enabled);
  }, [data.links]);

  const handleDragEnd = (event: any) => {
    // 1. Reordenar los elementos usando la utilidad nativa de @dnd-kit/helpers v0.5.0
    const reordered = move(enabledLinks, event);

    // Si no hubo cambio en el arreglo, no ejecutamos la mutación
    if (reordered === enabledLinks) return;

    // 2. Actualizar el estado local
    setEnabledLinks(reordered);

    // 3. Sincronizar con todos los enlaces (habilitados + deshabilitados)
    const allLinks = getParsedLinks();
    const disabledLinks = allLinks.filter((item) => !item.enabled);

    const updatedEnabled = reordered.map((link, index) => ({
      ...link,
      id: index + 1,
    }));

    const finalLinks = [...updatedEnabled, ...disabledLinks];

    const updatedUser: UserType = {
      ...data,
      links: JSON.stringify(finalLinks),
    };

    // 4. Actualizar la caché de React Query y ejecutar mutate
    queryClient.setQueryData(["user"], updatedUser);
    mutate(updatedUser);
  };

  return (
    <>
      <header className="bg-slate-800 py-5">
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center md:justify-between">
          <div className="w-full p-5 lg:p-0 md:w-1/3">
            <img src="/logo.svg" className="w-full block" alt="Logo" />
          </div>
          <div className="md:w-1/3 md:flex md:justify-end">
            <button
              className="bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer"
              onClick={() => {}}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>
      <div className="bg-gray-100 min-h-screen py-10">
        <main className="mx-auto max-w-5xl p-10 md:p-0">
          <NavigationTabs />
          <div className="flex justify-end">
            <Link
              className="font-bold text-right text-slate-800 text-2xl"
              to={""}
              target="_blank"
              rel="noreferrer noopener"
            >
              Visitar Mi Perfil
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-10 mt-10">
            <div className="flex-1">
              <Outlet />
            </div>
            <div className="w-full md:w-96 bg-slate-800 px-5 py-10 space-y-6">
              <p className="text-2xl text-center text-white">{data.handle}</p>

              {data.image && (
                <img
                  src={data.image}
                  alt={`Imagen avatar de ${data.handle}`}
                  className="mx-auto max-w-62.5"
                />
              )}

              <p className="text-lg font-black text-center text-white">
                {data.description}
              </p>

              <DragDropProvider
                modifiers={[RestrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
              >
                <ul className="mt-20 flex flex-col gap-5">
                  {enabledLinks.map((link, index) => (
                    <DevTreeLink key={link.name} link={link} index={index} />
                  ))}
                </ul>
              </DragDropProvider>
            </div>
          </div>
        </main>
      </div>
      <Toaster position="top-right" expand={true} richColors={true} />
    </>
  );
};
