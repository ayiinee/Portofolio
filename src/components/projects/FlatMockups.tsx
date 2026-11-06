import Image from "next/image";
import type { MobileShowcase, ShowcaseScreen, ShowcaseSlide } from "@/types/project";
import styles from "./MobileShowcase.module.css";

function ScreenContent({ screen }: { screen?: ShowcaseScreen }) {
  return screen?.media ? <Image src={screen.media.src} alt={screen.media.alt} width={screen.media.width} height={screen.media.height} sizes="(max-width: 760px) 28vw, 320px" /> : <div className={styles.screenPlaceholder}>
    <small>SCREEN PREVIEW</small>
    <strong>{screen?.label ?? "App screen"}</strong>
    <span>Screenshot placeholder</span>
  </div>;
}

/** Front-facing editorial mockups. These slides never create a WebGL scene. */
export function FlatMockups({ showcase, slide }: { showcase: MobileShowcase; slide: ShowcaseSlide }) {
  const find = (id?: string) => showcase.screens.find(screen => screen.id === id);
  const primary = find(slide.screenIds[0]);
  const detail = find(slide.detailScreenId ?? slide.screenIds[1]);
  const secondary = find(slide.secondaryScreenId);
  return <div className={styles.flatMockups} data-flat-mockups={slide.layout}>
    <figure className={`${styles.flatPhone} ${styles.primaryPhone}`} data-mockup="primary">
      <div className={styles.flatDisplay}><ScreenContent screen={primary} /></div>
      <figcaption className={styles.mockupCaption}>{primary?.label}</figcaption>
    </figure>
    <figure className={styles.detailStrip} data-mockup="detail">
      <ScreenContent screen={detail} />
      <figcaption className={styles.mockupCaption}>{detail?.label ?? "Detail screen"}</figcaption>
    </figure>
    {slide.layout === "comparison" && <figure className={`${styles.flatPhone} ${styles.secondaryPhone}`} data-mockup="secondary">
      <div className={styles.flatDisplay}><ScreenContent screen={secondary} /></div>
      <figcaption className={styles.mockupCaption}>{secondary?.label ?? "Supporting screen"}</figcaption>
    </figure>}
  </div>;
}
