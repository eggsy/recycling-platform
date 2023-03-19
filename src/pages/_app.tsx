import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import Head from "next/head";
import clsx from "clsx";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import "@/styles/tailwind.css";

// Components
import { Navbar } from "@/components/Navbar";
import { useRouter } from "next/router";

const inter = Montserrat({
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

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
        className="fixed -z-10 md:z-10 right-0 -bottom-4"
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
    </>
  );
}
