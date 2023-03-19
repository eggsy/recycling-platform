import { readdirSync, readFileSync } from "fs";
import { useRouter } from "next/router";
import { join } from "path";
import { TbChevronLeft } from "react-icons/tb";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

// Components
import { PeopleCard } from "@/components/PeopleCard";

const postsDirectory = join(process.cwd(), "src/posts");

export async function getStaticPaths() {
  const files = readdirSync(postsDirectory);

  return {
    paths: files.map((file) => `/${file.replace(/\.mdx?$/, "")}`),
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const fileContents = readFileSync(
    join(postsDirectory, `${params.slug}.mdx`),
    "utf8"
  );

  const mdxSource = await serialize(fileContents, {
    parseFrontmatter: true,
  });

  return {
    props: {
      source: mdxSource,
    },
  };
}

export default function Post(props: any) {
  const router = useRouter();

  return (
    <div className="rounded-lg bg-white/70 backdrop-blur-md md:h-[80vh] md:max-h-[1000px]">
      <header className="flex items-center gap-3 rounded-t-lg bg-white px-6 py-3">
        <TbChevronLeft
          size={24}
          className="cursor-pointer rounded-full bg-black/10 p-1 text-black/90 transition-colors hover:bg-black hover:text-white"
          onClick={() => router.back()}
        />

        <h1 className="font-medium">{props.source.frontmatter.title}</h1>
      </header>

      <main className="prose w-full max-w-full p-6 marker:text-green-600">
        <MDXRemote {...props.source} components={{ PeopleCard }} />
      </main>
    </div>
  );
}
