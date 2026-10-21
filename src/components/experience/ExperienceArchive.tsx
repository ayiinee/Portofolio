"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { ExperienceRecord } from "@/data/experience";
import { ExperienceDialog } from "./ExperienceDialog";
import { ExperiencePhotoEmpty } from "./ExperiencePhotoEmpty";

export const INITIAL_EXPERIENCE_COUNT = 3;

export function ExperienceArchive({
  items,
  initialCount = INITIAL_EXPERIENCE_COUNT,
}: {
  items: ExperienceRecord[];
  initialCount?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<ExperienceRecord | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const listId = useId();
  const count = Math.max(1, Math.floor(initialCount));
  const visibleItems = expanded ? items : items.slice(0, count);

  function open(item: ExperienceRecord, button: HTMLButtonElement) {
    trigger.current = button;
    setSelected(item);
  }

  return (
    <>
      <div className="experience-archive">
        <div className="experience-archive-tab">EXPERIENCE ARCHIVE</div>
        <ol className="experience-list" id={listId}>
          {visibleItems.map((item) => (
            <li className="experience-row" key={item.id}>
              <div className="experience-date">
                <span className="experience-year">{item.year}</span>
                <p>
                  {item.period.split(" – ")[0]} –<br />
                  {" "}{item.period.split(" – ")[1]}
                </p>
              </div>
              <div className="experience-copy">
                <h3>{item.role}</h3>
                {item.course && <p className="experience-course">{item.course}</p>}
                <p className="experience-organization">{item.organization}</p>
                <ul className="experience-summary">
                  {item.contributions.map((text) => <li key={text}>{text}</li>)}
                </ul>
              </div>
              <div className="experience-preview">
                <button
                  type="button"
                  className="experience-thumbnail"
                  aria-label={`View photos and details: ${item.role}${item.course ? ` — ${item.course}` : ""}`}
                  aria-haspopup="dialog"
                  onClick={(event) => open(item, event.currentTarget)}
                >
                  {item.gallery?.[0] ? (
                    <Image src={item.gallery[0].src} width={item.gallery[0].width} height={item.gallery[0].height} alt={item.gallery[0].alt} sizes="(max-width: 600px) 220px, 170px" />
                  ) : <ExperiencePhotoEmpty compact />}
                </button>
                <button
                  type="button"
                  className="experience-detail-link"
                  aria-haspopup="dialog"
                  onClick={(event) => open(item, event.currentTarget)}
                >
                  View details <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      </div>
      {items.length > count && (
        <div className="experience-expand-wrap">
          <button
            type="button"
            className="experience-expand"
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show less" : "Show more"}
            <ChevronDown size={17} aria-hidden="true" />
          </button>
        </div>
      )}
      {selected && (
        <ExperienceDialog
          key={selected.id}
          item={selected}
          onClose={() => setSelected(null)}
          triggerRef={trigger}
        />
      )}
    </>
  );
}
