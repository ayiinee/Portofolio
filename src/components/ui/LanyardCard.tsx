import Image from "next/image";
import { Cloud } from "lucide-react";
import { profile } from "@/data/profile";

export function LanyardCard() {
  return (
    <div className="lanyard-stage">
      <div className="lanyard-art" aria-hidden="true">
        <Image
          src="/images/design/blue-lanyard.webp"
          alt=""
          width={1092}
          height={1440}
          sizes="(max-width: 700px) 360px, 480px"
        />
      </div>
      <div className="lanyard-badge">
        <div className="badge-header">
          <Cloud size={20} aria-hidden="true" />
          <span>A LITTLE INTRODUCTION</span>
        </div>
        <div className="badge-photo">
          <Image
            src={profile.portrait}
            alt={profile.portraitAlt}
            width={300}
            height={300}
            sizes="220px"
          />
          {profile.portraitIsPlaceholder && <span>Photo coming soon</span>}
        </div>
        <p className="badge-name">Qurrotul A’ini</p>
        <p className="badge-role">Informatics Engineering</p>
        <div className="badge-bottom">
          <span>CODE / CLOUD / CURIOSITY</span>
        </div>
      </div>
    </div>
  );
}
