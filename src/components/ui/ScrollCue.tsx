"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ChevronsDown } from "lucide-react";

export function ScrollCue() {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref);
  const reducedMotion = useReducedMotion();
  const animated = inView && reducedMotion === false;

  return (
    <a
      ref={ref}
      href="#about"
      className="scroll-link"
      data-motion={animated ? "active" : "static"}
    >
      <span className="scroll-indicator" aria-hidden="true">
        <motion.span
          className="scroll-chevron"
          initial={false}
          animate={
            animated
              ? { y: [-3, 4, -3], opacity: [0.45, 1, 0.45] }
              : { y: 0, opacity: 1 }
          }
          transition={
            animated
              ? {
                  duration: 1.8,
                  repeat: Infinity,
                  repeatDelay: 0.35,
                  ease: "easeInOut",
                }
              : { duration: 0 }
          }
        >
          <ChevronsDown size={20} />
        </motion.span>
      </span>
      <span>Scroll to get to know me</span>
    </a>
  );
}
