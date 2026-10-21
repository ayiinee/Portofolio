export const projectCategories = [
  "Cloud & DevOps",
  "Backend & Web",
  "AI & Security",
  "GIS & IoT",
] as const;
export type ProjectCategory = (typeof projectCategories)[number];

export type ProjectMedia = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  type:
    "screenshot" | "mobile" | "diagram" | "photo" | "presentation" | "workflow";
  provenance?: "original" | "competition-provided" | "reconstructed";
};

export type Project = {
  slug: string;
  title: string;
  subtitle?: string;
  year: number;
  timeline?: string;
  category: ProjectCategory;
  tags: string[];
  type: string;
  role: string;
  featured: boolean;
  featuredOrder?: number;
  shortDescription: string;
  cardSummary?: string;
  overview: string[];
  challenge?: string;
  personalContributions?: string[];
  contributionStatement?: string;
  engineeringHighlights?: string[];
  impact?: string[];
  achievements?: string[];
  technologies: string[];
  architecture?: { description: string; media: ProjectMedia };
  status?: string;
  limitations?: string[];
  coverImage?: ProjectMedia;
  gallery?: ProjectMedia[];
  repositoryUrl?: string;
  liveUrl?: string;
  previousProject?: string;
  nextProject?: string;
};
