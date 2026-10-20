"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

export function KeycapLink({ kind }: { kind: "a" | "enter" }) {
  const [keyboardPressed, setKeyboardPressed] = useState(false);
  const reducedMotion = useReducedMotion();
  const isAbout = kind === "a";

  return (
    <motion.a
      href={isAbout ? "#about" : "#projects"}
      className={`intro-keycap intro-keycap-${kind}`}
      aria-label={isAbout ? "About me" : "View my projects"}
      animate={keyboardPressed ? "pressed" : "rest"}
      whileTap="pressed"
      onKeyDown={(event) => { if (event.key === "Enter") setKeyboardPressed(true); }}
      onKeyUp={() => setKeyboardPressed(false)}
      onBlur={() => setKeyboardPressed(false)}
      onPointerCancel={() => setKeyboardPressed(false)}
    >
      <motion.span className="intro-keycap-face" variants={{
        rest: { y: 0, transition: { type: "spring", duration: 0.22, bounce: 0.12 } },
        pressed: { y: reducedMotion ? 0 : 4, transition: { type: "tween", duration: 0.08 } },
      }}>
        <Image
          src={isAbout ? "/images/design/a-keycap.png" : "/images/design/return-keycap.png"}
          alt="" width={1254} height={1254} unoptimized aria-hidden="true"
        />
      </motion.span>
    </motion.a>
  );
}
