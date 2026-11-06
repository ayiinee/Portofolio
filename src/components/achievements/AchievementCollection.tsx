"use client";

import { useId, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { achievementCategories, type AchievementCategory, type AchievementRecord } from "@/data/achievements";
import { AchievementDialog } from "./AchievementDialog";

const subscribeHydration = () => () => {};
const clientHydration = () => true;
const serverHydration = () => false;
const pageSize = 6;

export function AchievementCollection({ items }: { items: AchievementRecord[] }) {
  const [filter, setFilter] = useState<AchievementCategory | "All">("All");
  const [page, setPage] = useState(0);
  const enhanced = useSyncExternalStore(subscribeHydration, clientHydration, serverHydration);
  const [detail, setDetail] = useState<AchievementRecord | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const resultsId = useId();
  const matching = filter === "All" ? items : items.filter((item) => item.category === filter);
  const pageCount = Math.ceil(matching.length / pageSize);
  const visible = enhanced ? matching.slice(page * pageSize, (page + 1) * pageSize) : matching;
  const changePage = (next: number) => {
    setPage(next);
    gridRef.current?.focus({ preventScroll: true });
    gridRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  };
  const open = (item: AchievementRecord, trigger: HTMLButtonElement) => { triggerRef.current = trigger; setDetail(item); };

  return (
    <div className="achievement-archive-collection" data-enhanced={enhanced}>
      <div className="achievement-archive-toolbar">
        <div className="achievement-archive-filters" role="group" aria-label="Filter achievements">
          {(["All", ...achievementCategories] as const).map((category) => <button key={category} type="button" aria-pressed={filter === category} aria-controls={resultsId} onClick={() => { setFilter(category); setPage(0); }}>
            {category}<span>{category === "All" ? items.length : items.filter((item) => item.category === category).length}</span>
          </button>)}
        </div>
        <p className="achievement-archive-count" role="status">{enhanced && matching.length > 0 && `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, matching.length)} of `}{matching.length} {matching.length === 1 ? "achievement" : "achievements"} <span aria-hidden="true">·</span> Newest first</p>
      </div>
      <div className="achievement-archive-grid" id={resultsId} ref={gridRef} role="group" aria-label="Achievement results" tabIndex={-1}>
        {visible.map((item) => <article key={item.id} className="achievement-archive-card" aria-labelledby={`archive-${item.id}`}>
          <button type="button" className="achievement-archive-preview" aria-label={`View document and details: ${item.displayTitle}`} onClick={(event) => open(item, event.currentTarget)}>
            {item.media ? <Image src={item.media.src} width={item.media.width} height={item.media.height} alt={item.media.alt} sizes="(max-width: 700px) calc(100vw - 48px), (max-width: 1000px) 45vw, 344px" /> : <span className="achievement-preview-missing"><ImageIcon size={28} strokeWidth={1.2} aria-hidden="true" /><span>Document preview not uploaded</span></span>}
          </button>
          <div className="achievement-archive-card-body">
            <p className="achievement-archive-meta"><span>{item.category}</span>{item.year && <time dateTime={String(item.year)}>{item.year}</time>}</p>
            <p className="achievement-archive-distinction">{item.distinction}</p>
            <h2 id={`archive-${item.id}`}>{item.displayTitle}</h2>
            {item.issuer && <p className="achievement-archive-issuer">{item.issuer}</p>}
            <details className="achievement-archive-fallback"><summary>Full record and source</summary><p>{item.title}</p>{item.referenceNumber && <p>Reference: {item.referenceNumber}</p>}{item.url && <a href={item.url}>Open source</a>}</details>
          </div>
        </article>)}
      </div>
      {enhanced && pageCount > 1 && <nav className="achievement-pagination" aria-label="Achievement pages">
        <button type="button" aria-label="Previous page" disabled={page === 0} aria-controls={resultsId} onClick={() => changePage(page - 1)}><ChevronLeft size={16} aria-hidden="true" /><span>Previous</span></button>
        <div className="achievement-page-numbers">
          {Array.from({ length: pageCount }, (_, index) => <button key={index} type="button" aria-label={`Page ${index + 1}`} aria-current={page === index ? "page" : undefined} aria-controls={resultsId} onClick={() => changePage(index)}>{index + 1}</button>)}
        </div>
        <button type="button" aria-label="Next page" disabled={page === pageCount - 1} aria-controls={resultsId} onClick={() => changePage(page + 1)}><span>Next</span><ChevronRight size={16} aria-hidden="true" /></button>
      </nav>}
      {!matching.length && <p className="achievement-archive-empty">No achievements in this category yet.</p>}
      {detail && <AchievementDialog item={detail} triggerRef={triggerRef} onClose={() => setDetail(null)} />}
    </div>
  );
}
