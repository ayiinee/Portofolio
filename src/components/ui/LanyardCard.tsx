import Image from "next/image";
import { profile } from "@/data/profile";

export function LanyardCard() {
  return (
    <div className="lanyard-stage">
      <div className="lanyard-static">
        <div className="identity-content">
          <div className="identity-monogram" aria-hidden="true"><span>a.</span></div>
          <p className="identity-name">{profile.shortName}</p>
          <p className="identity-role">{profile.about.badgeRole}</p>
        </div>
        <div className="lanyard-art" aria-hidden="true">
          <Image
            src="/images/design/lanyard-composite.png"
            alt=""
            width={1024}
            height={1536}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
