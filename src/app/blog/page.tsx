import type { Metadata } from "next";
import { BlogWorkbench } from "@/components/blog-workbench";
import { PageHero } from "@/components/page-hero";
import { getAllPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Field notes, methodology, and security writing."
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const uniqueTags = new Set(posts.flatMap((post) => post.tags));

  return (
    <>
      <PageHero
        eyebrow="writing-index"
        title="Field notes on offensive security, reporting, and workflow."
        summary="The blog is powered by local MDX files, so writing a new post is just a matter of adding a file under content/blog."
        stats={[
          { label: "published notes", value: String(posts.length).padStart(2, "0") },
          { label: "tags", value: String(uniqueTags.size).padStart(2, "0") },
          {
            label: "featured posts",
            value: String(posts.filter((post) => post.featured).length).padStart(2, "0")
          }
        ]}
      />

      <section className="section-block">
        <div className="shell">
          <BlogWorkbench posts={posts} />
        </div>
      </section>
    </>
  );
}
