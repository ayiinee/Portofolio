"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { KeycapControls, KeycapScene } from "@/lib/keycap-scene";

const letters = ["A", "I", "N", "I"] as const;

export function InteractiveKeycap({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [pressed, setPressed] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const reducedMotion = useReducedMotion();
  const host = useRef<HTMLSpanElement>(null);
  const scene = useRef<KeycapScene | null>(null);
  const letter = letters[index], next = letters[(index + 1) % letters.length];
  const controls = useRef<KeycapControls>({ letter: "A", pressed: false, reducedMotion: true });

  useEffect(() => {
    controls.current = { letter, pressed, reducedMotion: reducedMotion ?? true };
    scene.current?.update(controls.current);
  }, [letter, pressed, reducedMotion]);

  useEffect(() => {
    const element = host.current!;
    const abort = new AbortController();
    const unavailable = () => {
      scene.current?.dispose(); scene.current = null;
      if (!abort.signal.aborted) setStatus("fallback");
    };
    import("@/lib/keycap-scene")
      .then(({ createKeycapScene }) => createKeycapScene(element, abort.signal, unavailable))
      .then(engine => {
        if (abort.signal.aborted) { engine.dispose(); return; }
        scene.current = engine;
        engine.update(controls.current); setStatus("ready");
      })
      .catch(() => { if (!abort.signal.aborted) unavailable(); });
    return () => { abort.abort(); scene.current?.dispose(); scene.current = null; };
  }, []);

  return (
    <button
      type="button"
      className={`intro-keycap intro-keycap-a keycap-3d ${className}`}
      aria-label={`Keycap ${letter}. Press to change to ${next}.`}
      title="Press to cycle A → I → N → I"
      data-letter={letter}
      data-pressed={pressed}
      data-renderer={status}
      onPointerDown={event => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId); setPressed(true);
      }}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onLostPointerCapture={() => setPressed(false)}
      onBlur={() => setPressed(false)}
      onKeyDown={event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        if (event.repeat) { event.preventDefault(); return; }
        setPressed(true);
      }}
      onKeyUp={event => { if (event.key === "Enter" || event.key === " ") setPressed(false); }}
      onClick={() => setIndex(value => (value + 1) % letters.length)}
    >
      <span ref={host} className="keycap-3d-stage" aria-hidden="true" />
      {status !== "ready" && <span className="keycap-3d-fallback" aria-hidden="true">{letter}</span>}
      <span className="sr-only" aria-live="polite" aria-atomic="true">Current letter: {letter}</span>
    </button>
  );
}
