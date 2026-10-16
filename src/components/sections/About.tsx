import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <Reveal>
        <SectionHeading
          number="01"
          label="ABOUT ME"
          title="A little more"
          accent="about me."
          id="about-heading"
        />
      </Reveal>
      <div className="about-grid">
        <Reveal className="about-statement">
          <p>
            Curious about the code.
            <br />
            Just as curious about what keeps it running.
          </p>
          <span>A’ini — learning by building.</span>
        </Reveal>
        <Reveal className="about-copy">
          <p className="intro-text">
            I’m Qurrotul A’ini, an Informatics Engineering student at
            Universitas Negeri Malang with a growing focus on DevOps, Cloud
            Infrastructure, and Backend Engineering.
          </p>
          <p>
            My interest in cloud computing started during vocational high
            school, where I explored computer networking, Linux server
            administration, and AWS infrastructure.
          </p>
          <p>
            In 2024, I won first place in the city-level Cloud Computing Student
            Skills Competition (LKS) and continued to compete at the provincial
            level, working through AWS infrastructure challenges involving
            serverless applications, networking, deployment, and backup
            recovery.
          </p>
          <p>
            Since then, I’ve expanded into backend development, AI integration,
            and collaborative software engineering projects.
          </p>
          <p>
            I enjoy understanding how different parts of a system fit together —
            from the code and database to the infrastructure that supports the
            application.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
