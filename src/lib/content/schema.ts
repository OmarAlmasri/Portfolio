import { z } from "zod";

const socialLinkSchema = z.object({
  label: z.string(),
  href: z.string().url()
});

export const profileSchema = z.object({
  name: z.string(),
  alias: z.string(),
  headline: z.string(),
  subheadline: z.string(),
  availability: z.string(),
  status: z.string(),
  resumeHref: z.string(),
  portrait: z.string(),
  brandLogo: z.string(),
  roles: z.array(z.string()).min(1),
  focusAreas: z.array(z.string()).min(1),
  socials: z.array(socialLinkSchema).min(1)
});

export const aboutSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  summary: z.array(z.string()).min(1),
  principles: z.array(z.string()).min(1),
  image: z.string()
});

export const capabilitySchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  bullets: z.array(z.string()).min(1)
});

export const experienceSchema = z.object({
  slug: z.string(),
  company: z.string(),
  role: z.string(),
  period: z.string(),
  mode: z.string(),
  location: z.string(),
  logo: z.string(),
  summary: z.string(),
  highlights: z.array(z.string()).min(1),
  tooling: z.array(z.string()).min(1)
});

const projectSectionSchema = z.object({
  title: z.string(),
  body: z.array(z.string()).min(1)
});

export const projectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  period: z.string(),
  status: z.string(),
  featured: z.boolean(),
  command: z.string(),
  summary: z.string(),
  stack: z.array(z.string()).min(1),
  outcomes: z.array(z.string()).min(1),
  sections: z.array(projectSectionSchema).min(1)
});

export const toolboxSchema = z.object({
  title: z.string(),
  items: z.array(z.string()).min(1)
});

export const contactSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  summary: z.string(),
  formAction: z.string().url(),
  responseWindow: z.string(),
  channels: z.array(z.string()).min(1)
});

export const blogFrontmatterSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  date: z.string(),
  tags: z.array(z.string()).min(1),
  featured: z.boolean().optional().default(false)
});

export type Profile = z.infer<typeof profileSchema>;
export type About = z.infer<typeof aboutSchema>;
export type Capability = z.infer<typeof capabilitySchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ToolboxGroup = z.infer<typeof toolboxSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;
