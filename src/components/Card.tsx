import { TbRecycle, TbClock, TbX } from "react-icons/tb";
import Image from "next/image";
import { deleteDoc, doc } from "firebase/firestore";
import { firestore, storage } from "@/lib/firebase";
import { deleteObject, ref } from "firebase/storage";
import { toast } from "sonner";

interface ICardProps {
  id: string;
  image: string;
  name: string;
  decomposeTime?: string;
  type?: "category" | "item";
  benefits?: string[];
  isAdmin?: boolean;
  setItems: (p: any) => void;
  setCategories: any;
}

export const Card = ({
  id,
  type = "item",
  image,
  name,
  decomposeTime,
  benefits,
  isAdmin,
  setCategories,
  setItems,
}: ICardProps) => {
  const handleClick = () => {
    if (type === "category") {
      setCategories((p: any) => ({ ...p, selectedCategoryId: id }));
    } else {
      setItems((p: any) => ({ ...p, selectedItemId: id }));
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) return;
    const sure = confirm("Are you sure you want to delete this category?");

    if (!sure) {
      toast.error("Category deletion cancelled.");
      return;
    }

    try {
      await deleteDoc(doc(firestore, `categories/${id}`));
      await deleteObject(ref(storage, image));

      setCategories((p: any) => ({
        ...p,
        categories: p.categories.filter((i: any) => i.id !== id),
      }));

      toast.success("Category deleted successfully.");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div
      className="flex cursor-pointer select-none items-center gap-1 transition-colors hover:bg-white/30"
      onClick={handleClick}
    >
      <div className="group relative flex-shrink-0 rounded-lg p-3">
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

        {isAdmin && (
          <button
            type="button"
            className="absolute inset-0 m-3 grid place-content-center rounded-lg bg-transparent  transition-colors group-hover:bg-red-600/80"
            title="Delete Category"
            aria-label="Delete category"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <div className="backdrop-blue-md rounded-full p-1 text-transparent transition-colors group-hover:bg-white/30 group-hover:text-white">
              <TbX size={32} />
            </div>
          </button>
        )}
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

            {Boolean(benefits?.length) && (
              <span className="inline-flex w-max items-center rounded-lg bg-green-600/10 px-2 py-1 text-xs text-green-600">
                <TbRecycle className="mr-1" />
                {benefits?.length} benefit(s)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
