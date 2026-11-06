import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/project";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { ShowcaseCover } from "./ShowcaseVisual";

export function ProjectCard({
  project,
  heading = "h3",
  variant = "default",
}: {
  project: Project;
  heading?: "h2" | "h3";
  variant?: "default" | "selected";
}) {
  const Heading = heading;
  const tags = (
    <div className="project-tags">
      {project.technologies.slice(0, variant === "selected" ? 3 : 4).map((technology) => (
        <span key={technology}>{technology}</span>
      ))}
    </div>
  );
  return (
    <article className="project-card" data-project={project.slug}>
      <Link
        href={`/projects/${project.slug}`}
        aria-labelledby={`title-${project.slug}`}
      >
        <div className="project-visual">
          {project.mobileShowcase ? (
            <ShowcaseCover showcase={project.mobileShowcase} title={project.title} />
          ) : project.coverImage ? (
            <Image
              src={project.coverImage.src}
              alt={project.coverImage.alt}
              width={project.coverImage.width}
              height={project.coverImage.height}
              sizes="(max-width: 700px) 100vw, 50vw"
              className={`project-image ${project.coverImage.type === "diagram" ? "media-contain" : ""}`}
            />
          ) : (
            <MediaPlaceholder
              title={project.title}
              category={project.category}
              showFullTitle={variant === "selected"}
            />
          )}
        </div>
        <div className="project-info">
          <p className="project-meta">
            <span>{project.category}</span>
            <time dateTime={String(project.year)}>{project.year}</time>
          </p>
          <div className="project-title-row">
            <Heading id={`title-${project.slug}`}>{project.title}</Heading>
            {variant !== "selected" && (
              <ArrowUpRight className="project-arrow" size={24} strokeWidth={1.4} aria-hidden="true" />
            )}
          </div>
          <p className="project-summary">{variant === "selected" ? project.cardSummary ?? project.shortDescription : project.shortDescription}</p>
          {variant === "selected" ? (
            <div className="selected-project-footer">
              {tags}
              <span className="selected-project-detail">
                View details <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </div>
          ) : tags}
        </div>
      </Link>
    </article>
  );
}
