import { ProjectGallery } from "../../../src/components/projects/ProjectGallery";
import type { ProjectMedia } from "../../../src/types/project";

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
        <ProjectGallery title="Single fixture" media={fixtures.slice(0, 1)} />
      </section>
      <section className="gallery-section" data-testid="multiple">
        <h2>Multiple images</h2>
        <ProjectGallery title="Multiple fixture" media={fixtures} />
      </section>
    </main>
  );
}
