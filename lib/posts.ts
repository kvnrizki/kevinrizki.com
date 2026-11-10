import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  dateTime: string;
  readingTime: number;
};

export type Article = Post & {
  content: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePost(fileName: string, source: string): Post {
  const { data } = matter(source);

  if (
    !isRecord(data) ||
    typeof data.title !== "string" ||
    typeof data.excerpt !== "string" ||
    typeof data.category !== "string" ||
    typeof data.date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
    typeof data.readingTime !== "number" ||
    !Number.isInteger(data.readingTime) ||
    data.readingTime < 1
  ) {
    throw new Error(`Invalid post metadata in content/posts/${fileName}`);
  }

  const date = new Date(`${data.date}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid publication date in content/posts/${fileName}`);
  }

  return {
    slug: path.basename(fileName, ".md"),
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    date: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).format(date),
    dateTime: data.date,
    readingTime: data.readingTime,
  };
}

export async function getPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), "content", "posts");
  const fileNames = (await readdir(postsDirectory)).filter((fileName) =>
    fileName.endsWith(".md"),
  );

  if (fileNames.length === 0) {
    throw new Error("No Markdown posts found in content/posts");
  }

  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const source = await readFile(path.join(postsDirectory, fileName), "utf8");
      return parsePost(fileName, source);
    }),
  );

  return posts.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
}

export async function getPostBySlug(slug: string): Promise<Article | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return null;
  }

  const fileName = `${slug}.md`;
  const filePath = path.join(process.cwd(), "content", "posts", fileName);
  let source: string;

  try {
    source = await readFile(filePath, "utf8");
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }

  return {
    ...parsePost(fileName, source),
    content: matter(source).content.trim(),
  };
}
