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
      hover: "(min-width: 901px) and (hover: hover) and (pointer: fine)",
    }, (context) => {
      const { motion, mobile, tablet, hover } = context.conditions!;
      // Reverting a preference/breakpoint change restores the static layout.
      // An entrance already started must not replay when the viewport changes.
      if (!motion) return;

      const amplitude = mobile ? 1 / 3 : tablet ? 0.7 : 1;
      const lanyard = ".lanyard-motion";
      let entranceComplete = hasEntered.current;
      let hoverMotion: gsap.core.Animation | undefined;

      if (!hasEntered.current) gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: "top 80%",
          once: true,
          invalidateOnRefresh: true,
        },
        onStart: () => { hasEntered.current = true; },
        onComplete: () => { entranceComplete = true; },
      })
        .set(lanyard, { willChange: "transform" }, 0)
        .fromTo(lanyard,
          { y: mobile ? -18 : tablet ? -28 : -44, rotation: -6 * amplitude, opacity: 1 },
          { y: 0, rotation: 3 * amplitude, duration: 0.65, ease: "power2.out" }, 0)
        .to(lanyard, { rotation: -amplitude, duration: 0.45, ease: "sine.inOut" }, 0.65)
        .to(lanyard, {
          rotation: 0, duration: 0.45, ease: "sine.out",
          clearProps: "transform,opacity,willChange",
        }, 1.1)
        .from(".about-outline", {
          y: mobile ? -12 : -18, opacity: 0.35, duration: 0.75, ease: "power3.out",
          clearProps: "transform,opacity",
        }, 0.15)
        .from(".about-section-heading h2", {
          y: mobile ? 18 : 25, opacity: 0, duration: 0.75, ease: "power3.out",
          clearProps: "transform,opacity",
        }, 0.25)
        .from(".about-sheet", {
          y: mobile ? 20 : 24, opacity: 0, duration: 0.75, ease: "power3.out",
          clearProps: "transform,opacity",
        }, 0.5);

      const stage = scope.current?.querySelector<HTMLElement>(".lanyard-stage");
      if (!hover || !stage) return;

      // Listen on the stationary stage so swinging cannot retrigger hover.
      // Register delayed tweens with this media context for preference cleanup.
      context.add("swingOnHover", () => {
        if (!entranceComplete) return;
        hoverMotion?.kill();
        hoverMotion = gsap.timeline({ defaults: { ease: "sine.inOut", overwrite: "auto" } })
          .set(lanyard, { willChange: "transform" })
          .to(lanyard, { rotation: -3, duration: 0.45 })
          .to(lanyard, { rotation: 1.8, duration: 0.45 })
          .to(lanyard, { rotation: -0.7, duration: 0.4 })
          .to(lanyard, { rotation: 0, duration: 0.4, clearProps: "transform,willChange" });
      });
      context.add("settleOnLeave", () => {
        if (!entranceComplete) return;
        hoverMotion?.kill();
        hoverMotion = gsap.to(lanyard, {
          rotation: 0, duration: 0.6, ease: "sine.out", overwrite: "auto",
          clearProps: "transform,willChange",
        });
      });
      stage.addEventListener("pointerenter", context.swingOnHover);
      stage.addEventListener("pointerleave", context.settleOnLeave);
      return () => {
        stage.removeEventListener("pointerenter", context.swingOnHover);
        stage.removeEventListener("pointerleave", context.settleOnLeave);
      };
    });
    return () => media.revert();
  }, { scope });

  return (
    <section ref={scope} id="about" className="about-desk" aria-labelledby="about-heading">
      {children}
    </section>
  );
}
