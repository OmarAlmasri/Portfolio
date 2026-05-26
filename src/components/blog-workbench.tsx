"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useState } from "react";
import type { BlogPostMeta } from "@/lib/content";
import { formatDisplayDate } from "@/lib/formatters";

type BlogWorkbenchProps = {
  posts: BlogPostMeta[];
};

export function BlogWorkbench({ posts }: BlogWorkbenchProps) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");
  const deferredQuery = useDeferredValue(query);

  const tags = ["All", ...new Set(posts.flatMap((post) => post.tags))];
  const filteredPosts = posts.filter((post) => {
    const searchable = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
    const matchesQuery = searchable.includes(deferredQuery.trim().toLowerCase());
    const matchesTag = tag === "All" || post.tags.includes(tag);

    return matchesQuery && matchesTag;
  });

  return (
    <div className="workbench">
      <div className="workbench-toolbar panel">
        <label className="search-field">
          <span>grep</span>
          <input
            type="search"
            value={query}
            placeholder="search titles, excerpts, tags"
            onChange={(event) => {
              const value = event.target.value;
              startTransition(() => setQuery(value));
            }}
          />
        </label>

        <div className="filter-row">
          {tags.map((entry) => (
            <button
              key={entry}
              type="button"
              className={entry === tag ? "is-active" : undefined}
              onClick={() => {
                startTransition(() => setTag(entry));
              }}
            >
              {entry}
            </button>
          ))}
        </div>
      </div>

      <div className="card-grid blog-grid">
        {filteredPosts.map((post) => (
          <article key={post.slug} className="blog-card panel">
            <div className="blog-card-meta">
              <span>{formatDisplayDate(post.date)}</span>
              <span>{post.readingTime} min read</span>
            </div>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <div className="chip-row">
              {post.tags.map((entry) => (
                <span key={entry} className="chip">
                  {entry}
                </span>
              ))}
            </div>
            <Link href={`/blog/${post.slug}`} className="text-link">
              Read note
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
