import { ImageIcon } from "lucide-react";

export function ExperiencePhotoEmpty({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`experience-photo-empty${compact ? " is-compact" : ""}`}>
      <ImageIcon size={compact ? 26 : 42} strokeWidth={1.4} aria-hidden="true" />
      <span>{compact ? "Experience photos" : "Photos coming soon"}</span>
    </span>
  );
}
