"use client";

import { useEffect, useRef, useState } from "react";
import type { PhoneScene } from "@/lib/phone-scene";
import type { ShowcaseScreen, ShowcaseSlide } from "@/types/project";
import { ShowcasePoster } from "./ShowcaseVisual";
import styles from "./MobileShowcase.module.css";

export function PhoneStage({ slide, screens, title, active, onUnavailable, onDragChange }: {
  slide: ShowcaseSlide; screens: ShowcaseScreen[]; title: string; active: boolean;
  onUnavailable: () => void; onDragChange: (dragging: boolean) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<PhoneScene | null>(null);
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "fallback">("loading");
  const unavailableRef = useRef(onUnavailable);
  useEffect(() => { unavailableRef.current = onUnavailable; }, [onUnavailable]);
  useEffect(() => {
    // Keep the demand-rendered hero warm while its carousel is on screen.
    // Disposing on selection swaps the canvas for a poster mid-transition.
    if (!active || !screens.length) return;
    const abort = new AbortController();
    let failed = false;
    const fail = () => {
      failed = true; engine.current?.dispose(); engine.current = null;
      if (!abort.signal.aborted) { setState("fallback"); unavailableRef.current(); }
    };
    import("@/lib/phone-scene").then(({ createPhoneScene }) => createPhoneScene(host.current!, screens, slide.layout, abort.signal, fail))
      .then(scene => {
        if (abort.signal.aborted || failed) { scene.dispose(); return; }
        engine.current = scene; setState("ready");
      }).catch(() => { if (!abort.signal.aborted) fail(); });
    return () => { abort.abort(); pointer.current = null; engine.current?.dispose(); engine.current = null; setState("loading"); onDragChange(false); };
  }, [active, screens, slide.layout, onDragChange]);
  const ready = state === "ready" && active;
  return <div className={styles.deviceArea}>
    <div className={styles.stage} data-poster={slide.poster} data-renderer={ready ? "ready" : state === "fallback" ? "fallback" : "loading"}>
      <div className={styles.posterLayer} hidden={ready}><ShowcasePoster slide={slide} screens={screens} title={title} preload={slide.layout === "hero"} /></div>
      <div ref={host} className={styles.canvasHost} aria-hidden="true" />
      {ready && <div
        className={styles.rotationSurface} role="group" tabIndex={0}
        aria-label="Putar ponsel: drag atau gunakan tombol panah. Home untuk reset."
        title="Drag untuk memutar · Double-click untuk reset"
        data-phone-rotation="true"
        data-lenis-prevent="true"
        onPointerDown={event => {
          if (event.button !== 0) return;
          event.stopPropagation(); event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId);
          pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
          onDragChange(true);
        }}
        onPointerMove={event => {
          const last = pointer.current;
          if (!last || last.id !== event.pointerId) return;
          engine.current?.rotate((event.clientX - last.x) * .008, (event.clientY - last.y) * .008);
          pointer.current = { id: last.id, x: event.clientX, y: event.clientY };
        }}
        onPointerUp={() => { pointer.current = null; onDragChange(false); }} onPointerCancel={() => { pointer.current = null; onDragChange(false); }} onLostPointerCapture={() => { pointer.current = null; onDragChange(false); }}
        onDoubleClick={() => engine.current?.reset()}
        onKeyDown={event => {
          const delta: Record<string, [number, number]> = { ArrowLeft: [-.15, 0], ArrowRight: [.15, 0], ArrowUp: [0, -.15], ArrowDown: [0, .15] };
          if (delta[event.key]) { event.preventDefault(); event.stopPropagation(); engine.current?.rotate(...delta[event.key]); }
          if (event.key === "Home" || event.key === "Escape") { event.preventDefault(); event.stopPropagation(); engine.current?.reset(); }
        }}
      />}
    </div>
  </div>;
}
