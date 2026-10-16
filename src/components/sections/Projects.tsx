"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projectFilters, projects } from "@/data/projects";
import { cn } from "@/lib/utils";

export function Projects() {
  const [filter, setFilter] =
    useState<(typeof projectFilters)[number]>("All work");
  const visibleProjects = projects.filter(
    (project) => filter === "All work" || project.category === filter,
  );

  return (
    <section
      id="projects"
      className="section projects-section"
      aria-labelledby="projects-heading"
    >
      <Reveal>
        <div className="projects-heading-row">
          <SectionHeading
            number="03"
            label="SELECTED WORK & EXPLORATIONS"
            title="A few things"
            accent="taking shape."
            id="projects-heading"
          />
          <p>
            Ideas, experiments, and small steps forward.
            <br />A collection that grows with me.
          </p>
        </div>
      </Reveal>
      <div
        className="project-filters"
        role="group"
        aria-label="Filter projects"
      >
        {projectFilters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={cn("filter-button", filter === item && "is-active")}
            aria-pressed={filter === item}
          >
            {item}
            {item === "All work" && (
              <span>{projects.length.toString().padStart(2, "0")}</span>
            )}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {visibleProjects.length}{" "}
        {visibleProjects.length === 1 ? "project" : "projects"} shown
      </p>
      <div className="projects-grid">
        {visibleProjects.map((project, index) => (
          <Reveal
            key={project.id}
            delay={index * 0.08}
            className="project-card"
          >
            <article>
              <div
                className={cn(
                  "project-visual",
                  project.id === "notes-studio" && "project-visual-lavender",
                )}
              >
                <span className="project-kind">{project.kind}</span>
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  width={800}
                  height={580}
                  unoptimized
                  className="project-image"
                />
                <span className="project-number" aria-hidden="true">
                  0{projects.indexOf(project) + 1} /
                </span>
              </div>
              <div className="project-info">
                <p className="project-subtitle">{project.subtitle}</p>
                <h3>{project.title}</h3>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <details className="project-details">
                  <summary>
                    Behind the project <ChevronDown size={16} />
                  </summary>
                  <div className="project-details-body">
                    <p>{project.description}</p>
                    <p>{project.approach}</p>
                    {project.href && (
                      <a className="text-link" href={project.href}>
                        Visit this project <ArrowUpRight size={15} />
                      </a>
                    )}
                  </div>
                </details>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="projects-footnote">
        A small collection, with more good things on the way.
        <span aria-hidden="true">✳</span>
      </p>
    </section>
  );
}
