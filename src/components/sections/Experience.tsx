import { Reveal } from "@/components/animations/Reveal";
import { ExperienceArchive } from "@/components/experience/ExperienceArchive";
import { experience } from "@/data/experience";

export function Experience() {
  return (
    <section
      id="experience"
      className="experience-section"
      aria-labelledby="experience-heading"
    >
      <div className="experience-frame">
        <Reveal className="experience-section-heading">
          <span className="experience-outline" aria-hidden="true">EXPERIENCE</span>
          <h2 className="experience-heading" id="experience-heading">
            The journey <em>so far.</em>
          </h2>
        </Reveal>
        <ExperienceArchive items={experience} />
      </div>
    </section>
  );
}
