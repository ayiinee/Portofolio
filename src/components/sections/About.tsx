import { ArrowUpRight } from "lucide-react";
import { LanyardCard } from "@/components/ui/LanyardCard";
import { AboutStats } from "@/components/ui/AboutStats";
import { DownloadCVLink } from "@/components/ui/DownloadCVLink";
import { AboutEntrance } from "@/components/animations/AboutEntrance";
import { InteractiveKeycap } from "@/components/ui/InteractiveKeycap";
import { profile } from "@/data/profile";

export function About() {
  return (
    <AboutEntrance>
      <div className="about-layout">
        <header className="about-section-heading">
          <span className="about-outline" aria-hidden="true">ABOUT</span>
          <h2 id="about-heading">About <em>me</em></h2>
        </header>
        <div className="about-lanyard"><LanyardCard /></div>
        <div className="about-sheet">
          <InteractiveKeycap className="about-keycap" />
          <div className="profile-panel-glass" aria-hidden="true" />
          <div className="sheet-tab"><span>01</span><span>ABOUT</span></div>
          <div className="about-profile-copy">
            <p className="about-lead">
              {profile.about.lead.map((line, index) => (
                <span key={line}>{index > 0 && " "}{line}</span>
              ))}
            </p>
            <p className="about-bio">
              {profile.about.bio.map((line, index) => (
                <span key={line}>{index > 0 && " "}{line}</span>
              ))}
            </p>
            <AboutStats />
            <div className="about-actions">
              <DownloadCVLink />
              <a href="#experience" className="about-experience-link">
                Explore my experience <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </AboutEntrance>
  );
}
