export type ProjectCategory = "Web development" | "Explorations";

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  kind: string;
  image: string;
  imageAlt: string;
  tags: string[];
  description: string;
  approach: string;
  href: string | null;
};

export const projects: Project[] = [
  {
    id: "personal-portfolio",
    title: "A space of my own",
    subtitle: "Personal portfolio · Design & development",
    category: "Web development",
    kind: "This website",
    image: "/images/portfolio-preview.svg",
    imageAlt:
      "Blue editorial portfolio interface with serif typography and a portrait card",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Motion"],
    description:
      "Turning a single HTML design concept into a responsive, component-based portfolio with a soft blue palette and a little personality.",
    approach:
      "Built with the Next.js App Router, reusable sections, and typed content files. Motion handles entrances and scroll reveals; CSS keeps the portrait interaction subtle. Reduced-motion preferences are respected throughout.",
    href: "#top",
  },
  {
    id: "notes-studio",
    title: "A quieter kind of workspace",
    subtitle: "Notes Studio · Interface exploration",
    category: "Explorations",
    kind: "Illustrative concept",
    image: "/images/notes-preview.svg",
    imageAlt:
      "Illustrative lavender notes workspace with a sidebar and an open daily note",
    tags: ["UI exploration", "Visual design", "Concept"],
    description:
      "An illustrative interface study imagining a calmer place to collect thoughts. This is sample portfolio content, ready to be replaced with a real project.",
    approach:
      "The concept explores generous spacing, a restrained lavender palette, and a clear reading hierarchy. The preview is a static illustration; a working notes application has not been built.",
    href: null,
  },
];

export const projectFilters = [
  "All work",
  "Web development",
  "Explorations",
] as const;
