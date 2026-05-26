import type { MetadataRoute } from "next";
import { getAllPosts, getProjects } from "@/lib/content";
import { toAbsoluteSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getAllPosts()]);

  return [
    { url: toAbsoluteSiteUrl("/") },
    { url: toAbsoluteSiteUrl("/projects/") },
    { url: toAbsoluteSiteUrl("/blog/") },
    ...projects.map((project) => ({
      url: toAbsoluteSiteUrl(`/projects/${project.slug}/`)
    })),
    ...posts.map((post) => ({
      url: toAbsoluteSiteUrl(`/blog/${post.slug}/`)
    }))
  ];
}
