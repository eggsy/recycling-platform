import { TbCheck, TbClock, TbRecycle, TbX } from "react-icons/tb";
import clsx from "clsx";
import { ReactNode } from "react";
import { toast } from "sonner";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";

// Store
import { IItem } from "@/store/items";

// Components
import { DraggableImage } from "@/components/DraggableImage";

interface IItemWindowProps {
  item: IItem;
  setItems: any;
  category?: string;
  isAdmin?: boolean;
}

export const ItemWindow = ({
  item,
  setItems,
  isAdmin,
  category,
}: IItemWindowProps) => {
  const handleItemDelete = async (itemId: string) => {
    const sure = confirm("Are you sure you want to delete this item?");

    if (!sure) {
      toast.error("Item deletion cancelled.");
      return;
    }

    try {
      await deleteDoc(doc(firestore, `items/${itemId}`));
      await deleteObject(ref(storage, item.image));

      setItems((p: any) => ({
        ...p,
        items: p.items.filter((i: any) => i.id !== itemId),
      }));

      toast.success("Item deleted successfully.");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <header className="flex justify-between gap-6 rounded-t-lg bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <TbX
            size={24}
            className="cursor-pointer rounded-full bg-red-600/10 p-1 text-red-600 transition-colors hover:bg-red-600 hover:text-white"
            onClick={() =>
              setItems((p: any) => ({ ...p, selectedItemId: null }))
            }
          />

          <h1 className="font-medium">{item.name}</h1>
        </div>

        {isAdmin && (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="flex items-center justify-center rounded-lg bg-red-600/20 px-4 py-1 text-xs text-red-600 transition-colors hover:bg-red-600/40"
              title="Delete"
              aria-label="Delete item button"
              onClick={() => handleItemDelete(item.id)}
            >
              <TbX />
              <span>Delete</span>
            </button>
          </div>
        )}
      </header>

      <section className="prose max-w-full px-6 py-4 prose-h3:text-sm prose-h3:uppercase prose-ul:pl-0">
        {item.image && <DraggableImage title={item.name} image={item.image} />}

        <p className="mt-0">
          <Pill>{item.name}</Pill>take(s){" "}
          <Pill variant="red">
            <TbClock className="mr-1.5" />
            {item.decomposeTime}
          </Pill>
          to decompose. We can protect our environment by throwing them into{" "}
          <Pill variant="green">
            <TbRecycle className="mr-1.5" />
            {category}
          </Pill>
          bin(s).
        </p>

        {Boolean(item.results?.length) && (
          <>
            <h3>Environmental damage</h3>

            <ul>
              {item.results?.map((result) => (
                <li key={result} className="not-prose flex space-x-2 pl-0">
                  <TbX
                    size={24}
                    className="flex-shrink-0 rounded-full bg-red-600/20 p-1 text-red-600/70"
                  />
                  <span className="-mt-[2.5px]">{result}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {Boolean(item.benefits?.length) && (
          <>
            <h3>When recycled properly</h3>

            <ul>
              {item.benefits?.map((benefit) => (
                <li key={benefit} className="not-prose flex space-x-2 pl-0">
                  <TbCheck
                    size={24}
                    className="flex-shrink-0 rounded-full bg-green-600/20 p-1 text-green-600"
                  />
                  <span className="-mt-[2.5px]">{benefit}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
};

const Pill = ({
  variant = "black",
  children,
}: {
  variant?: "black" | "red" | "green";
  children: ReactNode;
}) => {
  return (
    <span
      className={clsx(
        "mr-1 inline-flex items-center rounded-lg px-2 py-1 align-middle text-sm font-medium",
        {
          "bg-red-600/10 text-red-600": variant === "red",
          "bg-green-600/10 text-green-600": variant === "green",
          "bg-black/10 text-black": variant === "black",
        }
      )}
    >
      {children}
    </span>
  );
};
