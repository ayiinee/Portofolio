import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/types/project";
import { getProject } from "@/data/projects";

export function ProjectNavigation({ project }: { project: Project }) {
  const previous = project.previousProject
    ? getProject(project.previousProject)
    : undefined;
  const next = project.nextProject
    ? getProject(project.nextProject)
    : undefined;
  return (
    <nav className="project-navigation" aria-label="Adjacent projects">
      {previous ? (
        <Link href={`/projects/${previous.slug}`}>
          <span>
            <ArrowLeft size={15} /> Previous project
          </span>
          <strong>{previous.title}</strong>
        </Link>
      ) : (
        <Link href="/projects">
          <span>
            <ArrowLeft size={15} /> Back to collection
          </span>
          <strong>Explore all projects</strong>
        </Link>
      )}
      {next ? (
        <Link href={`/projects/${next.slug}`}>
          <span>
            Next project <ArrowRight size={15} />
          </span>
          <strong>{next.title}</strong>
        </Link>
      ) : (
        <Link href="/projects">
          <span>
            Back to collection <ArrowRight size={15} />
          </span>
          <strong>Explore all projects</strong>
        </Link>
      )}
    </nav>
  );
}
