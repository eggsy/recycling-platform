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
        <title>Recycling App</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>

      <Navbar fontFamily={inter.className} />

      <div
        className={clsx(
          inter.className,
          "container mx-auto px-4 pb-10 md:w-11/12 md:px-0"
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
