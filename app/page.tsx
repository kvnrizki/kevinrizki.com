import Link from "next/link";
import { getPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getPosts();
  const [featuredPost, ...recentPosts] = posts;

  if (!featuredPost) {
    throw new Error("The homepage requires at least one published post");
  }

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" aria-label="kevinrizki home" className="wordmark">
            kevinrizki<span className="wordmark-period">.</span>
          </Link>

          <nav aria-label="Main navigation" className="main-nav">
            <a href="#articles">Writing</a>
            <a href="mailto:hello@kevinrizki.com">Say hello <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
      </header>

      <main className="home-content">
        <section className="intro" aria-labelledby="intro-title">
          <p className="eyebrow"><span className="status-dot" /> Independent notes on building well</p>
          <h1 id="intro-title">
            Make room for
            <br />
            <span>better questions.</span>
          </h1>
          <p className="intro-copy">
            Thoughts on product, technology, and the small habits that make meaningful work possible.
          </p>
        </section>

        <section className="featured-section" aria-labelledby="featured-heading">
          <div className="section-heading">
            <h2 id="featured-heading">Start here</h2>
            <span className="section-index">01 / FEATURED</span>
          </div>

          <article className="featured-card">
            <div className="featured-art" aria-hidden="true">
              <span className="art-orbit art-orbit-one" />
              <span className="art-orbit art-orbit-two" />
              <span className="art-center">01</span>
              <span className="art-caption">A practice in paying attention</span>
            </div>
            <div className="featured-copy">
              <div className="post-meta">
                <span>{featuredPost.category}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={featuredPost.dateTime}>{featuredPost.date}</time>
                <span aria-hidden="true">·</span>
                <span>{featuredPost.readingTime} min read</span>
              </div>
              <h3>
                <Link href={`/articles/${featuredPost.slug}`}>{featuredPost.title}</Link>
              </h3>
              <p>{featuredPost.excerpt}</p>
              <Link className="read-link" href={`/articles/${featuredPost.slug}`}>
                Read article <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        </section>

        <section id="articles" className="articles-section" aria-labelledby="articles-heading">
          <div className="section-heading">
            <h2 id="articles-heading">The notebook</h2>
            <span className="section-index">MORE IDEAS, AT YOUR PACE</span>
          </div>

          <div className="article-list">
            {recentPosts.map((post, index) => (
              <article className="article-row" key={post.slug}>
                <span className="article-number">{String(index + 2).padStart(2, "0")}</span>
                <div className="article-content">
                  <div className="post-meta">
                    <span>{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={post.dateTime}>{post.date}</time>
                  </div>
                  <h3>
                    <Link href={`/articles/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p>{post.excerpt}</p>
                </div>
                <span className="article-reading-time">{post.readingTime} min</span>
              </article>
            ))}
          </div>
        </section>

        <footer className="site-footer">
          <span>Written slowly, shared openly.</span>
          <span>© {new Date().getFullYear()} Kevin Rizki</span>
        </footer>
      </main>
    </>
  );
}
