import { useEffect, useState, type ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { social } from "../data/socials";
import { DevTreeInput } from "../components/DevTreeInput";
import { isValidUrl } from "../utils";
import { updateUser } from "../api/DevTreeAPI";
import type { SocialType, UserType } from "../types";

export const LinkTreeView = () => {
  const [devTreeLinks, setDevTreeLinks] = useState(social);

  const queryClient = useQueryClient();
  const user: UserType = queryClient.getQueryData(["user"])!;

  const { mutate } = useMutation({
    mutationFn: updateUser,
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Actualizado correctamente");
    },
  });

  useEffect(() => {
    const userLinks: SocialType[] = JSON.parse(user.links);

    const updatedData = devTreeLinks.map((item) => {
      const userLink = userLinks.find((link) => link.name === item.name);
      if (userLink) {
        return {
          ...item,
          url: userLink.url,
          enabled: userLink.enabled,
          id: userLink.id,
        };
      }
      return item;
    });

    setDevTreeLinks(updatedData);
  }, [user.links]);

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 1. Estado local de inputs
    setDevTreeLinks((prev) =>
      prev.map((link) => (link.name === name ? { ...link, url: value } : link)),
    );

    // 2. Caché global usando la función de actualización atómica
    queryClient.setQueryData(["user"], (prevUser: UserType) => {
      if (!prevUser) return prevUser;

      const currentLinks: SocialType[] = JSON.parse(prevUser.links);
      const exists = currentLinks.some((link) => link.name === name);

      let updatedLinks: SocialType[];

      if (exists) {
        updatedLinks = currentLinks.map((link) =>
          link.name === name ? { ...link, url: value } : link,
        );
      } else {
        updatedLinks = [
          ...currentLinks,
          {
            name,
            url: value,
            enabled: false,
            id: 0,
          },
        ];
      }

      return {
        ...prevUser,
        links: JSON.stringify(updatedLinks),
      };
    });
  };

  const handleEnableLink = (socialName: string) => {
    const selectedLink = devTreeLinks.find((link) => link.name === socialName);

    if (!selectedLink || !isValidUrl(selectedLink.url)) {
      toast.error("URL No válida");
      return;
    }

    // 1. ACTUALIZAR ESTADO LOCAL (para que el switch cambie visualmente al instante)
    setDevTreeLinks((prev) =>
      prev.map((link) =>
        link.name === socialName ? { ...link, enabled: !link.enabled } : link,
      ),
    );

    // 2. TU LÓGICA ORIGINAL DE CACHÉ EN REACT QUERY
    queryClient.setQueryData(["user"], (prevUser: UserType) => {
      if (!prevUser) return prevUser;

      const currentLinks: SocialType[] = JSON.parse(prevUser.links);
      const linkIndex = currentLinks.findIndex(
        (link) => link.name === socialName,
      );

      let updatedLinks: SocialType[] = [...currentLinks];

      if (linkIndex !== -1) {
        const target = updatedLinks[linkIndex];
        const newEnabledState = !target.enabled;

        if (newEnabledState) {
          const enabledCount = updatedLinks.filter((l) => l.enabled).length;
          updatedLinks[linkIndex] = {
            ...target,
            enabled: true,
            id: enabledCount + 1,
          };
        } else {
          const oldId = target.id;
          updatedLinks[linkIndex] = {
            ...target,
            enabled: false,
            id: 0,
          };

          updatedLinks = updatedLinks.map((l) =>
            l.enabled && l.id > oldId ? { ...l, id: l.id - 1 } : l,
          );
        }
      } else {
        const enabledCount = updatedLinks.filter((l) => l.enabled).length;
        updatedLinks.push({
          ...selectedLink,
          enabled: true,
          id: enabledCount + 1,
        });
      }

      return {
        ...prevUser,
        links: JSON.stringify(updatedLinks),
      };
    });
  };

  return (
    <>
      <div className="space-y-5">
        {devTreeLinks.map((item) => (
          <DevTreeInput
            key={item.name}
            item={item}
            handleUrlChange={handleUrlChange}
            handleEnableLink={handleEnableLink}
          />
        ))}

        <button
          type="button"
          onClick={() => {
            const currentUser: UserType = queryClient.getQueryData(["user"])!;
            mutate(currentUser);
          }}
          className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
        >
          Guardar cambios
        </button>
      </div>
    </>
  );
};
