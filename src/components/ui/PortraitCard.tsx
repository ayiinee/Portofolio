import Image from "next/image";
import { profile } from "@/data/profile";

export function PortraitCard() {
  return (
    <span className="portrait-card">
      <Image
        src={profile.portrait}
        alt={profile.portraitAlt}
        width={152}
        height={190}
        priority
        unoptimized={profile.portrait.endsWith(".svg")}
      />
      {profile.portraitIsPlaceholder && (
        <span className="portrait-label">Photo coming soon</span>
      )}
      <span className="portrait-sparkle" aria-hidden="true">
        ✳
      </span>
    </span>
  );
}
