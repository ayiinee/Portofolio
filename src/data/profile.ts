export const profile = {
  name: "Qurrotul A'ini",
  shortName: "A'ini",
  role: "Software Engineer · DevOps & Cloud",
  // tagline: "From code to cloud.",
  
  description:
    "Explore the portfolio of Qurrotul A'ini, a software engineer focusing on DevOps, cloud infrastructure, backend development, and engineering projects.",
  email: "qurrotulaini0325@gmail.com" as string | null,
  github: "https://github.com/ayiinee",
  linkedin: "https://www.linkedin.com/in/qurrotul-a-ini",
  // TODO: Add an approved photograph and résumé when available.
  resume: null as string | null,
  portrait: "/images/portrait-placeholder.svg",
  portraitIsPlaceholder: true,
  portraitAlt:
    "Portrait placeholder for Qurrotul A'ini; photograph coming soon",
};

export const navigation = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Achievement" },
  { id: "contact", label: "Contact" },
] as const;
