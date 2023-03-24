import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

// Components
import { PeopleCard } from "@/components/PeopleCard";
import { Layout } from "@/components/Layout";
import Image from "next/image";

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
      mainClass="prose prose-hr:border-black/10 prose-hr:border-dashed max-w-full prose-ol:font-medium prose-ol:text-brand marker:text-brand"
    >
      <MDXRemote {...props.source} components={{ PeopleCard, TargetedGoals }} />
    </Layout>
  );
}

const TargetedGoals = () => (
  <div className="flex flex-wrap gap-4">
    {[
      "https://i.imgur.com/tq5Kl40.jpg",
      "https://i.imgur.com/z297DNB.jpg",
      "https://i.imgur.com/jZlV2SG.jpg",
      "https://i.imgur.com/0MknMaW.jpg",
      "https://i.imgur.com/zIlnkK5.jpg",
      "https://i.imgur.com/OAIrcoR.jpg",
    ].map((image) => (
      <Image
        key={image}
        src={image}
        width="150"
        height="150"
        alt="Targeted Goal"
        draggable="false"
        style={{
          width: 150,
          height: 150,
        }}
      />
    ))}
  </div>
);
