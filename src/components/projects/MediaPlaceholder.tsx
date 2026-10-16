export function MediaPlaceholder({
  title = "A’ini",
  category,
}: {
  title?: string;
  category?: string;
}) {
  const mark = title.startsWith("AWS")
    ? "AWS"
    : title.startsWith("Website")
      ? "Sukomulyo"
      : title.split(" ")[0];
  return (
    <div className="media-placeholder" data-category={category}>
      <span className="placeholder-mark" aria-hidden="true">
        {mark}
      </span>
      <span className="placeholder-label">Project image coming soon</span>
    </div>
  );
}
