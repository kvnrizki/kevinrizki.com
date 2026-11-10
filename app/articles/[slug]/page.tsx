import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} — Kevin Rizki`,
    description: post.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const paragraphs = post.content.split(/\r?\n\s*\r?\n/).filter(Boolean);

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" aria-label="kevinrizki home" className="wordmark">
            kevinrizki<span className="wordmark-period">.</span>
          </Link>
          <nav aria-label="Main navigation" className="main-nav">
            <Link href="/#articles">Writing</Link>
            <a href="mailto:hello@kevinrizki.com">
              Say hello <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      </header>

      <main className="article-page">
        <Link className="article-back" href="/#articles">
          <span aria-hidden="true">←</span> Back to writing
        </Link>

        <article>
          <header className="article-header">
            <div className="post-meta">
              <span>{post.category}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.dateTime}>{post.date}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime} min read</span>
            </div>
            <h1>{post.title}</h1>
            <p className="article-lede">{post.excerpt}</p>
          </header>

          <div className="article-body">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}
