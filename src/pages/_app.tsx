import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import Head from "next/head";
import { Toaster } from "sonner";
import clsx from "clsx";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { getCategories } from "@/lib/getCategories";
import { getItems } from "@/lib/getItems";
import { useCallback, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";

// Store
import { categoriesAtom } from "@/store/categories";
import { itemsAtom } from "@/store/items";
import { authAtom, adminUids } from "@/store/auth";

// Styles
import "@/styles/tailwind.css";

// Components
import { Navbar } from "@/components/Navbar";
import { User } from "firebase/auth";

const inter = Montserrat({
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const [category, setCategories] = useAtom(categoriesAtom);
  const [_, setItems] = useAtom(itemsAtom);
  const [authCache, setAuth] = useAtom(authAtom);

  const onAuthStateChanged = useCallback(
    (user: User | null) => {
      if (user && authCache.user?.uid !== user.uid) {
        setAuth({
          isAdmin: adminUids.includes(user.uid),
          user,
        });
      } else if (!user && authCache.user) {
        setAuth({
          isAdmin: false,
          user: null,
        });
      }
    },
    [authCache.user, setAuth]
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(onAuthStateChanged);
    return () => unsubscribe();
  }, [onAuthStateChanged]);

  useEffect(() => {
    getCategories().then((categories) =>
      setCategories((p) => ({
        ...p,
        categories,
      }))
    );
  }, [setCategories]);

  useEffect(() => {
    if (!category.selectedCategoryId) return;

    getItems(category.selectedCategoryId).then((items) =>
      setItems((p) => ({
        ...p,
        items,
      }))
    );
  }, [category.selectedCategoryId, setItems]);

  return (
    <>
      <Head>
        <title>Recycling App</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>

      <Navbar fontFamily={inter.className} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
          }}
          className={clsx(
            inter.className,
            "container mx-auto  px-4 pb-10 md:w-11/12 md:px-0"
          )}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>

      <motion.div
        whileHover={{
          rotate: 10,
          scale: 1.1,
        }}
        className="fixed right-0 -bottom-4 -z-10 md:z-10"
      >
        <Image
          priority
          src="/woman.png"
          width="200"
          height="200"
          alt="Woman planting something"
          draggable="false"
        />
      </motion.div>

      <Toaster />
    </>
  );
}
