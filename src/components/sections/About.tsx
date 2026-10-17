import { FolderOpen, GraduationCap, X } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { LanyardCard } from "@/components/ui/LanyardCard";

export function About() {
  return (
    <section id="about" className="about-desk" aria-labelledby="about-heading">
      <div className="section about-layout">
        <Reveal className="about-lanyard">
          <LanyardCard />
        </Reveal>
        <div className="about-sheet">
          <div className="sheet-tab">
            <FolderOpen size={17} aria-hidden="true" />
            <span>01 / ABOUT ME</span>
            <X className="sheet-tab-close" size={15} aria-hidden="true" />
          </div>
          <div className="about-folder-content">
            <Reveal className="about-profile-copy">
              <p className="eyebrow">QURROTUL A’INI</p>
              <h2 id="about-heading">About me.</h2>
              <p className="about-lead">
                I’m an Informatics Engineering student at Universitas Negeri
                Malang. My projects focus on cloud infrastructure, backend
                development, DevOps, and AI integrations.
              </p>
              <p>
                I started learning networking, Linux, and AWS in vocational
                school. In 2024, I won the city-level LKS Cloud Computing
                competition, then competed at the provincial level.
              </p>
              <div className="about-inline-details">
                <GraduationCap size={21} aria-hidden="true" />
                <div>
                  <strong>Universitas Negeri Malang</strong>
                  <span>Informatics Engineering · 2024–Present</span>
                </div>
              </div>
            </Reveal>
            <div className="about-sheet-footer">
              <span>PROFILE / 01</span>
              <a href="#experience">Experience</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
