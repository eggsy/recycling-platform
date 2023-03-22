import { TbSearch, TbChevronLeft } from "react-icons/tb";
import { useEffect, useMemo, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useAtom } from "jotai";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

// Store
import { categoriesAtom } from "@/store/categories";
import { itemsAtom } from "@/store/items";
import { authAtom } from "@/store/auth";

// Components
import { Card } from "@/components/Card";
import { ItemWindow } from "@/components/ItemWindow";

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

  return (
    <div className="flex flex-col gap-8 md:h-[80vh] md:max-h-[1000px] md:flex-row">
      <aside className="flex max-h-[30vh] flex-shrink-0 flex-col rounded-lg bg-gray-100/70 ring-1 ring-black/10 backdrop-blur-md md:max-h-full md:w-3/12">
        <div className="flex items-center rounded-t-lg border-b border-black/10 bg-white/70 backdrop-blur-md">
          <TbSearch className="ml-4 text-lg text-black/50" />
          <input
            placeholder={`Search ${
              !categories.selectedCategoryId ? "a category" : "an item"
            }...`}
            className="w-full rounded-t-lg bg-white/70 px-4 py-3 text-black outline-none"
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

      <AnimatePresence mode="wait" initial={false}>
        {getSelectedItem?.id && (
          <motion.main
            key={getSelectedItem.id}
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
            <ItemWindow
              item={getSelectedItem}
              setItems={setItems}
              isAdmin={authCache.isAdmin}
              category={categories.categories
                .find((i) => i.id === getSelectedItem.categoryId)
                ?.name.toLowerCase()}
            />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
