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

    queryClient.setQueryData(["user"], (prevData: UserType) => {
      return {
        ...prevData,
        links: JSON.stringify(updatedLinks),
      };
    });
  };

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

    queryClient.setQueryData(["user"], (prevData: UserType) => {
      return {
        ...prevData,
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
          onClick={() => mutate(user)}
          className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
        >
          Guardar cambios
        </button>
      </div>
    </>
  );
};
