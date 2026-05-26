"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useState } from "react";
import type { Project } from "@/lib/content/schema";

type ProjectWorkbenchProps = {
  projects: Project[];
};

export function ProjectWorkbench({ projects }: ProjectWorkbenchProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const deferredQuery = useDeferredValue(query);

  const categories = ["All", ...new Set(projects.map((project) => project.category))];
  const filteredProjects = projects.filter((project) => {
    const searchable = `${project.title} ${project.summary} ${project.command} ${project.stack.join(" ")}`.toLowerCase();
    const matchesQuery = searchable.includes(deferredQuery.trim().toLowerCase());
    const matchesCategory = category === "All" || project.category === category;

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="workbench">
      <div className="workbench-toolbar panel">
        <label className="search-field">
          <span>search</span>
          <input
            type="search"
            value={query}
            placeholder="query projects, tools, commands"
            onChange={(event) => {
              const value = event.target.value;
              startTransition(() => setQuery(value));
            }}
          />
        </label>

        <div className="filter-row">
          {categories.map((entry) => (
            <button
              key={entry}
              type="button"
              className={entry === category ? "is-active" : undefined}
              onClick={() => {
                startTransition(() => setCategory(entry));
              }}
            >
              {entry}
            </button>
          ))}
        </div>
      </div>

      <div className="card-grid project-grid">
        {filteredProjects.map((project) => (
          <article key={project.slug} className="project-card panel">
            <div className="project-card-topline">
              <span className="status-pill">{project.category}</span>
              <span className="status-meta">{project.status}</span>
            </div>

            <code className="project-command">{project.command}</code>
            <h2>{project.title}</h2>
            <p>{project.summary}</p>

            <div className="chip-row">
              {project.stack.map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>

            <Link href={`/projects/${project.slug}`} className="text-link">
              Open case file
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
