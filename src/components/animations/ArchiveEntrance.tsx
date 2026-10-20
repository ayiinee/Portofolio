"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Restore the original archive timeline independently of the newer sections.
export function ArchiveEntrance({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".archive-card-motion", scope.current);
      gsap.timeline({ defaults: { ease: "power3.out" } })
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

  return <div ref={scope} className="archive-illustration">{children}</div>;
}
