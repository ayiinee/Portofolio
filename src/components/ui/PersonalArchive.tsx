import Image from "next/image";
import Link from "next/link";
import { Folder } from "lucide-react";
import { archiveCards } from "@/data/archive";
import type { CSSProperties } from "react";

function EditorialBackgroundText() {
  return (
    <span className="archive-wordmark" aria-hidden="true">
      {Array.from("PORTFOLIO").map((letter, index) => {
        const distance = index - 4;
        return (
          <span
            key={index}
            style={{
              "--letter-rise": `${distance * distance * 0.15}cqw`,
              "--letter-angle": `${distance * 0.75}deg`,
            } as CSSProperties}
          >
            {letter}
          </span>
        );
      })}
    </span>
  );
}

// Two joined halves form ONE orbit. The lower return crosses in front of the
// photos and folder; the outward arc passes behind them. Endpoints must match.
const orbitSegments = {
  back: "M100 408C10 376 36 254 154 159C304 37 590 15 723 96C836 165 785 330 640 398",
  front: "M640 398C465 575 216 505 100 408",
};

function TerracottaOrbitLine({ layer }: { layer: "back" | "front" }) {
  return (
    <svg className={`archive-orbit archive-orbit-${layer}`} viewBox="0 0 800 680" fill="none" aria-hidden="true" focusable="false">
      <path
        className="archive-orbit-path"
        d={orbitSegments[layer]}
        pathLength="1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="1"
        strokeDashoffset="0"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function FolderFront() {
  return (
    <div className="archive-front-panel">
      <div className="archive-pocket" aria-hidden="true" />
      <Image className="archive-pocket-edge" src="/images/design/archive-front-edge.svg" alt="" width={800} height={440} unoptimized />
      <div className="archive-folder-label" aria-hidden="true">
        <Folder size={29} strokeWidth={1.3} />
        <p>Personal Archive</p>
        <span>SELECTED WORKS</span>
      </div>
      <span className="archive-folder-note" aria-hidden="true">DESIGN / DEVELOPMENT / IDEAS</span>
    </div>
  );
}

export function PersonalArchive() {
  return (
    <div className="archive-visual" role="group" aria-label="Personal Archive: a folder of selected work and interface studies">
      <EditorialBackgroundText />
      <TerracottaOrbitLine layer="back" />
      <div className="archive-object">
        <div className="archive-back" aria-hidden="true" />
        <div className="archive-cards">
          {archiveCards.map((card, index) => (
            <div className={`archive-card-position archive-card-${index + 1}`} key={card.title}>
              <div className="archive-card-motion">
                <Link href={card.href} className="archive-photo" aria-label={card.label}>
                  <div className="archive-photo-meta"><span>0{index + 1}</span><span>{card.category}</span></div>
                  <div className="archive-photo-image">
                    <Image src={card.image} alt={card.alt} fill sizes="(max-width: 600px) 29vw, (max-width: 900px) 180px, 210px" />
                  </div>
                  <p className="archive-photo-title">{card.title}</p>
                  <span className="archive-photo-caption">{card.caption}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <FolderFront />
      </div>
      <TerracottaOrbitLine layer="front" />
    </div>
  );
}
