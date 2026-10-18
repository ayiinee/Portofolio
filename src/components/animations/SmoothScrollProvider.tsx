"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const query = "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)";
const subscribe = (callback: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const clientSnapshot = () => window.matchMedia(query).matches;
const serverSnapshot = () => false;
const options = {
  autoRaf: false,
  lerp: 0.14,
  smoothWheel: true,
  syncTouch: false,
  // This version reads the existing CSS scroll-padding automatically.
  anchors: true,
  stopInertiaOnNavigate: true,
};

function ScrollEngine() {
  const ref = useRef<LenisRef>(null);
  useLenis(() => ScrollTrigger.update());

  useEffect(() => {
    // GSAP is the only RAF driver; Lenis expects milliseconds.
    const tick = (seconds: number) => ref.current?.lenis?.raf(seconds * 1000);
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return <ReactLenis root ref={ref} options={options} />;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const enabled = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  return <>{enabled && <ScrollEngine />}{children}</>;
}
