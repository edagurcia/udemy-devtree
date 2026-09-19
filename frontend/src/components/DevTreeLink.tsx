import type { SocialType } from "../types";

type Props = {
  link: SocialType;
};

export const DevTreeLink = ({ link }: Props) => {
  return (
    <li className="bg-white px-5 py-2 flex items-center gap-5 rounded-lg">
      <div
        className="w-12 h-12 bg-cover"
        style={{ backgroundImage: `url("/social/icon_${link.name}.svg")` }}
      ></div>
      <p className="capitalize">Sígueme en: {link.name}</p>
    </li>
  );
};
