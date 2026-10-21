"use client";

import { useEffect, useId, useRef, type RefObject } from "react";
import { X } from "lucide-react";
import type { ExperienceRecord } from "@/data/experience";
import { ExperienceGallery } from "./ExperienceGallery";

export function ExperienceDialog({ item, onClose, triggerRef }: {
  item: ExperienceRecord;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const body = document.body;
    const root = document.documentElement;
    const scrollY = window.scrollY;
    const trigger = triggerRef.current;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: root.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    const scrollbar = window.innerWidth - root.clientWidth;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbar > 0) {
      body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbar}px`;
    }
    root.style.overflow = "hidden";
    element.showModal();

    return () => {
      element.close();
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.paddingRight = previous.paddingRight;
      root.style.overflow = previous.overflow;
      window.scrollTo({ top: scrollY, behavior: "instant" });
      trigger?.focus({ preventScroll: true });
    };
  }, [triggerRef]);

  return (
    <dialog
      ref={dialog}
      className="experience-dialog"
      aria-labelledby={titleId}
      data-lenis-prevent
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        )).filter((element) => !element.closest("[inert]") && element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      <div className="experience-dialog-top">
        <p>EXPERIENCE DETAIL</p>
        <button type="button" className="experience-close" aria-label="Close experience details" onClick={onClose} autoFocus>
          <X size={23} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
      <div className="experience-dialog-content">
        <header className="experience-dialog-heading">
          <h3 id={titleId}>{item.role}{item.course && <span>{item.course}</span>}</h3>
          <p>{item.organization}</p>
          <p>{item.period}</p>
        </header>
        <ExperienceGallery photos={item.gallery ?? []} title={item.course ?? item.role} />
        <div className="experience-contributions">
          <h4>Role &amp; contributions</h4>
          <ul>{item.contributions.map((text) => <li key={text}>{text}</li>)}</ul>
        </div>
        <div className="experience-dialog-footer">
          <button type="button" className="experience-dismiss" onClick={onClose}>Close</button>
        </div>
      </div>
    </dialog>
  );
}
