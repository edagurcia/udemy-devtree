import { useSortable } from "@dnd-kit/react/sortable";
import type { SocialType } from "../types";

type Props = {
  link: SocialType;
  index: number;
};

export const DevTreeLink = ({ link, index }: Props) => {
  const { ref, isDragging } = useSortable({
    id: link.name,
    index,
  });

  return (
    <li
      ref={ref}
      className={`bg-white px-5 py-2 flex items-center gap-5 rounded-lg cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div
        className="w-12 h-12 bg-cover"
        style={{ backgroundImage: `url("/social/icon_${link.name}.svg")` }}
      />
      <p className="capitalize">Sígueme en: {link.name}</p>
    </li>
  );
};
