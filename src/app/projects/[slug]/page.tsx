import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects, getProject } from "@/data/projects";
import { getSiteOrigin } from "@/lib/site";
import { MediaPlaceholder } from "@/components/projects/MediaPlaceholder";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectMetadata } from "@/components/projects/ProjectMetadata";
import { ProjectNavigation } from "@/components/projects/ProjectNavigation";

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
  return (
    <main id="main-content" className="section page-section">
      <header className="page-header case-header">
        <Link href="/projects" className="back-link">
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
        <p className="eyebrow">
          {project.category} / {project.year}
        </p>
        <h1>{project.title}</h1>
        {project.subtitle && (
          <p className="case-subtitle">{project.subtitle}</p>
        )}
        <p className="page-intro">{project.shortDescription}</p>
      </header>
      <figure>
        <div className="case-hero">
          {project.coverImage ? (
            <Image
              src={project.coverImage.src}
              alt={project.coverImage.alt}
              width={project.coverImage.width}
              height={project.coverImage.height}
              sizes="(max-width: 1280px) 100vw, 1184px"
              priority
              className={
                project.coverImage.type === "diagram"
                  ? "media-contain"
                  : undefined
              }
            />
          ) : (
            <MediaPlaceholder
              title={project.title}
              category={project.category}
            />
          )}
        </div>
        {project.coverImage && (
          <figcaption className="media-caption">
            {project.coverImage.caption}
            {project.coverImage.provenance === "competition-provided" &&
              " Competition-provided architecture reference."}
            {project.coverImage.provenance === "reconstructed" &&
              " Reconstructed later for explanation."}
          </figcaption>
        )}
      </figure>
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
      <section className="case-section" aria-labelledby="overview-heading">
        <h2 id="overview-heading">Project overview</h2>
        <div>
          {project.overview.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      {project.challenge && (
        <section className="case-section" aria-labelledby="challenge-heading">
          <h2 id="challenge-heading">The challenge</h2>
          <div>
            <p>{project.challenge}</p>
          </div>
        </section>
      )}
      {(project.personalContributions?.length ||
        project.contributionStatement) && (
        <section
          className="case-section"
          aria-labelledby="contribution-heading"
        >
          <h2 id="contribution-heading">My contribution</h2>
          <div>
            {project.contributionStatement && (
              <p>{project.contributionStatement}</p>
            )}
            {!!project.personalContributions?.length && (
              <ul>
                {project.personalContributions.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
      {!!project.engineeringHighlights?.length && (
        <section className="case-section" aria-labelledby="technical-heading">
          <h2 id="technical-heading">Engineering highlights</h2>
          <div>
            <ul>
              {project.engineeringHighlights.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
      {project.architecture && (
        <section
          className="architecture-section"
          aria-labelledby="architecture-heading"
        >
          <h2 id="architecture-heading">Architecture</h2>
          <p>{project.architecture.description}</p>
          <ProjectGallery
            title={`${project.title} architecture`}
            media={[project.architecture.media]}
          />
        </section>
      )}
      <section className="gallery-section" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading">A closer look</h2>
        <ProjectGallery title={project.title} media={project.gallery ?? []} />
      </section>
      {(project.status || project.limitations?.length) && (
        <section
          className="case-section status-section"
          aria-labelledby="status-heading"
        >
          <h2 id="status-heading">
            Project context
            <br />& limitations
          </h2>
          <div>
            {project.status && <p className="status-label">{project.status}</p>}
            {project.limitations?.map((point) => (
              <p key={point}>{point}</p>
            ))}
          </div>
        </section>
      )}
      <ProjectNavigation project={project} />
    </main>
  );
}
