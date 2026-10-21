import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectCollection } from "@/components/projects/ProjectCollection";
import { getSiteOrigin } from "@/lib/site";
import "./projects.css";

const description =
  "From cloud infrastructure challenges to backend systems and AI-powered applications, these are some of the projects I've worked on.";
export const metadata: Metadata = {
  title: "Projects",
  description,
  ...(getSiteOrigin() ? { alternates: { canonical: "/projects" } } : {}),
  openGraph: { title: "Projects | Qurrotul A'ini", description },
};

export default function ProjectsPage() {
  return (
    <div className="project-route">
      <main id="main-content" className="project-route-frame project-collection-page">
        <Link href="/#projects" className="back-link collection-back-link">
          <ArrowLeft size={16} aria-hidden="true" /> Back to selected work
        </Link>
        <header className="collection-header">
          <span className="collection-outline" aria-hidden="true">PROJECTS</span>
          <h1>
            A collection of <em>my work.</em>
          </h1>
          <p>{description}</p>
        </header>
        <ProjectCollection
          items={projects.map((project) => ({
            slug: project.slug,
            category: project.category,
            card: <ProjectCard project={project} heading="h2" variant="selected" />,
          }))}
        />
        <noscript>
          <div className="training">
            <h2>All project case studies</h2>
            <p>
              Browse every project below. Interactive filters require JavaScript.
            </p>
            <ul>
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link className="text-link" href={`/projects/${project.slug}`}>
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </noscript>
      </main>
    </div>
  );
}
