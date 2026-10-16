"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
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
}: {
  media: ProjectMedia[];
  title: string;
}) {
  const [viewportRef, embla] = useEmblaCarousel({
    loop: false,
    watchDrag: media.length > 1,
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
      <div className="gallery-empty">
        <MediaPlaceholder title={title} />
      </div>
    );

  return (
    <div
      className="project-gallery"
      role="region"
      aria-label={`${title} gallery`}
      aria-roledescription={media.length > 1 ? "carousel" : undefined}
      aria-busy={media.length > 1 && !embla}
    >
      <div
        className="gallery-viewport"
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
                  sizes="(max-width: 1280px) 100vw, 1184px"
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
