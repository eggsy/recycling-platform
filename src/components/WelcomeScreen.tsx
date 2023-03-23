import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

// Components
import { MotionFade } from "@/components/MotionFade";

export const WelcomeScreen = ({
  isFetchingData,
}: {
  isFetchingData: boolean;
}) => {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const storage = localStorage.getItem("welcome-screen-dismised");
    if (!storage) setVisible(true);
  }, []);

  const handleClose = () => {
    localStorage.setItem("welcome-screen-dismised", "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {!isFetchingData && isVisible && (
        <MotionFade className="fixed inset-0 z-20 grid place-content-center bg-black/70">
          <div className="keep-scrolling mx-2 max-w-full rounded-lg bg-white md:m-0 md:mx-auto md:w-5/6">
            <header className="border-b border-black/10 p-4 text-xl font-bold">
              <h2>Welcome 👋</h2>
            </header>

            <div className="prose prose-blue max-h-[80vh] overflow-y-auto p-4 prose-a:no-underline">
              <p>
                Hey visitor! Thank you for checking our app out, it is still
                work in progress but you can see our vision by checking things
                out.
              </p>

              <p>
                We want to build a platform to help people realise what their
                everyday items do to our environment, simply, elegantly and
                accesible. You can watch our trailer here:
              </p>

              <a
                href="https://youtu.be/tBjP00O3QrU"
                title="Watch our trailer on YouTube"
                rel="noreferrer noopener"
                target="_blank"
              >
                <Image
                  priority
                  src="/banner.png"
                  alt="Trailer thumbnail"
                  width={640}
                  height={250}
                  className="rounded-lg object-cover"
                  style={{
                    width: 640,
                    height: 250,
                  }}
                />
              </a>

              <p>
                Check out the about page for more information and look for a
                hidden game 👀 on the website! Check out the{" "}
                <a href="https://github.com/eggsy/recycling-platform">
                  GitHub repository
                </a>{" "}
                if you have any issues.
              </p>
            </div>

            <footer className="border-t border-black/10 p-4">
              <button
                type="button"
                title="Close window"
                aria-label="Welcome screen close button"
                className="rounded-lg bg-red-600/10 px-5 py-1 text-red-600 transition-colors hover:bg-red-600/20"
                onClick={handleClose}
              >
                Close
              </button>
            </footer>
          </div>
        </MotionFade>
      )}
    </AnimatePresence>
  );
};
