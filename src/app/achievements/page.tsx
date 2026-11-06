import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { achievementRecords } from "@/data/achievements";
import { AchievementCollection } from "@/components/achievements/AchievementCollection";
import { getSiteOrigin } from "@/lib/site";
import "./achievements.css";

const description = "Awards, credentials, intellectual property, and publications along the way.";
export const metadata: Metadata = {
  title: "Achievements",
  description,
  ...(getSiteOrigin() ? { alternates: { canonical: "/achievements" } } : {}),
  openGraph: { title: "Achievements | Qurrotul A'ini", description },
};

export default function AchievementsPage() {
  const items = [...achievementRecords].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  return (
    <div className="achievement-route">
      <main id="main-content" className="achievement-route-frame">
        <Link href="/#education" className="achievement-back"><ArrowLeft size={16} aria-hidden="true" /> Back to selected achievements</Link>
        <header className="achievement-archive-header">
          <span className="achievement-archive-outline" aria-hidden="true">ACHIEVEMENTS</span>
          <h1>A collection of <em>milestones.</em></h1>
          <p>{description}</p>
        </header>
        <AchievementCollection items={items} />
      </main>
    </div>
  );
}
