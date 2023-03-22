import { motion } from "framer-motion";
import { ReactNode } from "react";

export const MotionFade = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
