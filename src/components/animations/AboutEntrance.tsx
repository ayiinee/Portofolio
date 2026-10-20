"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { stagger, useAnimate, useInView, useReducedMotion } from "motion/react";

export function AboutEntrance({ children }: { children: ReactNode }) {
  const [scope, animate] = useAnimate<HTMLElement>();
  const inView = useInView(scope, { once: true, amount: 0.12 });
  const reducedMotion = useReducedMotion();
  const hasEntered = useRef(false);

  useEffect(() => {
    const targets = ".about-section-heading, .about-sheet";
    if (reducedMotion) {
      if (inView) hasEntered.current = true;
      const controls = animate(targets, { opacity: 1, y: 0 }, { duration: 0 });
      return () => controls.stop();
    }
    if (!inView || hasEntered.current) return;
    hasEntered.current = true;
    // Only the heading and panel reveal. The artwork is always static.
    const controls = animate(targets, { opacity: [0, 1], y: [16, 0] }, {
      duration: 0.55, delay: stagger(0.08), ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, reducedMotion, animate]);

  return (
    <section ref={scope} id="about" className="about-desk" aria-labelledby="about-heading">
      {children}
    </section>
  );
}
