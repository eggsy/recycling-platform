import { readdirSync, readFileSync } from "fs";
import { useRouter } from "next/router";
import { join } from "path";
import { TbChevronLeft } from "react-icons/tb";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

// Components
import { PeopleCard } from "@/components/PeopleCard";
import { Layout } from "@/components/Layout";

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
  return (
    <Layout
      title={props.source.frontmatter.title}
      mainClass="prose max-w-full marker:text-green-600"
    >
      <MDXRemote {...props.source} components={{ PeopleCard }} />
    </Layout>
  );
}
