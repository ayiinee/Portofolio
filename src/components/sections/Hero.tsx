import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { PortraitCard } from "@/components/ui/PortraitCard";
import { profile } from "@/data/profile";

export function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-heading">
      <div className="hero-orbit" aria-hidden="true" />
      <div className="hero-inner">
        <Reveal entrance>
          <h1 id="hero-heading" className="headline">
            <span>Hi,</span>
            <PortraitCard />
            <span className="name-word">
              I’m {profile.shortName}
              <span className="headline-dot">!</span>
            </span>
          </h1>
        </Reveal>
        <Reveal entrance delay={0.08}>
          <p className="tagline">{profile.tagline}</p>
        </Reveal>
        <Reveal entrance delay={0.16}>
          <p className="hero-description">{profile.heroDescription}</p>
        </Reveal>
        <Reveal entrance delay={0.24} className="hero-actions">
          <a href="#projects" className="button button-primary">
            View My Work <ArrowUpRight size={16} />
          </a>
          <a href="#contact" className="button button-secondary">
            Let’s Connect <ArrowUpRight size={16} />
          </a>
        </Reveal>
      </div>
      <div className="hero-bottom">
        <span>BEAUTIFULLY PRESENTED WORK</span>
        <a href="#about" className="scroll-link">
          Scroll to explore <ArrowDown size={14} />
        </a>
        <span>BACKED BY REAL ENGINEERING</span>
      </div>
    </section>
  );
}
