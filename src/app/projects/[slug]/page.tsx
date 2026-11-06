import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects, getProject } from "@/data/projects";
import { getSiteOrigin } from "@/lib/site";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectMetadata } from "@/components/projects/ProjectMetadata";
import { ProjectNavigation } from "@/components/projects/ProjectNavigation";
import { ProjectStory } from "@/components/projects/ProjectStory";
import { MobileShowcase } from "@/components/projects/MobileShowcase";
import "../projects.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.shortDescription,
    ...(getSiteOrigin()
      ? { alternates: { canonical: `/projects/${project.slug}` } }
      : {}),
    openGraph: {
      title: `${project.title} | Qurrotul A'ini`,
      description: project.shortDescription,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.shortDescription,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const media = [
    ...(project.coverImage ? [project.coverImage] : []),
    ...(project.gallery ?? []),
  ].filter((item, index, items) => items.findIndex(({ src }) => src === item.src) === index);
  return (
    <div className="project-route project-route--detail">
      <main id="main-content" className="project-route-frame project-detail-page">
        <Link href="/projects" className="back-link">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to Projects
        </Link>
        {project.mobileShowcase ? (
          <div id="gallery" className="case-mobile-showcase">
            <MobileShowcase showcase={project.mobileShowcase} title={project.title} />
          </div>
        ) : (
          <>
            <header className="page-header case-header">
              <p className="eyebrow">
                {project.category} / {project.year}
              </p>
              <h1>{project.title}</h1>
              {project.subtitle && (
                <p className="case-subtitle">{project.subtitle}</p>
              )}
              <p className="page-intro">{project.shortDescription}</p>
            </header>
            <div className="case-media" id="gallery">
              <ProjectGallery key={project.slug} title={project.title} category={project.category} media={media} variant="hero" />
            </div>
          </>
        )}
        <div className="case-study-layout">
          <aside className="case-sidebar" aria-label="Project information">
            <ProjectMetadata project={project} />
            {(project.repositoryUrl || project.liveUrl) && (
              <div className="project-external-links">
                {project.repositoryUrl && (
                  <a
                    href={project.repositoryUrl}
                    className="text-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Repository <ArrowUpRight size={16} />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    className="text-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.slug === "sidika-admin"
                      ? "Public Storefront · Business Context"
                      : "Visit Website"}{" "}
                    <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            )}
          </aside>
          <ProjectStory project={project} />
        </div>
        <ProjectNavigation project={project} />
      </main>
    </div>
  );
}
