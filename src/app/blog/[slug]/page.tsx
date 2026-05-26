import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx-components";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { formatDisplayDate } from "@/lib/formatters";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found"
    };
  }

  return {
    title: post.title,
    description: post.excerpt
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm]
      }
    }
  });

  return (
    <section className="section-block article-shell">
      <div className="shell article-grid">
        <aside className="article-sidebar panel">
          <p className="section-eyebrow">note // {post.slug}</p>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>

          <div className="detail-meta-list">
            <div>
              <span>published</span>
              <strong>{formatDisplayDate(post.date)}</strong>
            </div>
            <div>
              <span>read time</span>
              <strong>{post.readingTime} min</strong>
            </div>
          </div>

          <div className="chip-row">
            {post.tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>

          <Link href="/blog" className="text-link">
            Back to blog index
          </Link>
        </aside>

        <article className="article-content panel prose-shell">{content}</article>
      </div>
    </section>
  );
}
