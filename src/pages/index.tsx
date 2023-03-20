import {
  TbSearch,
  TbX,
  TbRecycle,
  TbClock,
  TbChevronLeft,
} from "react-icons/tb";
import { useMemo, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Image from "next/image";
import { useAtom } from "jotai";
import { motion, AnimatePresence } from "framer-motion";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "sonner";
import { firestore, storage } from "@/lib/firebase";

// Store
import { categoriesAtom } from "@/store/categories";
import { itemsAtom } from "@/store/items";
import { authAtom } from "@/store/auth";

// Components
import { Card } from "@/components/Card";
import { deleteObject, ref } from "firebase/storage";

export default function Home() {
  const [search, setSearch] = useState("");
  const [parent] = useAutoAnimate();

  const [categories, setCategories] = useAtom(categoriesAtom);
  const [items, setItems] = useAtom(itemsAtom);
  const [authCache] = useAtom(authAtom);

  const getFilteredItems = useMemo(() => {
    return items.items.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, items.items]);

  const getFilteredCategories = useMemo(() => {
    return categories.categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, categories.categories]);

  const getSelectedItem = useMemo(() => {
    if (!items.selectedItemId) return null;
    return items.items.find((c) => c.id === items.selectedItemId);
  }, [items.items, items.selectedItemId]);

  const handleItemDelete = async (itemId: string) => {
    const sure = confirm("Are you sure you want to delete this item?");

    if (!sure) {
      toast.error("Item deletion cancelled.");
      return;
    }

    await deleteObject(ref(storage, getSelectedItem?.image)).catch((err) => {
      toast.error(err.message);
    });

    await deleteDoc(doc(firestore, `items/${itemId}`)).catch((err) => {
      toast.error(err.message);
    });

    setItems((p) => ({
      ...p,
      items: p.items.filter((i) => i.id !== itemId),
    }));

    toast.success("Item deleted successfully.");
  };

  return (
    <div className="flex flex-col gap-8 md:h-[80vh] md:max-h-[1000px] md:flex-row">
      <aside className="flex max-h-[30vh] flex-shrink-0 flex-col rounded-lg bg-gray-100/70 ring-1 ring-black/10 backdrop-blur-md md:max-h-full md:w-3/12">
        <div className="flex items-center rounded-t-lg border-b border-black/10 bg-gray-100/70 backdrop-blur-md">
          <TbSearch className="ml-4 text-lg text-black/50" />
          <input
            placeholder={`Search ${
              !categories.selectedCategoryId ? "a category" : "an item"
            }...`}
            className="w-full rounded-t-lg bg-gray-100/70 px-4 py-3 text-black outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ul
          ref={parent}
          className="keep-scrolling flex-grow overflow-y-auto rounded-b-lg"
        >
          {categories.selectedCategoryId && (
            <li
              className="flex cursor-pointer items-center space-x-1 px-3 py-2 text-sm hover:bg-white/30"
              onClick={() =>
                setCategories((p) => ({
                  ...p,
                  selectedCategoryId: null,
                }))
              }
            >
              <TbChevronLeft />
              <span>Back</span>
            </li>
          )}

          {categories.selectedCategoryId && getFilteredItems.length === 0 && (
            <li className="my-4 block text-center">No items found...</li>
          )}

          {!categories.selectedCategoryId &&
            getFilteredCategories.length === 0 && (
              <li className="my-4 block text-center">No categories found...</li>
            )}

          {categories.selectedCategoryId
            ? getFilteredItems.map((item) => (
                <li key={item.id}>
                  <Card
                    id={item.id}
                    image={item.image}
                    type="item"
                    decomposeTime={item.decomposeTime}
                    name={item.name}
                  />
                </li>
              ))
            : getFilteredCategories.map((category) => (
                <li key={category.id}>
                  <Card
                    id={category.id}
                    image={category.image}
                    type="category"
                    name={category.name}
                  />
                </li>
              ))}
        </ul>
      </aside>

      <AnimatePresence>
        {getSelectedItem?.id && (
          <motion.main
            initial={{
              opacity: 0,
              translateX: -50,
            }}
            animate={{
              opacity: 1,
              translateX: 0,
              transition: {
                duration: 0.2,
                ease: "easeInOut",
              },
            }}
            exit={{
              opacity: 0,
              translateX: -50,
              transition: {
                duration: 0.2,
                ease: "easeInOut",
              },
            }}
            className="flex flex-grow flex-col space-y-4 rounded-lg bg-gray-100/70 ring-1 ring-black/10 backdrop-blur-md"
          >
            <header className="flex justify-between gap-6 rounded-t-lg bg-white px-6 py-3">
              <div className="flex items-center gap-3">
                <TbX
                  size={24}
                  className="cursor-pointer rounded-full bg-red-600/10 p-1 text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                  onClick={() =>
                    setItems((p) => ({ ...p, selectedItemId: null }))
                  }
                />

                <h1 className="font-medium">{getSelectedItem.name}</h1>
              </div>

              {authCache.isAdmin && (
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-lg bg-red-600/20 px-4 py-1 text-sm text-red-600 transition-colors hover:bg-red-600/40"
                    title="Delete"
                    aria-label="Delete item button"
                    onClick={() => handleItemDelete(getSelectedItem.id)}
                  >
                    <TbX />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </header>

            <div className="flex flex-col gap-4 px-6 py-4">
              <section className="flex flex-col-reverse flex-wrap justify-between gap-4 md:flex-row md:flex-nowrap">
                <div className="flex flex-col space-y-8">
                  <p className="text-black/80">
                    <span className="rounded-lg bg-black/10 px-3 py-1.5 align-middle text-sm font-medium">
                      {getSelectedItem.name}
                    </span>{" "}
                    take(s){" "}
                    <span className="inline-flex items-center rounded-lg bg-red-600/10 px-3 py-1 align-middle text-sm font-medium text-red-600">
                      <TbClock className="mr-1.5" />
                      {getSelectedItem.decomposeTime}
                    </span>{" "}
                    to decompose. We can protect our environment by throwing
                    them into{" "}
                    <span className="inline-flex items-center rounded-lg bg-green-600/10 px-3 py-1 align-middle text-sm font-medium text-green-600">
                      <TbRecycle className="mr-1.5" />
                      {categories.categories
                        .find((i) => i.id === getSelectedItem.categoryId)
                        ?.name.toLowerCase()}
                    </span>{" "}
                    bins.
                  </p>

                  <div className="flex flex-col space-y-3">
                    <h3 className="w-max border-b border-black/10 text-sm font-semibold uppercase">
                      How does it affect the environment
                    </h3>

                    <ul className="list-disc pl-4">
                      <li>very bad</li>
                      <li>cok kötü</li>
                    </ul>
                  </div>
                </div>

                {getSelectedItem.image && (
                  <Image
                    src={getSelectedItem.image}
                    alt="Image"
                    width={300}
                    height={300}
                    className="flex-shrink-0  rounded-lg ring-1 ring-black/10"
                    draggable="false"
                  />
                )}
              </section>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
