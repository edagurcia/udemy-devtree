import type { HandleType, SocialType } from "../types";

type Props = {
  data: HandleType;
};

export const HandleInfo = ({ data }: Props) => {
  const links: SocialType[] = JSON.parse(data.links).filter(
    (link: SocialType) => link.enabled,
  );

  return (
    <div className="space-y-6 text-white">
      <p className="text-5xl text-center font-black">{data.handle}</p>

      {data.image && (
        <img
          src={data.image}
          alt={`Imagen avatar de ${data.handle}`}
          className="mx-auto max-w-62.5"
        />
      )}

      <p className="text-lg text-center font-semibold">{data.description}</p>

      <div className="w-full mx-auto mt-20 flex flex-col items-center gap-6">
        {links.length > 0 ? (
          links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white px-5 py-1 flex items-center justify-start gap-5 rounded-lg w-xs"
            >
              <div
                className="w-12 h-12 bg-cover"
                style={{
                  backgroundImage: `url("/social/icon_${link.name}.svg")`,
                }}
              />
              <p className="text-black capitalize font-semibold">
                Visita mi: {link.name}
              </p>
            </a>
          ))
        ) : (
          <p className="text-center">No hay enlaces en este perfil</p>
        )}
      </div>
    </div>
  );
};
