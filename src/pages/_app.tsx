import type { AppProps } from "next/app";
import { Montserrat } from "next/font/google";
import Head from "next/head";
import clsx from "clsx";
import Image from "next/image";
import { motion } from "framer-motion";

import "@/styles/tailwind.css";

// Components
import { Navbar } from "@/components/Navbar";

const inter = Montserrat({
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Semih App</title>
      </Head>

      <Navbar fontFamily={inter.className} />

      <div
        className={clsx(
          inter.className,
          "container px-4 md:px-0 md:w-11/12 mx-auto pb-10"
        )}
      >
        <Component {...pageProps} />
      </div>

      <motion.div
        whileHover={{
          rotate: 10,
          scale: 1.1,
        }}
        className="fixed right-0 -bottom-4"
      >
        <Image
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
