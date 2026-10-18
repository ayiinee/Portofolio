import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience } from "@/data/experience";

export function Experience() {
  return (
    <section
      id="experience"
      className="experience-band"
      aria-labelledby="experience-heading"
    >
      <div className="section">
        <Reveal>
          <SectionHeading
            number="02"
            label="EXPERIENCE"
            title="The journey"
            accent="so far."
            id="experience-heading"
          />
        </Reveal>
        <div className="timeline">
          {experience.map((item, index) => (
            <Reveal key={item.role} className="timeline-row" delay={index * 0.06}>
              <p className="timeline-period">{item.period}</p>
              <div>
                <h3>{item.role}</h3>
                <p className="timeline-organization">{item.organization}</p>
                <ul>
                  {item.contributions.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
