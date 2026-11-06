"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { achievementCategories, type AchievementCategory, type AchievementRecord } from "@/data/achievements";
import { AchievementDialog } from "./AchievementDialog";

type Filter = AchievementCategory | "All";
const filters: Filter[] = ["All", ...achievementCategories];
const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (callback: () => void) => {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const motionSnapshot = () => window.matchMedia(motionQuery).matches;
const serverMotionSnapshot = () => false;

export function AchievementCarousel({ items, showFilters = true }: { items: AchievementRecord[]; showFilters?: boolean }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [filterVersion, setFilterVersion] = useState(0);
  const filtered = useMemo(() => filter === "All" ? items : items.filter((item) => item.category === filter), [filter, items]);
  // Remount on filter changes so Embla and selection start together at item 1.
  // Closing a detail dialog preserves the current collection and selection.
  return (
    <div className="achievement-collection">
      {showFilters && <div className="achievement-filters" role="group" aria-label="Filter achievements">
        {filters.map((category) => <button key={category} type="button" aria-pressed={filter === category}
          onClick={() => { setFilter(category); setFilterVersion((version) => version + 1); }}>
          {category}<span>{category === "All" ? items.length : items.filter((item) => item.category === category).length}</span>
        </button>)}
      </div>}
      <Carousel key={`${filter}:${filterVersion}`} items={filtered} autoStart={filterVersion === 0} />
    </div>
  );
}

function Carousel({ items, autoStart }: { items: AchievementRecord[]; autoStart: boolean }) {
  // Match the server on hydration and react to preference changes at runtime.
  const reducedMotion = useSyncExternalStore(subscribeMotion, motionSnapshot, serverMotionSnapshot);
  const [viewportRef, embla] = useEmblaCarousel({ align: "center", loop: items.length > 2, containScroll: false, duration: reducedMotion ? 0 : 35, watchDrag: items.length > 1 });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(!autoStart);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [scrolling, setScrolling] = useState(false);
  const [detail, setDetail] = useState<AchievementRecord | null>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const scrollInputUntil = useRef(0);
  const ignoreScrollUntil = useRef(0);
  const viewportId = useId();
  const multiple = items.length > 1;
  const active = items[selected] ?? items[0];
  const rotating = !!embla && multiple && !reducedMotion && !paused && !hovered && visible && pageVisible && !scrolling && !detail;

  const advance = useCallback((direction: number) => {
    if (!embla || !multiple) return;
    if (direction > 0) {
      if (embla.canScrollNext()) embla.scrollNext(!!reducedMotion);
      else embla.scrollTo(0, !!reducedMotion);
    } else {
      if (embla.canScrollPrev()) embla.scrollPrev(!!reducedMotion);
      else embla.scrollTo(items.length - 1, !!reducedMotion);
    }
  }, [embla, multiple, reducedMotion, items.length]);

  useEffect(() => {
    if (!embla) return;
    const sync = () => setSelected(embla.selectedScrollSnap());
    // Measure the untransformed slide wrappers, including Embla's public loop
    // positioning. Only inner cards receive perspective, preserving drag math.
    const paint = () => {
      const root = embla.rootNode().getBoundingClientRect();
      const center = root.left + root.width / 2;
      embla.slideNodes().forEach((slide) => {
        const box = slide.getBoundingClientRect();
        const offset = (box.left + box.width / 2 - center) / box.width;
        const distance = Math.min(Math.abs(offset), 3);
        const panel = slide.firstElementChild as HTMLElement | null;
        if (!panel) return;
        panel.style.transform = reducedMotion ? "none" : `translateX(${-offset * 42}px) rotateY(${Math.max(-32, Math.min(32, -offset * 26))}deg) scale(${1 - Math.min(distance * 0.105, 0.25)})`;
        panel.style.opacity = `${Math.max(0.18, 1 - distance * 0.2)}`;
        slide.style.zIndex = `${Math.max(0, 10 - Math.round(distance * 3))}`;
      });
    };
    const initialize = () => { sync(); paint(); };
    const stop = () => setPaused(true);
    initialize();
    embla.on("select", sync).on("scroll", paint).on("reInit", initialize).on("resize", paint).on("pointerDown", stop);
    return () => { embla.off("select", sync).off("scroll", paint).off("reInit", initialize).off("resize", paint).off("pointerDown", stop); };
  }, [embla, reducedMotion]);

  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.intersectionRatio >= 0.5), { threshold: [0, 0.5, 1] });
    observer.observe(node);
    const visibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => advance(1), 5000);
    return () => window.clearTimeout(timer);
  }, [rotating, selected, advance]);

  useEffect(() => {
    if (!embla || reducedMotion || !multiple || paused || !visible || !pageVisible || detail) return;
    let lastY = window.scrollY;
    let accumulated = 0;
    let lastStep = -Infinity;
    let direction = 0;
    let quietTimer: ReturnType<typeof setTimeout> | undefined;
    const input = () => { scrollInputUntil.current = performance.now() + 1200; };
    const keyInput = (event: KeyboardEvent) => {
      if (["PageDown", "PageUp", "ArrowDown", "ArrowUp", " "].includes(event.key) && !(event.target instanceof HTMLElement && event.target.closest("button, a, input, textarea, dialog"))) input();
    };
    const ignore = () => { ignoreScrollUntil.current = performance.now() + 1200; accumulated = 0; lastY = window.scrollY; };
    const anchor = (event: MouseEvent) => { if (event.target instanceof Element && event.target.closest('a[href*="#"]')) ignore(); };
    const scroll = () => {
      const now = performance.now();
      const delta = window.scrollY - lastY;
      lastY = window.scrollY;
      if (now > scrollInputUntil.current || now < ignoreScrollUntil.current || Math.abs(delta) > window.innerHeight * 0.8) { accumulated = 0; return; }
      setScrolling(true);
      clearTimeout(quietTimer);
      quietTimer = setTimeout(() => { setScrolling(false); accumulated = 0; }, 1500);
      if (Math.sign(delta) !== direction) accumulated = 0;
      direction = Math.sign(delta);
      accumulated += delta;
      if (Math.abs(accumulated) >= 140 && now - lastStep >= 450) {
        advance(Math.sign(accumulated));
        accumulated = 0;
        lastStep = now;
      }
    };
    window.addEventListener("wheel", input, { passive: true });
    window.addEventListener("touchmove", input, { passive: true });
    window.addEventListener("keydown", keyInput);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", ignore);
    window.addEventListener("hashchange", ignore);
    document.addEventListener("click", anchor, true);
    return () => {
      clearTimeout(quietTimer);
      setScrolling(false);
      window.removeEventListener("wheel", input); window.removeEventListener("touchmove", input);
      window.removeEventListener("keydown", keyInput); window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", ignore); window.removeEventListener("hashchange", ignore);
      document.removeEventListener("click", anchor, true);
    };
  }, [embla, reducedMotion, multiple, paused, visible, pageVisible, detail, advance]);

  const open = (item: AchievementRecord, button: HTMLButtonElement) => { setPaused(true); triggerRef.current = button; setDetail(item); };
  const close = () => { ignoreScrollUntil.current = performance.now() + 1200; setDetail(null); };
  const manual = (direction: number) => { setPaused(true); advance(direction); };

  if (!active) return <p className="achievement-empty">No achievements in this category yet.</p>;
  return (
    <div className="achievement-carousel" ref={surface} role="region" aria-roledescription="carousel" aria-label="Milestones and recognition"
      data-enhanced={!!embla} data-reduced-motion={!!reducedMotion} data-rotating={rotating}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => { if (!(event.target instanceof Element && event.target.closest("[data-rotation-control]"))) setPaused(true); }}>
      {/* Rotation remains accessible to keyboard/screen-reader users without a visual toolbar. */}
        <button className="sr-only achievement-rotation" data-rotation-control type="button" aria-controls={viewportId}
          aria-label={!paused && !reducedMotion ? "Pause automatic rotation" : "Start automatic rotation"}
          disabled={!embla || !multiple || !!reducedMotion}
          onClick={() => { setPaused((value) => !value); setScrolling(false); }}>
          {!paused && !reducedMotion ? "Pause automatic rotation" : "Start automatic rotation"}
        </button>
      <div className="achievement-stage" id={viewportId} ref={(node) => { viewport.current = node; viewportRef(node); }}
        tabIndex={embla && multiple ? 0 : undefined} aria-label="Use left and right arrow keys to browse achievements"
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); manual(event.key === "ArrowRight" ? 1 : -1); }
        }}>
        <div className="achievement-track">
          {items.map((item, index) => <div key={item.id} className="achievement-slide" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${items.length}`} aria-hidden={embla ? index !== selected : undefined}>
            <button className="achievement-card" data-category={item.category} data-active={index === selected} type="button"
              tabIndex={!embla || index === selected ? 0 : -1}
              aria-label={`${index === selected ? "View details" : "Show achievement"}: ${item.title}`}
              onClick={(event) => { setPaused(true); if (index === selected) open(item, event.currentTarget); else embla?.scrollTo(index, !!reducedMotion); }}>
              {item.media ? <Image className="achievement-card-media" {...item.media} alt={item.media.alt} sizes="(max-width: 700px) 78vw, 344px" /> : <>
                <span className="achievement-card-label">{item.category}{item.year && <time dateTime={String(item.year)}>{item.year}</time>}</span>
                <span className="achievement-card-distinction">{item.distinction}</span>
                <span className="achievement-card-title">{item.displayTitle}</span>
                {item.issuer && <span className="achievement-card-issuer">{item.issuer}</span>}
              </>}
            </button>
            <div className="achievement-fallback"><p>{item.title}</p><p>{item.summary}</p>{item.url && <a href={item.url}>Open source</a>}</div>
          </div>)}
        </div>
      </div>
      <p className="sr-only" aria-live={rotating ? "off" : "polite"} aria-atomic="true">{selected + 1} of {items.length}: {active.title}</p>
      {detail && <AchievementDialog item={detail} onClose={close} triggerRef={triggerRef} />}
    </div>
  );
}
