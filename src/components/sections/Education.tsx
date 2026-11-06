import { Reveal } from "@/components/animations/Reveal";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AchievementCarousel } from "@/components/achievements/AchievementCarousel";
import { achievementRecords } from "@/data/achievements";

export function Education() {
  return (
    <section
      id="education"
      className="achievement-section"
      aria-labelledby="achievement-heading"
    >
      <div className="achievement-frame">
        <Reveal className="achievement-introduction">
          <div className="achievement-title">
            <span className="achievement-outline" aria-hidden="true">ACHIEVEMENTS</span>
            <h2 id="achievement-heading">Milestones <em>&amp; recognition.</em></h2>
          </div>
          <p>Selected awards, credentials, and ideas shared along the way.</p>
        </Reveal>
        <AchievementCarousel items={achievementRecords.filter((item) => item.featuredOrder)} showFilters={false} />
        <div className="achievement-archive-action">
          <div className="achievement-archive-invitation">
            <p className="achievement-archive-kicker">Beyond the highlights</p>
            <h3>Discover the full collection.</h3>
            <p>Awards, credentials, and published ideas — each with a story to tell.</p>
          </div>
          <Link href="/achievements" className="achievement-all" aria-label={`Explore All ${achievementRecords.length} Achievements`}>
            <span className="achievement-all-count" aria-hidden="true">{achievementRecords.length}</span>
            <span>Explore all achievements</span>
            <span className="achievement-all-arrow"><ArrowUpRight size={19} aria-hidden="true" /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
