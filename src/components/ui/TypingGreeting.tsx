"use client";

import { useEffect, useState } from "react";

/** The full greeting remains in the HTML; animation is purely presentational. */
export function TypingGreeting({ name }: { name: string }) {
  const [phase, setPhase] = useState<"idle" | "typing" | "complete">("idle");
  const text = `I’m ${name}.`;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const start = window.setTimeout(() => setPhase("typing"), 250);
    const finish = window.setTimeout(() => setPhase("complete"), 2450);
    const stop = () => {
      if (preference.matches) setPhase("complete");
    };
    preference.addEventListener("change", stop);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(finish);
      preference.removeEventListener("change", stop);
    };
  }, []);

  return (
    <h1 id="hero-heading" className="hero-greeting" aria-label={`Hi, ${text}`}>
      <span className="greeting-hi" aria-hidden="true">
        Hi there,
      </span>
      <span className={`typing-line typing-${phase}`} aria-hidden="true">
        <span className="typing-words">
          I’m <span>{name}.</span>
        </span>
        <span className="typing-caret" />
      </span>
    </h1>
  );
}
