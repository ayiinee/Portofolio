import type { Project } from "@/types/project";

export function ProjectMetadata({ project }: { project: Project }) {
  return (
    <dl className="project-metadata">
      <div>
        <dt>My role</dt>
        <dd>{project.role}</dd>
      </div>
      <div>
        <dt>Year</dt>
        <dd>{project.year}</dd>
      </div>
      {project.timeline && (
        <div>
          <dt>Timeline</dt>
          <dd>{project.timeline}</dd>
        </div>
      )}
      <div>
        <dt>Project type</dt>
        <dd>{project.type}</dd>
      </div>
      <div>
        <dt>Tech stack</dt>
        <dd>
          <ul className="case-tech-stack" aria-label="Technologies">
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </dd>
      </div>
    </dl>
  );
}
