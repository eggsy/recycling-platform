import { selectedAtom } from "@/store/selected";
import { useAtom } from "jotai";
import { TbRecycle, TbClock } from "react-icons/tb";
import Image from "next/image";

interface ICardProps {
  image: string;
  title: string;
  type?: "category" | "item";
  setSelectedCategory?: any;
}

export const Card = ({
  type = "item",
  image,
  title,
  setSelectedCategory,
}: ICardProps) => {
  const [_, setSelected] = useAtom(selectedAtom);

  const handleClick = () => {
    if (type === "category") {
      setSelectedCategory?.(title.toLowerCase());
    } else {
      setSelected(title);
    }
  };

  return (
    <div
      className="flex items-center gap-1 transition-colors cursor-pointer select-none hover:bg-white/30"
      onClick={handleClick}
    >
      <div className="p-3 rounded-lg">
        <Image
          src={image}
          alt="Item image"
          width={75}
          height={75}
          className="flex-shrink-0 object-cover rounded-lg"
        />
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-medium">{title}</h1>

        {type === "item" && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 text-xs text-red-600 rounded-lg w-max bg-red-600/10">
              <TbClock className="mr-1" />
              12 year(s)
            </span>

            <span className="inline-flex items-center px-2 py-1 text-xs text-green-600 rounded-lg w-max bg-green-600/10">
              <TbRecycle className="mr-1" />3 benefit(s)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
