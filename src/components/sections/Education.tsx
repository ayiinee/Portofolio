import { GraduationCap } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { achievements, education, training } from "@/data/achievements";

export function Education() {
  return (
    <section
      id="education"
      className="section"
      aria-labelledby="education-heading"
    >
      <Reveal>
        <SectionHeading
          number="05"
          label="EDUCATION & ACHIEVEMENTS"
          title="A few milestones"
          accent="along the way."
          id="education-heading"
        />
      </Reveal>
      <div className="education-grid">
        <Reveal className="education-card">
          <GraduationCap size={32} strokeWidth={1.3} aria-hidden="true" />
          <h3>{education.institution}</h3>
          <p>{education.program}</p>
          <p className="education-date">{education.period}</p>
        </Reveal>
        <Reveal className="milestones">
          <h3>Selected achievements</h3>
          <ul>
            {achievements.map((item) => (
              <li key={item.title}>
                <span>{item.title}</span>
                <time dateTime={String(item.year)}>{item.year}</time>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <Reveal className="training">
        <h3>Certifications & training</h3>
        <ul>
          {training.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
