import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ProjectWorkbench } from "@/components/project-workbench";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Project archive and case files."
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        eyebrow="project-index"
        title="Case files, tooling concepts, and operating patterns."
        summary=""
        stats={[
          { label: "total projects", value: String(projects.length).padStart(2, "0") },
          {
            label: "featured entries",
            value: String(projects.filter((project) => project.featured).length).padStart(2, "0")
          },
          {
            label: "categories",
            value: String(new Set(projects.map((project) => project.category)).size).padStart(2, "0")
          }
        ]}
      />

      <section className="section-block">
        <div className="shell">
          <ProjectWorkbench projects={projects} />
        </div>
      </section>
    </>
  );
}
