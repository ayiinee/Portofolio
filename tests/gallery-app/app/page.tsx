import { ProjectGallery } from "../../../src/components/projects/ProjectGallery";
import type { ProjectMedia } from "../../../src/types/project";
import { ExperienceArchive } from "../../../src/components/experience/ExperienceArchive";
import type { ExperienceRecord } from "../../../src/data/experience";

const fixtures: ProjectMedia[] = [
  {
    src: "/fixture-1.svg",
    width: 800,
    height: 500,
    alt: "QA fixture one",
    caption: "First test image",
    type: "diagram",
    provenance: "competition-provided",
  },
  {
    src: "/fixture-2.svg",
    width: 800,
    height: 500,
    alt: "QA fixture two",
    caption: "Second test image",
    type: "screenshot",
  },
  {
    src: "/fixture-3.svg",
    width: 800,
    height: 500,
    alt: "QA fixture three",
    caption: "Third test image",
    type: "workflow",
    provenance: "reconstructed",
  },
];

// Synthetic records and images only: never imported by the production portfolio.
const experienceFixtures: ExperienceRecord[] = Array.from({ length: 7 }, (_, index) => ({
  id: `synthetic-experience-${index}`,
  year: "2026",
  role: `Synthetic QA role ${index + 1}`,
  course: `Synthetic course ${index + 1}`,
  period: "January 2026 – February 2026",
  organization: "Synthetic QA organization",
  contributions: ["Synthetic contribution for interaction testing."],
  gallery: index === 1 ? fixtures.slice(0, 1) : index === 2 ? fixtures : [],
}));

export default function GalleryFixtures() {
  return (
    <main className="section">
      <h1>Isolated gallery QA fixtures</h1>
      <section className="gallery-section" data-testid="empty">
        <h2>No images</h2>
        <ProjectGallery title="Empty fixture" media={[]} />
      </section>
      <section className="gallery-section" data-testid="single">
        <h2>Single image</h2>
        <ProjectGallery title="Single fixture" media={fixtures.slice(0, 1)} variant="hero" />
      </section>
      <section className="gallery-section" data-testid="multiple">
        <h2>Multiple images</h2>
        <ProjectGallery title="Multiple fixture" media={fixtures} />
      </section>
      <section className="gallery-section project-route" data-testid="hero">
        <h2>Project hero carousel</h2>
        <div className="case-media" style={{ maxWidth: 800, marginInline: "auto" }}>
          <ProjectGallery title="Hero fixture" media={fixtures} variant="hero" />
        </div>
      </section>
      <section className="gallery-section project-route" data-testid="hero-empty">
        <h2>Project hero without images</h2>
        <ProjectGallery title="Empty hero fixture" media={[]} variant="hero" />
      </section>
      <section className="experience-section" data-testid="experience-three">
        <h2>Experience QA: initial count three</h2>
        <ExperienceArchive items={experienceFixtures} initialCount={3} />
      </section>
      <section className="experience-section" data-testid="experience-five">
        <h2>Experience QA: initial count five</h2>
        <ExperienceArchive items={experienceFixtures} initialCount={5} />
      </section>
    </main>
  );
}
