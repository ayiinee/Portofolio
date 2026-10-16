import { cn } from "@/lib/utils";

export function SectionHeading({
  number,
  label,
  title,
  accent,
  id,
  className,
}: {
  number: string;
  label: string;
  title: string;
  accent: string;
  id: string;
  className?: string;
}) {
  return (
    <div className={cn("section-heading", className)}>
      <p className="eyebrow">
        <span>{number}</span>
        <span className="eyebrow-line" />
        {label}
      </p>
      <h2 id={id}>
        {title} <span className="font-serif italic font-normal">{accent}</span>
      </h2>
    </div>
  );
}
