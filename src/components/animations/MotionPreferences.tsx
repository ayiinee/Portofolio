"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (notify: () => void) => {
  const media = window.matchMedia(reducedQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const subscribeHydration = () => () => {};
const getReducedMotion = () => window.matchMedia(reducedQuery).matches;
const yes = () => true;
const no = () => false;

const MotionPreferences = createContext({ ready: false, reducedMotion: true });
export const motionEase = [0.22, 1, 0.36, 1] as const;

export function MotionPreferencesProvider({ children }: { children: ReactNode }) {
  const ready = useSyncExternalStore(subscribeHydration, yes, no);
  const initialReducedMotion = useReducedMotion();
  const liveReducedMotion = useSyncExternalStore(subscribeMotion, getReducedMotion, yes);
  const reducedMotion = !ready || (liveReducedMotion ?? initialReducedMotion ?? true);
  const value = useMemo(() => ({ ready, reducedMotion }), [ready, reducedMotion]);
  return <MotionPreferences.Provider value={value}><MotionConfig reducedMotion="user">{children}</MotionConfig></MotionPreferences.Provider>;
}

export const useMotionPreferences = () => useContext(MotionPreferences);
