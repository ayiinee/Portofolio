import type { ReactNode } from "react";
import type { Project } from "@/types/project";
import { ProjectGallery } from "./ProjectGallery";

type StorySection = {
  id: string;
  title: string;
  content: ReactNode;
  className?: string;
};

export function ProjectStory({ project }: { project: Project }) {
  const sections: StorySection[] = [{
    id: "overview",
    title: "Overview",
    content: project.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>),
  }];

  if (project.challenge) sections.push({
    id: "challenge",
    title: "The challenge",
    content: <p>{project.challenge}</p>,
  });

  if (project.personalContributions?.length || project.contributionStatement) {
    sections.push({
      id: "contribution",
      title: "What I did",
      content: <>
        {project.contributionStatement && <p>{project.contributionStatement}</p>}
        {!!project.personalContributions?.length && (
          <ol className="case-contributions">
            {project.personalContributions.map((point, index) => (
              <li key={point}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <p>{point}</p>
              </li>
            ))}
          </ol>
        )}
      </>,
    });
  }

  if (project.engineeringHighlights?.length) sections.push({
    id: "technical",
    title: "Engineering highlights",
    content: <ul>{project.engineeringHighlights.map((point) => <li key={point}>{point}</li>)}</ul>,
  });

  if (project.architecture) sections.push({
    id: "architecture",
    title: "Architecture",
    className: "architecture-section",
    content: <>
      <p>{project.architecture.description}</p>
      <ProjectGallery title={`${project.title} architecture`} media={[project.architecture.media]} />
    </>,
  });

  if (project.impact?.length || project.achievements?.length) sections.push({
    id: "impact",
    title: "Impact & achievements",
    className: "impact-section",
    content: <div className="case-outcomes">
      {!!project.impact?.length && (
        <div className="case-outcome-group">
          <h3>Project outcomes</h3>
          <ul>{project.impact.map((point) => <li key={point}>{point}</li>)}</ul>
        </div>
      )}
      {!!project.achievements?.length && (
        <div className="case-outcome-group">
          <h3>Milestones & recognition</h3>
          <ul>{project.achievements.map((point) => <li key={point}>{point}</li>)}</ul>
        </div>
      )}
    </div>,
  });

  if (project.status || project.limitations?.length) sections.push({
    id: "status",
    title: "Project context & limitations",
    className: "status-section",
    content: <>
      {project.status && <p className="status-label">{project.status}</p>}
      {project.limitations?.map((point) => <p key={point}>{point}</p>)}
    </>,
  });

  return <div className="case-study-content">
    {sections.map((section, index) => (
      <section
        key={section.id}
        id={section.id}
        className={`case-section ${section.className ?? ""}`}
        aria-labelledby={`${section.id}-heading`}
      >
        <div className="case-section-heading">
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <h2 id={`${section.id}-heading`}>{section.title}</h2>
        </div>
        <div className="case-section-content">{section.content}</div>
      </section>
    ))}
  </div>;
}
