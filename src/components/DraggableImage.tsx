import { useDraggable } from "@dnd-kit/core";
import Image from "next/image";

export const DraggableImage = ({ image }: { image: string }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`,
      }
    : undefined;

  return (
    <div>
      <Image
        ref={setNodeRef}
        src={image}
        alt="Image"
        width={250}
        height={250}
        className="my:mb-0 my-0 mb-6 flex-shrink-0 rounded-lg object-cover ring-1 ring-black/10 md:float-right"
        draggable="false"
        style={{
          height: 250,
          width: 250,
          ...style,
        }}
        {...listeners}
        {...attributes}
      />
    </div>
  );
};
