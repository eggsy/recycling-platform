import Image from "next/image";

export const PeopleCard = ({
  image,
  name,
  linkedIn,
}: {
  image: string;
  name: string;
  linkedIn: string;
}) => {
  return (
    <a
      href={`https://linkedin.com/in/${linkedIn}`}
      target="_blank"
      rel="noopener noreferrer"
      title="Open LinkedIn profile"
      className="inline-flex h-10 m-px items-center rounded-lg bg-black/10 px-3 py-1 align-middle text-sm font-medium no-underline transition-colors hover:bg-black/20"
    >
      <Image
        src={image}
        alt="Person image"
        width={30}
        height={30}
        className="mr-2 rounded-full"
      />
      {name}
    </a>
  );
};
