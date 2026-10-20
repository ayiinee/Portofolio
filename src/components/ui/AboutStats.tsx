import { profile } from "@/data/profile";

export function AboutStats() {
  return (
    <dl className="about-stats">
      {profile.about.stats.map(({ label, value, href }) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd><a href={href} aria-label={`${label}: ${value ?? "to be confirmed"}`}>{value ?? "—"}</a></dd>
        </div>
      ))}
    </dl>
  );
}
