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
import { categoriesAtom } from "@/store/categories";
import { itemsAtom } from "@/store/items";

// Components
import { Card } from "@/components/Card";

export default function Home() {
  const [search, setSearch] = useState("");
  const [parent] = useAutoAnimate();

  const [categories, setCategories] = useAtom(categoriesAtom);
  const [items, setItems] = useAtom(itemsAtom);

  const getFilteredResults = useMemo(() => {
    if (categories.selectedCategoryId) {
      return items.items.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return categories.categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [
    search,
    items.items,
    categories.selectedCategoryId,
    categories.categories,
  ]);

  const getSelectedItem = useMemo(() => {
    if (!items.selectedItemId) return null;
    return items.items.find((c) => c.id === items.selectedItemId);
  }, [items.items, items.selectedItemId]);

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

          {getFilteredResults.length === 0 && (
            <li className="my-4 block text-center">No results found...</li>
          )}

          {getFilteredResults.map((item, index) => (
            <li key={item.name}>
              <Card
                id={item.id}
                type={categories.selectedCategoryId ? "item" : "category"}
                name={item.name}
                image={`https://picsum.photos/100/100?random=${index}`}
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
            <header className="flex items-center gap-3 rounded-t-lg bg-white px-6 py-3">
              <TbX
                size={24}
                className="cursor-pointer rounded-full bg-red-600/10 p-1 text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                onClick={() =>
                  setItems((p) => ({ ...p, selectedItemId: null }))
                }
              />

              <h1 className="font-medium">{getSelectedItem.name}</h1>
            </header>

            <div className="flex flex-col gap-4 px-6 py-4">
              <section className="flex flex-col-reverse justify-between gap-4 md:flex-row">
                <div className="flex flex-col space-y-8">
                  <p className="text-black/80">
                    <span className="rounded-lg bg-black/10 px-3 py-1.5 align-middle font-medium">
                      {getSelectedItem.name}
                    </span>{" "}
                    take(s){" "}
                    <span className="inline-flex items-center rounded-lg bg-red-600/10 px-3 py-1 align-middle font-medium text-red-600">
                      <TbClock className="mr-1.5" />
                      {getSelectedItem.decomposeTime}
                    </span>{" "}
                    to decompose. We can protect our environment by throwing
                    them into{" "}
                    <span className="inline-flex items-center rounded-lg bg-green-600/10 px-3 py-1 align-middle font-medium text-green-600">
                      <TbRecycle className="mr-1.5" />
                      {getSelectedItem.wasteType}
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
