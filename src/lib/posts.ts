import { remark } from "remark";
import html from "remark-html";
import { join } from "path";
import { readFileSync } from "fs";
import matter from "gray-matter";

export interface IPostData {
  slug: string;
  title: string;
  contentHtml: string;
}

const postsDirectory = join(process.cwd(), "src/posts");

export async function getPostData(slug: string) {
  const fullPath = join(postsDirectory, `${slug}.md`);
  const fileContents = readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...matterResult.data,
  } as IPostData;
}
