"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ExperiencePhoto } from "@/data/experience";
import { ExperiencePhotoEmpty } from "./ExperiencePhotoEmpty";

export function ExperienceGallery({ photos, title }: { photos: ExperiencePhoto[]; title: string }) {
  const reducedMotion = useReducedMotion();
  const [viewportRef, embla] = useEmblaCarousel({
    loop: false,
    watchDrag: photos.length > 1,
    duration: reducedMotion ? 0 : 25,
  });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect).on("reInit", onSelect);
    return () => { embla.off("select", onSelect).off("reInit", onSelect); };
  }, [embla]);

  if (!photos.length) {
    return <div className="experience-gallery-empty"><ExperiencePhotoEmpty /></div>;
  }

  return (
    <div className="experience-gallery" role="region" aria-label={`Photos of ${title}`} aria-roledescription={photos.length > 1 ? "carousel" : undefined}>
      <div
        className="experience-gallery-viewport"
        ref={viewportRef}
        tabIndex={photos.length > 1 ? 0 : undefined}
        aria-label={photos.length > 1 ? "Use the left or right arrow keys to browse photos" : undefined}
        onKeyDown={(event) => {
          if (photos.length < 2 || event.target !== event.currentTarget) return;
          if (event.key === "ArrowLeft") { event.preventDefault(); embla?.scrollPrev(); }
          if (event.key === "ArrowRight") { event.preventDefault(); embla?.scrollNext(); }
        }}
      >
        <div className="experience-gallery-track">
          {photos.map((photo, index) => (
            <figure className="experience-gallery-slide" key={`${photo.src}-${index}`} role="group" aria-roledescription={photos.length > 1 ? "slide" : undefined} aria-label={photos.length > 1 ? `${index + 1} of ${photos.length}` : undefined} aria-hidden={index !== selected} inert={index !== selected}>
              <Image src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} sizes="(max-width: 760px) 90vw, 680px" />
            </figure>
          ))}
        </div>
      </div>
      <div className="experience-gallery-controls">
        <div className="experience-gallery-caption" aria-live="polite" aria-atomic="true">
          {photos.length > 1 && <span>{selected + 1} / {photos.length}</span>}
          {photos[selected]?.caption && <p>{photos[selected].caption}</p>}
        </div>
        {photos.length > 1 && (
          <div className="experience-gallery-buttons">
            <button type="button" aria-label="Previous photo" disabled={!embla || selected === 0} onClick={() => embla?.scrollPrev()}><ArrowLeft size={18} aria-hidden="true" /></button>
            <button type="button" aria-label="Next photo" disabled={!embla || selected === photos.length - 1} onClick={() => embla?.scrollNext()}><ArrowRight size={18} aria-hidden="true" /></button>
          </div>
        )}
      </div>
    </div>
  );
}
