import { Braces, Layers, Send } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skills } from "@/data/skills";

const icons = [Braces, Layers, Send];

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
            label="THE TOOLBOX"
            title="Good ideas."
            accent="The right tools."
            id="skills-heading"
          />
          <p className="section-description">
            The technologies bringing this little corner of the web to life.
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
                  <Icon size={22} strokeWidth={1.4} />
                  <span>0{index + 1}</span>
                </div>
                <h3>{group.category}</h3>
                <p>{group.description}</p>
                <div className="skill-chips">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
