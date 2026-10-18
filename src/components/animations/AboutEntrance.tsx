"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function AboutEntrance({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLElement>(null);
  const hasEntered = useRef(false);

  useGSAP(() => {
    const media = gsap.matchMedia(scope);
    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      mobile: "(max-width: 700px)",
      tablet: "(min-width: 701px) and (max-width: 1100px)",
    }, (context) => {
      const { motion, mobile, tablet } = context.conditions!;
      // Reverting a preference/breakpoint change restores the static layout.
      // An entrance already started must not replay when the viewport changes.
      if (!motion || hasEntered.current) return;

      const amplitude = mobile ? 0.5 : tablet ? 0.75 : 1;
      const lanyard = ".lanyard-motion";

      gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: "top 80%",
          once: true,
          invalidateOnRefresh: true,
        },
        onStart: () => { hasEntered.current = true; },
      })
        .set(lanyard, { willChange: "transform" }, 0)
        .fromTo(lanyard,
          { y: mobile ? -18 : tablet ? -28 : -40, rotation: -4 * amplitude, opacity: 1 },
          { y: 0, rotation: 2 * amplitude, duration: 0.65, ease: "power2.out" }, 0)
        .to(lanyard, { rotation: -0.7 * amplitude, duration: 0.45, ease: "sine.inOut" }, 0.65)
        .to(lanyard, {
          rotation: 0, duration: 0.45, ease: "sine.out",
          clearProps: "transform,opacity,willChange",
        }, 1.1)
        .from(".about-outline", {
          y: 12, opacity: 0, duration: 0.6, ease: "power2.out",
          clearProps: "transform,opacity",
        }, 0.15)
        .from(".about-section-heading h2", {
          y: 8, opacity: 0, duration: 0.55, ease: "power2.out",
          clearProps: "transform,opacity",
        }, 0.25)
        .from(".about-sheet", {
          y: 12, opacity: 0, duration: 0.6, ease: "power2.out",
          clearProps: "transform,opacity",
        }, 0.4);
    });
    return () => media.revert();
  }, { scope });

  return (
    <section ref={scope} id="about" className="about-desk" aria-labelledby="about-heading">
      {children}
    </section>
  );
}
