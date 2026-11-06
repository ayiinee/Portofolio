"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { motion as m } from "motion/react";
import type { MobileShowcase as ShowcaseConfig, ProjectMedia, ShowcaseScreen } from "@/types/project";
import { PhoneStage } from "./PhoneStage";
import { showcaseStyle } from "./ShowcaseVisual";
import { ShowcaseComposition } from "./ShowcaseComposition";
import { FlatMockups } from "./FlatMockups";
import styles from "./MobileShowcase.module.css";

const MediaLightbox = dynamic(() => import("./MediaLightbox"), { ssr: false });

const subscribeMotion = (callback: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const motionSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const motionServerSnapshot = () => true;
const subscribeVisibility = (callback: () => void) => {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
};
const visibilitySnapshot = () => document.visibilityState === "visible";
const visibilityServerSnapshot = () => false;

export function MobileShowcase({ showcase, title }: { showcase: ShowcaseConfig; title: string }) {
  const slides = useMemo(() => [showcase.hero, ...showcase.slides], [showcase]);
  const screenGroups = useMemo(() => slides.map(slide => slide.screenIds.map(id => showcase.screens.find(screen => screen.id === id)).filter((screen): screen is ShowcaseScreen => !!screen)), [slides, showcase.screens]);
  const media = useMemo(() => showcase.screens.flatMap(screen => screen.media ? [screen.media] : []).filter((item, index, items) => items.findIndex(other => other.src === item.src) === index), [showcase.screens]);
  const [selected, setSelected] = useState(0);
  const [unavailable, setUnavailable] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [settling, setSettling] = useState(false);
  const [visible, setVisible] = useState(false);
  const pageVisible = useSyncExternalStore(subscribeVisibility, visibilitySnapshot, visibilityServerSnapshot);
  const [lightbox, setLightbox] = useState<{ index: number; open: boolean } | null>(null);
  const trigger = useRef<HTMLElement | null>(null), frame = useRef<HTMLDivElement | null>(null);
  const viewportId = useId(), motion = useSyncExternalStore(subscribeMotion, motionSnapshot, motionServerSnapshot);
  const [viewportRef, embla] = useEmblaCarousel({
    loop: slides.length > 1,
    watchDrag: (_api, event) => !(event.target instanceof Element && event.target.closest("[data-phone-rotation]")),
    duration: motion ? 0 : 32,
  });
  const playing = !!embla && motion === false && visible && pageVisible && !paused && !hovered && !focused && !dragging && !settling && !lightbox;
  const attachViewport = useCallback((node: HTMLDivElement | null) => {
    // Apply horizontal layout before Embla measures; SSR stays stacked without JS.
    if (node) node.dataset.carousel = "true";
    viewportRef(node);
  }, [viewportRef]);
  useEffect(() => {
    if (!embla) return;
    const select = () => { setSelected(embla.selectedScrollSnap()); setUnavailable(false); setDragging(false); };
    const scroll = () => setSettling(true);
    const settle = () => setSettling(false);
    embla.on("select", select);
    embla.on("scroll", scroll);
    embla.on("settle", settle);
    return () => { embla.off("select", select); embla.off("scroll", scroll); embla.off("settle", settle); };
  }, [embla]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.intersectionRatio >= .25), { threshold: [0, .25, .5] });
    observer.observe(frame.current!);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => embla?.scrollNext(), 6500);
    return () => window.clearTimeout(timer);
  }, [playing, selected, embla]);
  const onUnavailable = useCallback(() => { setUnavailable(true); setDragging(false); }, []);
  const onDragChange = useCallback((value: boolean) => setDragging(value), []);
  function enlarge(item: ProjectMedia, button: HTMLElement) {
    trigger.current = button; setLightbox({ index: media.findIndex(other => other.src === item.src), open: true });
  }
  return <section className={styles.showcase} style={showcaseStyle(showcase.theme)} data-enhanced={embla ? "true" : undefined} data-playing={playing} data-selected={selected} aria-label={`${title} app showcase`} aria-roledescription={embla ? "carousel" : undefined}
    onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
    onPointerLeave={event => { if (event.pointerType === "mouse") setHovered(false); }}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className={styles.frame} ref={frame}>
    <div className={styles.viewport} ref={attachViewport} id={viewportId} tabIndex={embla ? 0 : undefined}
      aria-label="Project slides. Use left and right arrow keys to browse. Space pauses or plays the slideshow."
      onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowLeft") { event.preventDefault(); embla?.scrollPrev(); }
        if (event.key === "ArrowRight") { event.preventDefault(); embla?.scrollNext(); }
        if (event.key === " ") { event.preventDefault(); setPaused(value => !value); }
      }}>
      <div className={styles.track}>
        {slides.map((slide, index) => {
          const hero = slide.layout === "hero", screens = screenGroups[index];
          return <article className={styles.slide} key={slide.id}
            data-slide={slide.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}: ${hero ? title : slide.eyebrow}`} inert={embla && index !== selected ? true : undefined}>
            <ShowcaseComposition showcase={showcase} slide={slide} title={title}
              actions={<>{screens.some(screen => !screen.media) && <p className={styles.placeholderNote}>App screenshots coming soon · Mockup preview</p>}{screens.some(screen => screen.media) && <div className={styles.screenLinks}>{screens.filter(screen => screen.media).map(screen => <button type="button" key={screen.id} onClick={event => enlarge(screen.media!, event.currentTarget)}><Expand size={12} /> View {screen.label}</button>)}</div>}</>}
              >
              {hero ? <PhoneStage slide={slide} screens={screens} title={title} active={visible && pageVisible} onUnavailable={onUnavailable} onDragChange={onDragChange} /> : <FlatMockups showcase={showcase} slide={slide} />}
            </ShowcaseComposition>
          </article>;
        })}
      </div>
    </div>
    <div className={styles.arrowControls} role="group" aria-label="Browse project slides">
      <button className={`${styles.glassArrow} ${styles.previous}`} type="button" aria-label="Previous slide" aria-controls={viewportId} disabled={!embla || slides.length < 2} onClick={() => embla?.scrollPrev()}><ChevronLeft size={20} aria-hidden="true" /></button>
      <button className={`${styles.glassArrow} ${styles.next}`} type="button" aria-label="Next slide" aria-controls={viewportId} disabled={!embla || slides.length < 2} onClick={() => embla?.scrollNext()}><ChevronRight size={20} aria-hidden="true" /></button>
    </div>
    <div className={styles.navigation} role="group" aria-label="Project slide navigation">
      {slides.map((slide, index) => <button className={styles.dash} type="button" key={slide.id} aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`} aria-current={index === selected ? "true" : undefined} aria-controls={viewportId} disabled={!embla} onClick={() => embla?.scrollTo(index)}><m.span initial={false} animate={{ width: index === selected ? 26 : 7, opacity: index === selected ? 1 : .6 }} transition={motion ? { duration: 0 } : { type: "spring", stiffness: 430, damping: 34 }} /></button>)}
    </div>
    </div>
    <p className={styles.srOnly} role="status" aria-live={playing ? "off" : "polite"}>{unavailable ? "3D unavailable · showing preview" : `Slide ${selected + 1} of ${slides.length}`}</p>
    {lightbox && <MediaLightbox media={media} index={lightbox.index} open={lightbox.open} close={() => setLightbox(value => value ? { ...value, open: false } : null)} exited={() => { setLightbox(null); trigger.current?.focus(); }} />}
  </section>;
}
