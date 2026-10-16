import { Braces, Cloud, GitBranch, Layers, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skills } from "@/data/skills";

const icons = [Cloud, GitBranch, Braces, Layers, ShieldCheck];

export function Skills() {
  return (
    <section
      id="skills"
      className="skills-band"
      aria-labelledby="skills-heading"
    >
      <div className="section">
        <Reveal>
          <SectionHeading
            number="04"
            label="SKILLS & TOOLS"
            title="The tools behind"
            accent="my work."
            id="skills-heading"
          />
          <p className="section-description">
            Technologies I’ve worked with across projects, practical learning,
            and competition challenges.
          </p>
        </Reveal>
        <div className="skills-grid">
          {skills.map((group, index) => {
            const Icon = icons[index];
            return (
              <Reveal
                key={group.category}
                delay={index * 0.08}
                className="skill-group"
              >
                <div className="skill-heading">
                  <Icon size={22} strokeWidth={1.4} aria-hidden="true" />
                  <span>0{index + 1}</span>
                </div>
                <h3>{group.category}</h3>
                <p>{group.description}</p>
                <div className="skill-chips">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                {group.services && (
                  <div className="skill-detail">
                    <p>{group.detail}</p>
                    <div className="skill-chips">
                      {group.services.map((service) => (
                        <span key={service}>{service}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
