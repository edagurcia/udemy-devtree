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
    const updatedData = devTreeLinks.map((item) => {
      const userLink = JSON.parse(user.links).find(
        (link: SocialType) => link.name === item.name,
      );

      if (userLink) {
        return {
          ...item,
          url: userLink.url,
          enabled: userLink.enabled,
        };
      } else {
        return item;
      }
    });

    setDevTreeLinks(updatedData);
  }, []);

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map((link) =>
      link.name === e.target.name ? { ...link, url: e.target.value } : link,
    );

    setDevTreeLinks(updatedLinks);
  };

  const links: SocialType[] = JSON.parse(user.links);

  const handleEnableLink = (social: string) => {
    const updatedLinks = devTreeLinks.map((link) => {
      if (link.name === social) {
        if (isValidUrl(link.url)) {
          return { ...link, enabled: !link.enabled };
        } else {
          toast.error("URL No valida");
          return link;
        }
      } else {
        return link;
      }
    });

    setDevTreeLinks(updatedLinks);

    let updatedSocialItems: SocialType[] = [];

    const selectedSocialNetwork = updatedLinks.find(
      (link) => link.name === social,
    );

    if (selectedSocialNetwork?.enabled) {
      // identificar si la red existe en el arreglo
      const id = links.filter((link) => link.id).length + 1;

      if (links.some((link) => link.name === social)) {
        updatedSocialItems.map((link) => {
          if (link.name === social) {
            return {
              ...link,
              enabled: true,
              id,
            };
          } else {
            return link;
          }
        });
      } else {
        // adicionar ID sino existe para que drag n drop funcione
        const newSocialItem = {
          ...selectedSocialNetwork,
          id,
        };

        updatedSocialItems = [...links, newSocialItem];
      }
    } else {
      // deshabilitar la red social en el arreglo antes de almacenar sin repetir la ID
      const indexToUpdate = links.findIndex((link) => link.name === social);

      updatedSocialItems = links.map((link) => {
        if (link.name === social) {
          return {
            ...link,
            id: 0,
            enabled: false,
          };
        } else if (link.id > indexToUpdate) {
          return {
            ...link,
            id: link.id - 1,
          };
        } else {
          return link;
        }
      });
    }

    // Logica que almacena en la base de datos
    queryClient.setQueryData(["user"], (prevData: UserType) => {
      return {
        ...prevData,
        links: JSON.stringify(updatedSocialItems),
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
          onClick={() => mutate(user)}
          className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
        >
          Guardar cambios
        </button>
      </div>
    </>
  );
};
