import clsx from "clsx";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { TbChevronLeft } from "react-icons/tb";

export const Layout = ({
  children,
  title,
  mainClass,
  rightSide,
  padding = true,
}: {
  children: ReactNode;
  title: string;
  mainClass?: string;
  rightSide?: ReactNode;
  padding?: boolean;
}) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div className="flex flex-col rounded-lg bg-white/70 backdrop-blur-md md:h-[80vh] md:max-h-[1000px]">
        <header className="flex items-center justify-between rounded-t-lg bg-white px-6 py-3">
          <div className="flex items-center gap-3 ">
            <TbChevronLeft
              size={24}
              className="cursor-pointer rounded-full bg-black/10 p-1 text-black/90 transition-colors hover:bg-black hover:text-white"
              onClick={() => router.back()}
            />

            <h1 className="font-medium">{title}</h1>
          </div>

          {rightSide}
        </header>

        <main
          className={clsx(
            mainClass,
            "keep-scrolling w-full overflow-y-auto",
            padding && "p-6"
          )}
        >
          {children}
        </main>
      </div>
    </>
  );
};
