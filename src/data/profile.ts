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
  about: {
    lead: ["I'm A'ini, an informatics student", "who loves building things on the web."],
    bio: [
      "I'm passionate about cloud, backend, and DevOps — and",
      "how they work together to power reliable digital experiences.",
      "I enjoy turning ideas into real, working systems, and I'm",
      "always curious to learn and explore new technologies.",
    ],
    badgeRole: "Informatics student",
    // Development placeholders approved by the owner. Replace with verified data.
    stats: [
      { label: "Projects completed", value: null, href: "#projects" },
      { label: "Certifications", value: null, href: "#education" },
      { label: "Competitions joined", value: null, href: "#education" },
      { label: "Years building", value: null, href: "#experience" },
    ],
  },
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
