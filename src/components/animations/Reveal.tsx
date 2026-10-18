"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function Reveal({ children, className, delay = 0, entrance = false }: {
  children: ReactNode;
  className?: string;
  delay?: number;
  entrance?: boolean;
}) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(scope.current, {
        y: 16, opacity: 0, duration: 0.65, delay, ease: "power3.out",
        clearProps: "transform,opacity",
        ...(entrance ? {} : { scrollTrigger: { trigger: scope.current, start: "top 94%", once: true } }),
      });
    });
    return () => media.revert();
  }, { scope, dependencies: [delay, entrance], revertOnUpdate: true });

  // The server-rendered final state stays readable without JavaScript.
  return <div ref={scope} className={className}>{children}</div>;
}
