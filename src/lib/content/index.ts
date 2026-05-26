import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import {
  aboutSchema,
  blogFrontmatterSchema,
  capabilitySchema,
  contactSchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  toolboxSchema,
  type About,
  type BlogFrontmatter,
  type Capability,
  type Contact,
  type Experience,
  type Profile,
  type Project,
  type ToolboxGroup
} from "@/lib/content/schema";
import { readingTimeFromText } from "@/lib/formatters";

const contentRoot = path.join(process.cwd(), "content");
const blogRoot = path.join(contentRoot, "blog");

function normalizePublicAssetPath(value: string) {
  if (value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `/${value}`;
}

async function readJsonFile<T>(fileName: string) {
  const filePath = path.join(contentRoot, fileName);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export async function getProfile(): Promise<Profile> {
  const profile = profileSchema.parse(await readJsonFile("profile.json"));

  return {
    ...profile,
    resumeHref: normalizePublicAssetPath(profile.resumeHref),
    portrait: normalizePublicAssetPath(profile.portrait),
    brandLogo: normalizePublicAssetPath(profile.brandLogo)
  };
}

export async function getAbout(): Promise<About> {
  const about = aboutSchema.parse(await readJsonFile("about.json"));

  return {
    ...about,
    image: normalizePublicAssetPath(about.image)
  };
}

export async function getCapabilities(): Promise<Capability[]> {
  return capabilitySchema.array().parse(await readJsonFile("capabilities.json"));
}

export async function getExperience(): Promise<Experience[]> {
  const experience = experienceSchema.array().parse(await readJsonFile("experience.json"));

  return experience.map((entry) => ({
    ...entry,
    logo: normalizePublicAssetPath(entry.logo)
  }));
}

export async function getProjects(): Promise<Project[]> {
  return projectSchema.array().parse(await readJsonFile("projects.json"));
}

export async function getToolbox(): Promise<ToolboxGroup[]> {
  return toolboxSchema.array().parse(await readJsonFile("toolbox.json"));
}

export async function getContact(): Promise<Contact> {
  return contactSchema.parse(await readJsonFile("contact.json"));
}

export type BlogPostMeta = BlogFrontmatter & {
  slug: string;
  readingTime: number;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const entries = await fs.readdir(blogRoot);
  const posts = await Promise.all(
    entries
      .filter((entry) => entry.endsWith(".mdx"))
      .map(async (entry) => {
        const filePath = path.join(blogRoot, entry);
        const source = await fs.readFile(filePath, "utf8");
        const { data, content } = matter(source);
        const meta = blogFrontmatterSchema.parse(data);

        return {
          ...meta,
          slug: path.parse(entry).name,
          readingTime: readingTimeFromText(content)
        };
      })
  );

  return posts.sort((left, right) => {
    return new Date(right.date).getTime() - new Date(left.date).getTime();
  });
}

export async function getFeaturedPosts() {
  const posts = await getAllPosts();
  return posts.filter((post) => post.featured).slice(0, 2);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(blogRoot, `${slug}.mdx`);

  try {
    const source = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(source);
    const meta = blogFrontmatterSchema.parse(data);

    return {
      ...meta,
      slug,
      content,
      readingTime: readingTimeFromText(content)
    };
  } catch {
    return null;
  }
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}
