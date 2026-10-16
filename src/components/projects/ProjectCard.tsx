import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/project";
import { MediaPlaceholder } from "./MediaPlaceholder";

export function ProjectCard({
  project,
  heading = "h3",
}: {
  project: Project;
  heading?: "h2" | "h3";
}) {
  const Heading = heading;
  return (
    <article className="project-card" data-project={project.slug}>
      <Link
        href={`/projects/${project.slug}`}
        aria-labelledby={`title-${project.slug}`}
      >
        <div className="project-visual">
          {project.coverImage ? (
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
            <ArrowUpRight
              className="project-arrow"
              size={24}
              strokeWidth={1.4}
              aria-hidden="true"
            />
          </div>
          <p className="project-summary">{project.shortDescription}</p>
          <div className="project-tags">
            {project.technologies.slice(0, 4).map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
