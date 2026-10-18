"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { PersonalArchive } from "@/components/ui/PersonalArchive";
import { profile } from "@/data/profile";

export function Hero() {
  const scope = useRef<HTMLElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".archive-card-motion", scope.current);
      // Outer wrappers own the static fan angles; inner wrappers animate into them.
      // The frosted front always occludes card bottoms, including during insertion.
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".archive-copy > *", { y: 16, opacity: 0, duration: 0.55, stagger: 0.08 }, 0)
        .from(".archive-object, .archive-ground-shadow", { y: 24, opacity: 0, duration: 0.7 }, 0.18)
        .from(".archive-wordmark", { opacity: 0, duration: 0.65 }, 0.2)
        .fromTo(cards,
          { yPercent: -36, xPercent: (i) => (i - 1) * 9, rotation: (i) => [-4, 2, 4][i], opacity: 0 },
          { yPercent: -17, xPercent: (i) => (i - 1) * 3, rotation: (i) => [-2, 1, 2][i], opacity: 1, duration: 0.4, stagger: 0.1 }, 0.48)
        .to(cards, {
          yPercent: 0, xPercent: 0, rotation: 0, duration: 0.65,
          stagger: 0.1, ease: "power2.inOut", clearProps: "transform,opacity",
        }, 0.98);
    });
    return () => media.revert();
  }, { scope });

  return (
    <section ref={scope} id="top" className="archive-hero" aria-labelledby="hero-heading">
      <div className="archive-layout">
        <div className="archive-copy">
          <h1 id="hero-heading" className="archive-heading">
            <span className="archive-hi">Hi there,</span>
            <span className="archive-name">I&apos;m <em>{profile.shortName}.</em></span>
          </h1>
          <p className="archive-description">Informatics student crafting clean digital experiences.</p>
          <div className="archive-socials" aria-label="Social links">
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="A'ini on GitHub (opens in a new tab)"><span className="archive-brand-icon archive-github" aria-hidden="true" /></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="A'ini on LinkedIn (opens in a new tab)"><span className="archive-brand-icon archive-linkedin" aria-hidden="true" /></a>
            {profile.email && <a href={`mailto:${profile.email}`} aria-label="Email A'ini"><span className="archive-brand-icon archive-email" aria-hidden="true" /></a>}
          </div>
          <div className="archive-actions">
            <a href="#projects" className="button button-primary">View My Work <ArrowUpRight size={18} aria-hidden="true" /></a>
            <a href="#contact" className="archive-connect">Let&apos;s Connect</a>
          </div>
        </div>
        <PersonalArchive />
      </div>
    </section>
  );
}
