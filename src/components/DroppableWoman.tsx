import Image from "next/image";
import { useDroppable } from "@dnd-kit/core";

export const DroppableWoman = () => {
  const { setNodeRef, isOver } = useDroppable({
    id: "woman",
  });

  return (
    <div
      ref={setNodeRef}
      className="fixed select-none right-0 -bottom-4 -z-10 transition-transform md:z-10"
      style={{
        transform: `${isOver ? "scale(1.1) rotate(10deg)" : "none"}`,
      }}
    >
      <Image
        priority
        src="/woman.png"
        width="150"
        height="150"
        alt="Woman planting something"
        draggable="false"
        style={{
          width: "auto",
          height: "auto",
        }}
      />
    </div>
  );
};
