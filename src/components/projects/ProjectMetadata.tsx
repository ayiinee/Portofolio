import type { Project } from "@/types/project";

export function ProjectMetadata({ project }: { project: Project }) {
  return (
    <dl className="project-metadata">
      <div>
        <dt>Year</dt>
        <dd>{project.year}</dd>
      </div>
      <div>
        <dt>Project type</dt>
        <dd>{project.type}</dd>
      </div>
      <div>
        <dt>My role</dt>
        <dd>{project.role}</dd>
      </div>
      <div>
        <dt>Technologies</dt>
        <dd>{project.technologies.join(" · ")}</dd>
      </div>
    </dl>
  );
}
