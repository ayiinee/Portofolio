"use client";

import { useState, type ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import { projectCategories, type ProjectCategory } from "@/types/project";

type Filter = ProjectCategory | "All";
type CollectionItem = {
  slug: string;
  category: ProjectCategory;
  card: ReactNode;
};

export function ProjectCollection({ items }: { items: CollectionItem[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [limit, setLimit] = useState(6);
  const matching = items.filter(
    (item) => filter === "All" || item.category === filter,
  );
  return (
    <>
      <div
        className="project-filters"
        role="group"
        aria-label="Filter projects"
      >
        {(["All", ...projectCategories] as const).map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={category === filter}
            aria-controls="project-results"
            className={`filter-button ${category === filter ? "is-active" : ""}`}
            onClick={() => {
              setFilter(category);
              setLimit(6);
            }}
          >
            {category}
            <span>
              {category === "All"
                ? items.length
                : items.filter((item) => item.category === category).length}
            </span>
          </button>
        ))}
      </div>
      <p className="project-count" role="status" aria-live="polite">
        Showing {Math.min(limit, matching.length)} of {matching.length} projects
        {filter !== "All" ? ` in ${filter}` : ""}
      </p>
      <div id="project-results" className="projects-grid">
        {matching.slice(0, limit).map((item) => (
          <div key={item.slug}>{item.card}</div>
        ))}
      </div>
      {limit < matching.length && (
        <div className="section-action">
          <button
            type="button"
            className="button button-secondary"
            aria-controls="project-results"
            onClick={() => setLimit((count) => count + 6)}
          >
            Load More <ArrowDown size={16} />
          </button>
        </div>
      )}
    </>
  );
}
