import { Download, ExternalLink } from "lucide-react";
import { profile } from "@/data/profile";

export function DownloadCVLink() {
  // The owner requested the button in this preview; no download is simulated.
  if (!profile.resume) return (
    <button className="button button-primary download-cv" type="button" disabled title="CV link coming soon">
      Download CV <span><Download size={17} aria-hidden="true" /></span>
      <span className="sr-only"> — CV link coming soon</span>
    </button>
  );
  return <div className="cv-links">
    <a className="button button-primary download-cv" href={profile.resume} download="Qurrotul-Aini-CV.pdf">
      Download CV <span><Download size={17} aria-hidden="true" /></span>
    </a>
    <a href={profile.resume} target="_blank" rel="noreferrer" className="cv-fallback">Open PDF <ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
  </div>;
}
