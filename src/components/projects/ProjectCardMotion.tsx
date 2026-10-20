"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { motionEase, useMotionPreferences } from "@/components/animations/MotionPreferences";

export function ProjectCardMotion({ slug, children }: { slug: string; children: ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const { reducedMotion } = useMotionPreferences();
  return <motion.article
    className="project-card"
    data-project={slug}
    initial={false}
    animate={{ y: !reducedMotion && (hovered || focused) ? -5 : 0 }}
    transition={{ type: "tween", duration: reducedMotion ? 0 : 0.2, ease: motionEase }}
    onHoverStart={() => setHovered(true)}
    onHoverEnd={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
  >{children}</motion.article>;
}
