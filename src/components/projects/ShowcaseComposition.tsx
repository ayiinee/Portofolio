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

export function ShowcaseComposition({ showcase, slide, title, children, actions, longScreen, cover = false }: {
  showcase: MobileShowcase; slide: ShowcaseSlide; title: string; children: ReactNode;
  actions?: ReactNode; longScreen?: ReactNode; cover?: boolean;
}) {
  const hero = slide.layout === "hero", composition = showcase.composition;
  const wordmark = composition?.wordmark ?? title;
  const prefix = title.endsWith(wordmark) ? title.slice(0, title.length - wordmark.length) : "";
  const Heading = cover ? "strong" : "h1";
  const crop = composition?.logoCrop;
  const logoStyle: CSSProperties | undefined = crop && showcase.logo ? {
    width: `${showcase.logo.width / crop.width * 100}%`, left: `${-crop.x / crop.width * 100}%`, top: `${-crop.y / crop.height * 100}%`,
  } : undefined;
  const layerStyle = composition ? {
    "--band-top": `${composition.band.top}%`, "--band-height": `${composition.band.height}%`,
    "--band-bottom": `${100 - composition.band.top - composition.band.height}%`,
    "--news-start": `${composition.band.newspaperStart}%`,
    "--band-from": composition.band.from, "--band-to": composition.band.to,
    "--photo-opacity": composition.photoOpacity, "--photo-wash": composition.whiteOverlay, "--news-opacity": composition.newspaperOpacity,
  } as CSSProperties : undefined;
  const style = { "--showcase-primary": showcase.theme.primary, "--showcase-secondary": showcase.theme.secondary, "--showcase-surface": showcase.theme.surface, "--showcase-ink": showcase.theme.ink, "--showcase-on-primary": showcase.theme.onPrimary, "--showcase-accent": showcase.theme.accent ?? "#ffce58", ...layerStyle } as CSSProperties;
  return <div className={`${styles.canvas} ${poppins.variable} ${hero ? styles.heroCanvas : styles.featureCanvas} ${hero && composition ? styles.canvaCanvas : ""}`} style={style} data-composition={hero && composition ? "layered" : "feature"}>
    {hero && composition && <div className={styles.backgroundLayers} aria-hidden="true">
      <Image className={styles.cityLayer} src={composition.background.src} fill alt="" sizes="(max-width: 760px) 100vw, 1152px" />
      <span className={styles.whiteWash} />
      <span className={styles.colorBand} />
      <Image className={styles.newsLayer} src={composition.background.src} fill alt="" sizes="(max-width: 760px) 100vw, 1152px" />
    </div>}
    {hero ? <>
      {showcase.logo && <div className={`${styles.brandSymbol} ${crop ? styles.croppedSymbol : ""}`} aria-hidden="true">
        <Image src={showcase.logo.src} width={showcase.logo.width} height={showcase.logo.height} style={logoStyle} alt="" sizes="20vw" />
      </div>}
      <Heading className={styles.wordmark} aria-label={title}><span className={styles.srOnly}>{prefix}</span>{wordmark}</Heading>
      <p className={styles.brandTagline}>{slide.title}</p>
      <p className={styles.heroHeadline}>{slide.headline ? slide.headline.map((line, index) => <span className={styles.headlineLine} key={index}>{line.map((run, runIndex) => run.emphasis ? <em key={runIndex}>{run.text}</em> : <span key={runIndex}>{run.text}</span>)}</span>) : slide.description}</p>
      <div className={styles.heroActions}>{actions}</div>
    </> : <div className={styles.featureCopy}>
      <p className={styles.eyebrow}>{slide.eyebrow}</p>
      <h2>{slide.title}</h2>
      <p className={styles.description}>{slide.description}</p>
      {!!slide.annotations?.length && <ul className={styles.annotations}>{slide.annotations.map(note => <li key={note}>{note}</li>)}</ul>}
      {actions}
    </div>}
    <div className={`${styles.visual} ${hero ? styles.heroVisual : ""} ${slide.layout === "scroll" ? styles.scrollVisual : ""}`}>
      <div className={styles.deviceSlot}>{children}</div>
      {longScreen && <div className={styles.longSlot}>{longScreen}</div>}
    </div>
  </div>;
}
