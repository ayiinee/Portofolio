"use client";

import { useEffect, useId, useRef, type RefObject } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import type { AchievementRecord } from "@/data/achievements";

export function AchievementDialog({ item, onClose, triggerRef }: {
  item: AchievementRecord;
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
    const position = window.scrollY;
    const trigger = triggerRef.current;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, paddingRight: body.style.paddingRight, overflow: root.style.overflow };
    const scrollbar = window.innerWidth - root.clientWidth;
    body.style.position = "fixed";
    body.style.top = `-${position}px`;
    body.style.width = "100%";
    if (scrollbar > 0) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbar}px`;
    root.style.overflow = "hidden";
    element.showModal();
    return () => {
      element.close();
      Object.assign(body.style, { position: previous.position, top: previous.top, width: previous.width, paddingRight: previous.paddingRight });
      root.style.overflow = previous.overflow;
      window.scrollTo({ top: position, behavior: "instant" });
      trigger?.focus({ preventScroll: true });
    };
  }, [triggerRef]);

  return (
    <dialog ref={dialog} className="achievement-dialog" aria-labelledby={titleId} data-lenis-prevent
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]')).filter((node) => node.getClientRects().length > 0);
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}>
      <div className="achievement-dialog-bar">
        <span>{item.category}</span>
        <button className="achievement-control" type="button" aria-label="Close achievement details" onClick={onClose} autoFocus><X size={20} aria-hidden="true" /></button>
      </div>
      <div className="achievement-dialog-body">
        <p className="achievement-distinction">{item.distinction}</p>
        <h3 id={titleId}>{item.title}</h3>
        <p className="achievement-byline">{[item.issuer, item.year].filter(Boolean).join(" · ")}</p>
        {item.media && <Image className="achievement-document" {...item.media} alt={item.media.alt} sizes="(max-width: 700px) 90vw, 600px" />}
        <p className="achievement-summary">{item.summary}</p>
        {item.referenceNumber && <dl className="achievement-reference"><dt>{item.url?.startsWith("https://doi.org/") ? "DOI" : "Reference number"}</dt><dd>{item.referenceNumber}</dd></dl>}
        <div className="achievement-dialog-actions">
          {item.url && <a className="achievement-details" href={item.url} target="_blank" rel="noopener noreferrer">Open source <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}
          <button type="button" className="achievement-details" onClick={onClose}>Close</button>
        </div>
      </div>
    </dialog>
  );
}
