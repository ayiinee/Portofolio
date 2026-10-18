import Image from "next/image";
import { ArrowUpRight, GraduationCap } from "lucide-react";
import { LanyardCard } from "@/components/ui/LanyardCard";

export function About() {
  return (
    <section id="about" className="about-desk" aria-labelledby="about-heading">
      <div className="about-layout">
        <header className="about-section-heading">
          <span className="about-outline" aria-hidden="true">
            ABOUT
          </span>
          <h2 id="about-heading">
            About <em>me</em>
          </h2>
        </header>
        <div className="about-lanyard">
          <LanyardCard />
        </div>
        <div className="about-sheet">
          <div className="profile-panel-glass" aria-hidden="true" />
          <Image
            className="profile-panel-edge"
            src="/images/design/profile-panel-edge.svg"
            alt=""
            width={640}
            height={640}
            unoptimized
          />
          <div className="sheet-tab">
            <span>01 / ABOUT</span>
          </div>
          <div className="about-profile-copy">
            <p className="eyebrow">QURROTUL A’INI</p>
            <p className="about-lead">
              I’m an Informatics Engineering student at Universitas Negeri
              Malang. My projects focus on <strong>cloud infrastructure</strong>
              , <strong>backend development</strong>, <strong>DevOps</strong>,
              and <strong>AI integrations</strong>.
            </p>
            <p>
              I started learning networking, Linux, and AWS in vocational
              school. In 2024, I won the city-level LKS Cloud Computing
              competition, then competed at the provincial level.
            </p>
            <div className="about-inline-details">
              <GraduationCap size={22} aria-hidden="true" />
              <div>
                <strong>Universitas Negeri Malang</strong>
                <span>Informatics Engineering · 2024–Present</span>
              </div>
            </div>
            <a
              href="#experience"
              className="hero-connect about-experience-link"
            >
              Explore my experience{" "}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
