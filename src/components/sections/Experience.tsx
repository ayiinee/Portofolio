import { ArrowUpRight, Sprout } from "lucide-react";
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
            label="THE JOURNEY"
            title="A story"
            accent="still unfolding."
            id="experience-heading"
          />
        </Reveal>
        {experience.length ? (
          <div className="timeline">
            {experience.map((item) => (
              <Reveal
                key={`${item.organization}-${item.role}`}
                className="timeline-row"
              >
                <p className="timeline-period">
                  {item.period}
                  {item.current && <span className="current-tag">Current</span>}
                </p>
                <div>
                  <h3>{item.role}</h3>
                  <p className="timeline-organization">{item.organization}</p>
                  <p>{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="journey-note">
            <span className="journey-icon">
              <Sprout size={27} strokeWidth={1.4} />
            </span>
            <div>
              <h3>Every journey starts somewhere.</h3>
              <p>
                My experience, learning milestones, and the chapters in between
                will live here. This part of the story is being put together.
              </p>
              <span className="small-label">PROFILE IN PROGRESS</span>
            </div>
            <a href="#projects" className="text-link">
              See what’s taking shape <ArrowUpRight size={16} />
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
