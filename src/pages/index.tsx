import {
  TbSearch,
  TbX,
  TbRecycle,
  TbClock,
  TbChevronLeft,
  TbCheck,
} from "react-icons/tb";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Image from "next/image";
import { useAtom } from "jotai";
import { motion, AnimatePresence } from "framer-motion";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "sonner";
import { firestore, storage } from "@/lib/firebase";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import clsx from "clsx";

// Store
import { categoriesAtom } from "@/store/categories";
import { itemsAtom } from "@/store/items";
import { authAtom } from "@/store/auth";

// Components
import { Card } from "@/components/Card";
import { DraggableImage } from "@/components/DraggableImage";

export default function Home() {
  const [search, setSearch] = useState("");
  const [parent] = useAutoAnimate();
  const router = useRouter();

  const [categories, setCategories] = useAtom(categoriesAtom);
  const [items, setItems] = useAtom(itemsAtom);
  const [authCache] = useAtom(authAtom);

  useEffect(() => {
    const search = (router.query.q ||
      router.query.s ||
      router.query.search ||
      router.query.query) as string;

    if (search) setSearch(search);
  }, [router.query]);

  useEffect(() => {
    if (categories.selectedCategoryId && search) setSearch("");
  }, [categories, search, categories.selectedCategoryId]);

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

    try {
      await deleteDoc(doc(firestore, `items/${itemId}`));
      await deleteObject(ref(storage, getSelectedItem?.image));

      setItems((p) => ({
        ...p,
        items: p.items.filter((i) => i.id !== itemId),
      }));

      toast.success("Item deleted successfully.");
    } catch (err: any) {
      toast.error(err.message);
    }
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
            value={search}
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
                    benefits={item.benefits}
                    name={item.name}
                    setItems={setItems}
                    setCategories={setCategories}
                  />
                </li>
              ))
            : getFilteredCategories.map((category) => (
                <li key={category.id}>
                  <Card
                    id={category.id}
                    image={category.image}
                    type="category"
                    isAdmin={authCache.isAdmin}
                    name={category.name}
                    setItems={setItems}
                    setCategories={setCategories}
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

            <section className="prose max-w-full px-6 py-4 prose-h3:text-sm prose-h3:uppercase prose-ul:pl-0">
              {getSelectedItem.image && (
                <DraggableImage image={getSelectedItem.image} />
              )}

              <p className="mt-0">
                <Pill>{getSelectedItem.name}</Pill>take(s){" "}
                <Pill variant="red">
                  <TbClock className="mr-1.5" />
                  {getSelectedItem.decomposeTime}
                </Pill>
                to decompose. We can protect our environment by throwing them
                into{" "}
                <Pill variant="green">
                  <TbRecycle className="mr-1.5" />
                  {categories.categories
                    .find((i) => i.id === getSelectedItem.categoryId)
                    ?.name.toLowerCase()}
                </Pill>
                bin(s).
              </p>

              {Boolean(getSelectedItem.results?.length) && (
                <>
                  <h3>Environmental damage</h3>

                  <ul>
                    {getSelectedItem.results?.map((result) => (
                      <li
                        key={result}
                        className="not-prose flex items-center space-x-2 pl-0"
                      >
                        <TbX
                          size={24}
                          className="rounded-full bg-red-600/20 p-1 text-red-600/70"
                        />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {Boolean(getSelectedItem.results?.length) && (
                <>
                  <h3>When recycled properly</h3>

                  <ul>
                    {getSelectedItem.benefits?.map((benefit) => (
                      <li
                        key={benefit}
                        className="not-prose flex items-center space-x-2 pl-0"
                      >
                        <TbCheck
                          size={24}
                          className="rounded-full bg-green-600/20 p-1 text-green-600"
                        />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

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
