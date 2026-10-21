import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { featuredProjects } from "@/data/projects";

export function Projects() {
  return (
    <section
      id="projects"
      className="selected-projects"
      aria-labelledby="projects-heading"
    >
      <div className="selected-projects-frame">
        <Reveal>
          <div className="projects-heading-row">
            <div className="selected-projects-heading">
              <span className="selected-projects-outline" aria-hidden="true">PROJECTS</span>
              <h2 id="projects-heading">Things I’ve <em>built &amp; contributed to.</em></h2>
            </div>
            <p>
              A collection of engineering projects, technical challenges, and
              ideas I’ve had the opportunity to work on.
            </p>
          </div>
        </Reveal>
        <div className="projects-grid">
          {featuredProjects.slice(0, 4).map((project, index) => (
            <Reveal key={project.slug} delay={(index % 2) * 0.08}>
              <ProjectCard project={project} variant="selected" />
            </Reveal>
          ))}
        </div>
        <div className="section-action">
          <Link className="selected-projects-all" href="/projects">
            Explore All Projects <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
