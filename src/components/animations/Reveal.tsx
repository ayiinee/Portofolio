"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function Reveal({
  children,
  className,
  delay = 0,
  entrance = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  entrance?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const hydrated = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  // Server-rendered content stays readable when JavaScript is unavailable.
  if (!hydrated || reducedMotion)
    return <div className={cn(className)}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={entrance ? { opacity: 1, y: 0 } : undefined}
      whileInView={entrance ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 0.68, 0.24, 1] }}
    >
      {children}
    </motion.div>
  );
}
