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
import { selectedAtom } from "@/store/selected";
import { motion, AnimatePresence } from "framer-motion";

// Components
import { Card } from "@/components/Card";

interface IItemData {
  title: string;
  image?: string;
}

const itemsData = {
  organic: [
    {
      title: "Banana Waste",
      image: "/images/banana.jpg",
    },
    {
      title: "Apple Waste",
      image: "/images/apple.jpg",
    },
    {
      title: "Orange Waste",
      image: "/images/orange.jpg",
    },
    {
      title: "Strawberry Waste",
      image: "/images/strawberry.jpg",
    },
    {
      title: "Pineapple Waste",
      image: "/images/pineapple.jpg",
    },
    {
      title: "Watermelon Waste",
      image: "/images/watermelon.jpg",
    },
  ],
} as const;

export default function Home() {
  const [search, setSearch] = useState("");
  const [parent] = useAutoAnimate();
  const [selected, setSelected] = useAtom(selectedAtom);
  const [selectedCategory, setSelectedCategory] = useState<
    null | keyof typeof itemsData
  >(null);

  const getFilteredResults = useMemo(() => {
    if (selectedCategory) {
      return itemsData[selectedCategory].filter((i) =>
        i.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    return Object.keys(itemsData)
      .filter((i) => i.toLowerCase().includes(search.toLowerCase()))
      .map((i) => ({ title: `${i[0].toUpperCase()}${i.slice(1)}` }));
  }, [search, selectedCategory]);

  return (
    <div className="flex gap-8 h-[80vh] max-h-[1000px]">
      <aside className="flex flex-col flex-shrink-0 w-3/12 rounded-lg bg-gray-100/70 backdrop-blur-md ring-1 ring-black/10">
        <div className="flex items-center border-b rounded-t-lg bg-gray-100/70 backdrop-blur-md border-black/10">
          <TbSearch className="ml-4 text-lg text-black/50" />
          <input
            placeholder="Search..."
            className="w-full px-4 py-3 text-black rounded-t-lg outline-none bg-gray-100/70"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ul
          ref={parent}
          className="flex-grow overflow-y-auto rounded-b-lg keep-scrolling"
        >
          {selectedCategory && (
            <li
              className="flex items-center px-3 py-2 space-x-1 text-sm cursor-pointer hover:bg-white/30"
              onClick={() => setSelectedCategory(null)}
            >
              <TbChevronLeft />
              <span>Back</span>
            </li>
          )}

          {getFilteredResults.length === 0 && (
            <li className="block my-4 text-center">No results found...</li>
          )}

          {getFilteredResults.map((item, index) => (
            <li key={item.title}>
              <Card
                type={selectedCategory ? "item" : "category"}
                title={item.title}
                image={`https://picsum.photos/100/100?random=${index}`}
                setSelectedCategory={setSelectedCategory}
              />
            </li>
          ))}
        </ul>
      </aside>

      <AnimatePresence>
        {selected && (
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
            className="flex flex-col flex-grow space-y-4 rounded-lg ring-1 ring-black/10 bg-gray-100/70 backdrop-blur-md"
          >
            <header className="flex items-center gap-3 px-6 py-3 bg-white rounded-t-lg">
              <TbX
                size={24}
                className="p-1 text-red-600 transition-colors rounded-full cursor-pointer bg-red-600/10 hover:bg-red-600 hover:text-white"
                onClick={() => setSelected(null)}
              />

              <h1 className="font-medium">{selected}</h1>
            </header>

            <div className="flex flex-col gap-4 px-6 py-4">
              <section className="flex justify-between gap-4">
                <div className="flex flex-col space-y-8">
                  <p className="text-black/80">
                    <span className="px-3 py-1 font-medium rounded-lg bg-black/10">
                      {selected}
                    </span>{" "}
                    takes{" "}
                    <span className="inline-flex items-center px-3 py-1 font-medium text-red-600 rounded-lg bg-red-600/10">
                      <TbClock className="mr-1.5" />
                      10 years
                    </span>{" "}
                    to decompose. We can protect our environment by throwing
                    them into{" "}
                    <span className="inline-flex items-center px-3 py-1 font-medium text-green-600 rounded-lg bg-green-600/10">
                      <TbRecycle className="mr-1.5" />
                      organic waste
                    </span>{" "}
                    bins.
                  </p>

                  <div className="flex flex-col space-y-3">
                    <h3 className="text-sm font-semibold uppercase border-b w-max border-black/10">
                      How does it affect the environment
                    </h3>

                    <ul className="pl-4 list-disc">
                      <li>very bad</li>
                      <li>cok kötü</li>
                    </ul>
                  </div>
                </div>

                <Image
                  src="https://picsum.photos/300/300?random=10"
                  alt="Image"
                  width={300}
                  height={300}
                  className="flex-shrink-0 rounded-lg ring-1 ring-black/10"
                  draggable="false"
                />
              </section>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
