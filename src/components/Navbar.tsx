import { TbUser } from "react-icons/tb";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";

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

export const Navbar = ({ fontFamily }: { fontFamily: string }) => {
  return (
    <nav
      className={clsx(
        fontFamily,
        "container flex bg-gray-100/90 backdrop-blur-md ring-1 ring-white/10 rounded-lg items-center justify-between px-4 my-6 mx-auto md:w-11/12 md:px-0"
      )}
    >
      <div className="flex items-center space-x-6">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="SDG 12"
            width="150"
            height="60"
            className="rounded-l-lg"
            draggable="false"
          />
        </Link>

        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-4 py-2 font-semibold transition-colors rounded-lg text-black/50 hover:text-black"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <button
        type="button"
        title="User Profile"
        className="p-2 mr-4 text-black"
      >
        <TbUser size={24} />
      </button>
    </nav>
  );
};
