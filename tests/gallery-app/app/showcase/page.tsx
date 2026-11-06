import { MobileShowcase } from "../../../../src/components/projects/MobileShowcase";
import type { MobileShowcase as ShowcaseConfig } from "../../../../src/types/project";

// Deliberately non-production screenshots with different aspect ratios.
const showcase: ShowcaseConfig = {
  theme: { primary: "#0756b3", secondary: "#26c8ed", surface: "#eaf4fc", ink: "#113255", onPrimary: "#ffffff", illustration: "/fixture-1.svg", overlayOpacity: .15 },
  screens: [
    { id: "wide", label: "Wide fixture", media: { src: "/fixture-1.svg", width: 800, height: 500, alt: "Wide synthetic screen", caption: "Synthetic landscape screen", type: "screenshot" } },
    { id: "tall", label: "Tall fixture", media: { src: "/fixture-tall.svg", width: 400, height: 1600, alt: "Tall synthetic screen", caption: "Synthetic long screen", type: "mobile" } },
    { id: "missing", label: "Unavailable screen", media: { src: "/missing-screen.png", width: 400, height: 800, alt: "Unavailable fixture", caption: "Deliberately missing", type: "mobile" } },
  ],
  hero: { id: "intro", layout: "hero", eyebrow: "QA / HERO", title: "Reusable screens", description: "Synthetic screenshots for isolated interaction testing.", screenIds: ["wide", "tall"] },
  slides: [
    { id: "long", layout: "scroll", eyebrow: "QA / LONG SCREEN", title: "Long screenshots", description: "A device with a separate full-length screenshot.", screenIds: ["wide", "tall"], annotations: ["Full screenshot remains readable"] },
    { id: "failure", layout: "feature", eyebrow: "QA / FAILURE", title: "Texture fallback", description: "A missing texture should leave the static preview intact.", screenIds: ["missing"] },
  ],
};

export default function ShowcaseFixture() {
  return <main style={{ maxWidth: 1100, margin: "40px auto", padding: 20 }}><MobileShowcase showcase={showcase} title="Showcase QA" /></main>;
}
