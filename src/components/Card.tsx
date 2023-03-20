import { useAtom } from "jotai";
import { TbRecycle, TbClock } from "react-icons/tb";
import Image from "next/image";
import { itemsAtom } from "@/store/items";
import { categoriesAtom } from "@/store/categories";

interface ICardProps {
  id: string;
  image: string;
  name: string;
  decomposeTime?: string;
  type?: "category" | "item";
}

export const Card = ({
  id,
  type = "item",
  image,
  name,
  decomposeTime,
}: ICardProps) => {
  const [_, setCategories] = useAtom(categoriesAtom);
  const [__, setItems] = useAtom(itemsAtom);

  const handleClick = () => {
    if (type === "category") {
      setCategories((p) => ({ ...p, selectedCategoryId: id }));
    } else {
      setItems((p) => ({ ...p, selectedItemId: id }));
    }
  };

  return (
    <div
      className="flex cursor-pointer select-none items-center gap-1 transition-colors hover:bg-white/30"
      onClick={handleClick}
    >
      <div className="flex-shrink-0 rounded-lg p-3">
        <Image
          src={image}
          alt="Item image"
          width={75}
          height={75}
          style={{
            width: 75,
            height: 75,
          }}
          className="rounded-lg object-cover"
        />
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-medium">{name}</h1>

        {type === "item" && (
          <div className="flex flex-wrap items-center gap-2">
            {decomposeTime && (
              <span className="inline-flex w-max items-center rounded-lg bg-red-600/10 px-2 py-1 text-xs text-red-600">
                <TbClock className="mr-1" />
                {decomposeTime}
              </span>
            )}

            <span className="inline-flex w-max items-center rounded-lg bg-green-600/10 px-2 py-1 text-xs text-green-600">
              <TbRecycle className="mr-1" />3 benefit(s)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
