"use client";

import { useEffect, useId, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Maximize2 } from "lucide-react";
import type { ProjectMedia } from "@/types/project";
import { MediaPlaceholder } from "./MediaPlaceholder";

const MediaLightbox = dynamic(() => import("./MediaLightbox"), { ssr: false });

function caption(item: ProjectMedia) {
  const provenance =
    item.provenance === "competition-provided"
      ? "Competition-provided architecture reference."
      : item.provenance === "reconstructed"
        ? "Reconstructed later for explanation."
        : "";
  return [item.caption, provenance].filter(Boolean).join(" ");
}

export function ProjectGallery({
  media,
  title,
  variant = "inline",
  category,
}: {
  media: ProjectMedia[];
  title: string;
  variant?: "inline" | "hero";
  category?: string;
}) {
  const viewportId = useId();
  const reducedMotion = useReducedMotion();
  const [viewportRef, embla] = useEmblaCarousel({
    loop: false,
    watchDrag: media.length > 1,
    duration: reducedMotion ? 0 : 25,
  });
  const [selected, setSelected] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect).on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect).off("reInit", onSelect);
    };
  }, [embla]);

  if (!media.length)
    return (
      <div className={`gallery-empty${variant === "hero" ? " project-gallery--hero" : ""}`}>
        <MediaPlaceholder title={title} category={category} showFullTitle={variant === "hero"} />
      </div>
    );

  return (
    <div
      className={`project-gallery${variant === "hero" ? " project-gallery--hero" : ""}`}
      role="region"
      aria-label={`${title} gallery`}
      aria-roledescription={media.length > 1 ? "carousel" : undefined}
      aria-busy={media.length > 1 && !embla}
    >
      <div
        className="gallery-viewport"
        id={viewportId}
        ref={viewportRef}
        tabIndex={media.length > 1 ? 0 : undefined}
        aria-label={
          media.length > 1
            ? "Use left and right arrow keys to browse images"
            : undefined
        }
        onKeyDown={(event) => {
          if (media.length < 2 || event.target !== event.currentTarget) return;
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            embla?.scrollPrev();
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            embla?.scrollNext();
          }
        }}
      >
        <div className="gallery-track">
          {media.map((item, index) => (
            <figure
              key={item.src}
              className="gallery-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${media.length}`}
              inert={index !== selected}
            >
              <button
                className="gallery-enlarge"
                type="button"
                aria-label={`Enlarge: ${item.alt}`}
                onClick={(event) => {
                  triggerRef.current = event.currentTarget;
                  setLightboxIndex(index);
                  setLightboxOpen(true);
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes={variant === "hero" ? "(max-width: 844px) calc(100vw - 44px), 800px" : "(max-width: 1280px) 100vw, 1184px"}
                  preload={variant === "hero" && index === 0}
                />
              </button>
            </figure>
          ))}
        </div>
      </div>
      <div className="gallery-controls">
        <div aria-live="polite">
          <p>
            {media.length > 1 && `${selected + 1} / ${media.length} — `}
            {caption(media[selected])}
          </p>
          <p className="gallery-hint">
            <Maximize2 size={12} aria-hidden="true" /> Select image to enlarge
          </p>
        </div>
        {media.length > 1 && (
          <div className="gallery-buttons">
            <button
              className="icon-button"
              type="button"
              aria-label="Previous image"
              disabled={!embla || selected === 0}
              onClick={() => embla?.scrollPrev()}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              className="icon-button"
              type="button"
              aria-label="Next image"
              disabled={!embla || selected === media.length - 1}
              onClick={() => embla?.scrollNext()}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
      {variant === "hero" && media.length > 1 && (
        <div className="gallery-thumbnails" role="group" aria-label="Choose a project image">
          {media.map((item, index) => (
            <button
              key={item.src}
              type="button"
              className="gallery-thumbnail"
              aria-label={`Show image ${index + 1}: ${item.alt}`}
              aria-current={index === selected ? "true" : undefined}
              aria-controls={viewportId}
              disabled={!embla}
              onClick={() => embla?.scrollTo(index)}
            >
              <Image src={item.src} width={item.width} height={item.height} alt="" sizes="80px" />
            </button>
          ))}
        </div>
      )}
      {lightboxIndex !== null && (
        <MediaLightbox
          media={media}
          index={lightboxIndex}
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          exited={() => {
            setLightboxIndex(null);
            triggerRef.current?.focus();
          }}
        />
      )}
    </div>
  );
}
