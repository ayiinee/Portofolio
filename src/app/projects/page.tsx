import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectCollection } from "@/components/projects/ProjectCollection";
import { getSiteOrigin } from "@/lib/site";

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
    <main id="main-content" className="section page-section">
      <header className="page-header">
        <p className="eyebrow">
          THE PROJECT COLLECTION / {projects.length.toString().padStart(2, "0")}
        </p>
        <h1>
          A collection of <em>my work.</em>
        </h1>
        <p className="page-intro">{description}</p>
      </header>
      <ProjectCollection
        items={projects.map((project) => ({
          slug: project.slug,
          category: project.category,
          card: <ProjectCard project={project} heading="h2" />,
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
  );
}
