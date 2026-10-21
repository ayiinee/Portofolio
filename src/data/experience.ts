export type ExperiencePhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

export type ExperienceRecord = {
  id: string;
  year: string;
  period: string;
  role: string;
  course?: string;
  organization: string;
  contributions: string[];
  gallery?: ExperiencePhoto[];
};

// Add approved photos in display order; the first also becomes the row thumbnail.
export const experience: ExperienceRecord[] = [
  {
    id: "database-assistant-2026",
    year: "2026",
    period: "February 2026 – May 2026",
    role: "Teaching Assistant",
    course: "Database Course",
    organization: "Universitas Negeri Malang",
    contributions: [
      "Assisted practical lessons on relational databases and database management.",
      "Guided students through SQL, normalization, and structured problem-solving.",
    ],
  },
  {
    id: "web-programming-assistant-2025",
    year: "2025",
    period: "August 2025 – December 2025",
    role: "Teaching Assistant",
    course: "Web Programming Course",
    organization: "Universitas Negeri Malang",
    contributions: [
      "Supported web programming laboratory sessions.",
      "Guided students in HTML, CSS, JavaScript, and web development fundamentals.",
    ],
  },
  {
    id: "it-support-intern-2022",
    year: "2022–23",
    period: "December 2022 – February 2023",
    role: "IT Support Intern",
    organization: "PT Kawasan Berikat Nusantara",
    contributions: [
      "Supported hardware, software, and network troubleshooting.",
      "Assisted LAN connectivity and device configuration.",
    ],
  },
];
