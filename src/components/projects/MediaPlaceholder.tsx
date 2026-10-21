export function MediaPlaceholder({
  title = "A’ini",
  category,
  showFullTitle = false,
}: {
  title?: string;
  category?: string;
  showFullTitle?: boolean;
}) {
  const mark = title.startsWith("AWS")
    ? "AWS"
    : title.startsWith("Website")
      ? "Sukomulyo"
      : title.split(" ")[0];
  return (
    <div className="media-placeholder" data-category={category}>
      <span className="placeholder-mark" aria-hidden="true">
        {showFullTitle ? title : mark}
      </span>
      <span className="placeholder-label">Project image coming soon</span>
    </div>
  );
}
