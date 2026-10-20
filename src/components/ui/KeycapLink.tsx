"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

export function KeycapLink({ kind }: { kind: "a" | "enter" }) {
  const [keyboardPressed, setKeyboardPressed] = useState(false);
  const [pointerPressed, setPointerPressed] = useState(false);
  const reducedMotion = useReducedMotion();
  const isAbout = kind === "a";
  const pressed = keyboardPressed || pointerPressed;
  const image = (
    <Image
      src={isAbout ? "/images/design/a-keycap.png" : "/images/design/return-keycap-upright.png"}
      alt="" width={isAbout ? 1254 : 1536} height={isAbout ? 1254 : 1024}
      unoptimized aria-hidden="true" draggable={false}
    />
  );

  return (
    <motion.a
      href={isAbout ? "#about" : "#projects"}
      className={`intro-keycap intro-keycap-${kind}`}
      aria-label={isAbout ? "About me" : "View my projects"}
      data-pressed={pressed}
      animate={pressed ? "pressed" : "rest"}
      onPointerDown={(event) => { if (event.button === 0) setPointerPressed(true); }}
      onPointerUp={() => setPointerPressed(false)}
      onPointerLeave={() => setPointerPressed(false)}
      onPointerCancel={() => setPointerPressed(false)}
      onKeyDown={(event) => {
        if (event.key !== "Enter" || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
        event.preventDefault();
        setKeyboardPressed(true);
      }}
      onKeyUp={(event) => {
        if (event.key !== "Enter" || !keyboardPressed) return;
        event.preventDefault();
        setKeyboardPressed(false);
        event.currentTarget.click();
      }}
      onBlur={() => { setKeyboardPressed(false); setPointerPressed(false); }}
    >
      {!isAbout && <span className="intro-keycap-base" aria-hidden="true">{image}</span>}
      <motion.span className="intro-keycap-face" variants={{
        rest: { y: 0, transition: { type: "spring", stiffness: 500, damping: 22 } },
        pressed: { y: reducedMotion ? 0 : (isAbout ? 4 : "2.5%"), transition: { type: "tween", duration: reducedMotion ? 0 : 0.07 } },
      }}>
        {image}
      </motion.span>
    </motion.a>
  );
}
