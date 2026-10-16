export type Experience = {
  period: string;
  role: string;
  organization: string;
  description: string;
  current?: boolean;
};

// Add verified work, education, or community experience here.
// Example shape: { period: "2025 — 2026", role: "Your role",
// organization: "Your organization", description: "Your contribution" }
export const experience: Experience[] = [
  {
    period: "Present",
    role: "Informatics Student",
    organization: "A chapter of learning & exploration",
    description:
      "Studying informatics and building this personal portfolio as a space to document projects, experiments, and the learning journey ahead.",
    current: true,
  },
];
