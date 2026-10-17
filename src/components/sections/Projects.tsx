import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { featuredProjects } from "@/data/projects";

export function Projects() {
  return (
    <section
      id="projects"
      className="section"
      aria-labelledby="projects-heading"
    >
      <Reveal>
        <div className="projects-heading-row">
          <SectionHeading
            number="03"
            label="SELECTED WORK"
            title="Things I’ve"
            accent="built & contributed to."
            id="projects-heading"
          />
          <p>
            A collection of engineering projects, technical challenges, and
            ideas I’ve had the opportunity to work on.
          </p>
        </div>
      </Reveal>
      <div className="projects-grid">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      <div className="section-action">
        <Link className="button button-secondary" href="/projects">
          Explore All Projects
        </Link>
      </div>
    </section>
  );
}
