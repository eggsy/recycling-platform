import { TbUser, TbMenu2, TbX } from "react-icons/tb";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const links = [
  {
    label: "How to Recycle",
    href: "/how",
  },
  {
    label: "About",
    href: "/about",
  },
];

const Links = ({ className }: { className?: string }) => (
  <div
    className={clsx(
      "flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-6",
      className
    )}
  >
    {links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className="rounded-lg bg-black/5 py-2 px-4 font-semibold text-black/50 transition-colors hover:text-black"
      >
        {link.label}
      </Link>
    ))}
  </div>
);

export const Navbar = ({ fontFamily }: { fontFamily: string }) => {
  const [isOpen, setOpen] = useState(false);
  const [parent] = useAutoAnimate();

  return (
    <nav
      ref={parent}
      className={clsx(
        fontFamily,
        "container mx-auto mb-4 flex flex-col gap-4 rounded-lg bg-gray-100/90 py-2 px-4 ring-1 ring-white/10 backdrop-blur-md md:my-6 md:w-11/12 md:py-0 md:px-0"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/">
            <Image
              priority
              src="/logo.png"
              alt="SDG 12"
              width="150"
              height="60"
              className="rounded-l-lg"
              draggable="false"
            />
          </Link>

          <Links className="hidden md:block" />
        </div>

        <div
          title="User Profile"
          className="no-highlight p-2 text-black md:mr-4"
        >
          <button type="button">
            <TbUser size={24} className="hidden md:block" />
          </button>

          {!isOpen && (
            <button type="button" onClick={() => setOpen(true)}>
              <TbMenu2 size={24} className="md:hidden" />
            </button>
          )}

          {isOpen && (
            <button type="button" onClick={() => setOpen(false)}>
              <TbX size={24} className="md:hidden" />
            </button>
          )}
        </div>
      </div>

      {isOpen && <Links />}
    </nav>
  );
};
