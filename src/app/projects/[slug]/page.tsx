import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "@/lib/content";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found"
    };
  }

  return {
    title: project.title,
    description: project.summary
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <section className="section-block project-detail-shell">
      <div className="shell project-detail-grid">
        <aside className="project-sidebar panel">
          <p className="section-eyebrow">case-file // {project.slug}</p>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>

          <div className="detail-meta-list">
            <div>
              <span>category</span>
              <strong>{project.category}</strong>
            </div>
            <div>
              <span>period</span>
              <strong>{project.period}</strong>
            </div>
            <div>
              <span>status</span>
              <strong>{project.status}</strong>
            </div>
          </div>

          <code className="project-command">{project.command}</code>

          <div className="chip-row">
            {project.stack.map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>

          <Link href="/projects" className="text-link">
            Back to project index
          </Link>
        </aside>

        <div className="project-detail-content">
          {project.sections.map((section) => (
            <article key={section.title} className="detail-panel panel">
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}

          <article className="detail-panel panel">
            <h2>Operational outcomes</h2>
            <ul className="detail-list">
              {project.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
