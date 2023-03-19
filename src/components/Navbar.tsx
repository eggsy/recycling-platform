import { TbUser, TbMenu2, TbX, TbLogout } from "react-icons/tb";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase/clientApp";
import { useAtom } from "jotai";
import { authAtom, adminUids } from "@/store/auth";
import { toast } from "sonner";

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

const Links = ({
  className,
  isAdmin,
}: {
  className?: string;
  isAdmin?: boolean;
}) => {
  const getLinks = useMemo(() => {
    if (isAdmin) return [...links, { label: "Admin", href: "/admin" }];
    return links;
  }, [isAdmin]);

  return (
    <div
      className={clsx(
        "flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-6",
        className
      )}
    >
      {getLinks.map((link) => (
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
};

export const Navbar = ({ fontFamily }: { fontFamily: string }) => {
  const [isOpen, setOpen] = useState(false);
  const [authCache] = useAtom(authAtom);
  const [parent] = useAutoAnimate();

  const handleLogin = async () => {
    signInWithPopup(auth, googleProvider)
      .then((user) => {
        toast.success(`Welcome ${user.user.displayName}!`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.error(errorCode, errorMessage, email, credential);
      });
  };

  const handleLogout = async () => {
    await auth.signOut();
    toast.error("You have been logged out.");
  };

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

          <Links isAdmin={authCache.isAdmin} className="hidden md:block" />
        </div>

        <div
          title="User Profile"
          className="no-highlight flex flex-col p-2 text-black md:mr-4"
        >
          {!authCache.user ? (
            <button type="button" onClick={handleLogin} title="Login">
              <TbUser size={24} className="hidden md:block" />
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="block font-medium">
                {authCache.user?.displayName}
              </span>

              {authCache.user?.photoURL && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={authCache.user.photoURL}
                  alt="User profile picture"
                  width="30"
                  height="30"
                  className="rounded-full"
                  referrerPolicy="no-referrer"
                  draggable="false"
                />
              )}

              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                className="rounded-full bg-black/5 p-2 text-black/70 transition-colors hover:bg-red-600 hover:text-white"
              >
                <TbLogout />
              </button>
            </div>
          )}

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

      {isOpen && (
        <Links isAdmin={adminUids.includes(authCache.user?.uid || "")} />
      )}
    </nav>
  );
};
