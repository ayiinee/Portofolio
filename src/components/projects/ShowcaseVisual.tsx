import Image from "next/image";
import type { CSSProperties } from "react";
import type { MobileShowcase, ShowcaseScreen, ShowcaseSlide } from "@/types/project";
import styles from "./MobileShowcase.module.css";
import { ShowcaseComposition } from "./ShowcaseComposition";

export function showcaseStyle(theme: MobileShowcase["theme"]): CSSProperties {
  return {
    "--showcase-primary": theme.primary,
    "--showcase-secondary": theme.secondary,
    "--showcase-surface": theme.surface,
    "--showcase-ink": theme.ink,
    "--showcase-on-primary": theme.onPrimary,
    "--showcase-accent": theme.accent ?? "#ffce58",
    "--showcase-overlay": Math.max(0, Math.min(1, theme.overlayOpacity)),
  } as CSSProperties;
}

export function ShowcasePoster({ slide, screens, title, preload = false }: { slide: ShowcaseSlide; screens: ShowcaseScreen[]; title: string; preload?: boolean }) {
  if (slide.poster) return <Image className={styles.poster} src={slide.poster} alt="" fill sizes="(max-width: 760px) 90vw, 600px" preload={preload} />;
  return <div className={styles.fallbackDevices} aria-hidden="true">
    {screens.slice(0, 2).map(screen => <div className={styles.fallbackPhone} key={screen.id}>
      {screen.media ? <Image src={screen.media.src} alt="" fill sizes="240px" /> : <span><small>SCREENSHOT PLACEHOLDER</small><strong>{title}</strong>{screen.label}<small>Original screen coming soon</small></span>}
    </div>)}
  </div>;
}

export function ShowcaseCover({ showcase, title }: { showcase: MobileShowcase; title: string }) {
  const screens = showcase.hero.screenIds.map(id => showcase.screens.find(screen => screen.id === id)).filter((screen): screen is ShowcaseScreen => !!screen);
  return <div aria-hidden="true">
    <ShowcaseComposition showcase={showcase} slide={showcase.hero} title={title} cover>
      <ShowcasePoster slide={showcase.hero} screens={screens} title={title} />
    </ShowcaseComposition>
  </div>;
}
