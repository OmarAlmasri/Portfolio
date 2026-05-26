import type { MetadataRoute } from "next";
import { getAllPosts, getProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getAllPosts()]);

  return [
    { url: "/" },
    { url: "/projects" },
    { url: "/blog" },
    ...projects.map((project) => ({ url: `/projects/${project.slug}` })),
    ...posts.map((post) => ({ url: `/blog/${post.slug}` }))
  ];
}
