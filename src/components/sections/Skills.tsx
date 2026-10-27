import { Braces, Cloud, GitBranch, Layers, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { skills } from "@/data/skills";

const icons = [Cloud, GitBranch, Braces, Layers, ShieldCheck];

export function Skills() {
  return (
    <section
      id="skills"
      className="skills-section"
      aria-labelledby="skills-heading"
    >
      <div className="skills-frame">
        <Reveal className="skills-introduction">
          <div className="skills-title">
            <span className="skills-outline" aria-hidden="true">SKILLS</span>
            <h2 id="skills-heading">The tools behind <em>my work.</em></h2>
          </div>
          <p>
            Technologies I’ve worked with across projects, practical learning,
            and competition challenges.
          </p>
        </Reveal>
        <div className="skills-cards">
          {skills.map((group, index) => {
            const Icon = icons[index];
            return (
              <Reveal
                key={group.category}
                delay={(index % 2) * 0.08}
                className={`skills-card${group.services ? " skills-card-cloud" : ""}`}
              >
                <div className="skills-card-content">
                  <div className="skills-card-top">
                    <span className="skills-icon">
                      <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span className="skills-index" aria-hidden="true">0{index + 1}</span>
                  </div>
                  <h3>{group.category}</h3>
                  <p>{group.description}</p>
                  <ul className="skills-tags" aria-label={`${group.category} tools`}>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                {group.services && (
                  <div className="skills-services">
                    <h4>{group.detail}</h4>
                    <ul className="skills-tags" aria-label="AWS services">
                      {group.services.map((service) => (
                        <li key={service}>{service}</li>
                      ))}
                    </ul>
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
