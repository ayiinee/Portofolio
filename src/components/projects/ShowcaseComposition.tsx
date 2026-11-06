import Image from "next/image";
import localFont from "next/font/local";
import type { CSSProperties, ReactNode } from "react";
import type { MobileShowcase, ShowcaseSlide } from "@/types/project";
import styles from "./MobileShowcase.module.css";

const poppins = localFont({
  src: [
    { path: "../../../public/fonts/poppins/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../../public/fonts/poppins/Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../../public/fonts/poppins/Poppins-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-showcase",
  display: "swap",
});

export function ShowcaseComposition({ showcase, slide, title, children, actions, cover = false }: {
  showcase: MobileShowcase; slide: ShowcaseSlide; title: string; children: ReactNode;
  actions?: ReactNode; cover?: boolean;
}) {
  const hero = slide.layout === "hero", composition = showcase.composition;
  const wordmark = composition?.wordmark ?? title;
  const prefix = title.endsWith(wordmark) ? title.slice(0, title.length - wordmark.length) : "";
  const Heading = cover ? "strong" : "h1";
  const crop = composition?.logoCrop;
  const logoStyle: CSSProperties | undefined = crop && showcase.logo ? {
    width: `${showcase.logo.width / crop.width * 100}%`, left: `${-crop.x / crop.width * 100}%`, top: `${-crop.y / crop.height * 100}%`,
  } : undefined;
  const style = { "--showcase-primary": showcase.theme.primary, "--showcase-secondary": showcase.theme.secondary, "--showcase-surface": showcase.theme.surface, "--showcase-ink": showcase.theme.ink, "--showcase-on-primary": showcase.theme.onPrimary, "--showcase-accent": showcase.theme.accent ?? "#ffce58" } as CSSProperties;
  const photo = slide.backgroundPhoto ?? showcase.theme.backgroundPhoto ?? composition?.background.src;
  return <div className={`${styles.canvas} ${poppins.variable} ${hero ? styles.heroCanvas : styles.featureCanvas}`} style={style} data-composition={hero ? "hero" : slide.layout}>
    {photo && <div className={styles.backgroundLayers} data-photo-crop={photo === composition?.background.src ? "city" : undefined} aria-hidden="true">
      <Image className={styles.cityLayer} src={photo} fill alt="" sizes="(max-width: 760px) 100vw, 1152px" />
    </div>}
    <p className={styles.sectionLabel}>{hero ? "01. APP DESIGN" : slide.layout === "comparison" ? "02. APP DESIGN" : "03. APP DESIGN"}</p>
    {hero ? <>
      {showcase.brandLockup ? <>
        <Heading className={styles.brandLockup} aria-label={title}>
          <Image src={showcase.brandLockup.src} width={showcase.brandLockup.width} height={showcase.brandLockup.height} alt="" unoptimized />
        </Heading>
        <p className={styles.srOnly}>{slide.title}</p>
      </> : <>
      {showcase.logo && <div className={`${styles.brandSymbol} ${crop ? styles.croppedSymbol : ""}`} aria-hidden="true">
        <Image src={showcase.logo.src} width={showcase.logo.width} height={showcase.logo.height} style={logoStyle} alt="" sizes="20vw" />
      </div>}
      <Heading className={styles.wordmark} aria-label={title}><span className={styles.srOnly}>{prefix}</span>{wordmark}</Heading>
      <p className={styles.brandTagline}>{slide.title}</p>
      </>}
      <p className={styles.heroHeadline}>{slide.headline ? slide.headline.map((line, index) => <span className={styles.headlineLine} key={index}>{line.map((run, runIndex) => run.emphasis ? <em key={runIndex}>{run.text}</em> : <span key={runIndex}>{run.text}</span>)}</span>) : slide.description}</p>
      <div className={styles.heroActions}>{actions}</div>
    </> : <div className={styles.featureCopy}>
      <p className={styles.eyebrow}>{slide.eyebrow}</p>
      <h2>{slide.title}</h2>
      <p className={styles.description}>{slide.description}</p>
      {actions}
    </div>}
    <div className={`${styles.visual} ${hero ? styles.heroVisual : ""}`}>
      <div className={styles.deviceSlot}>{children}</div>
    </div>
    {!hero && !!slide.annotations?.length && <ul className={styles.annotations} aria-label="Screen annotations">{slide.annotations.slice(0, 2).map((note, index) => <li key={note} data-callout={index + 1}>{note}</li>)}</ul>}
  </div>;
}
