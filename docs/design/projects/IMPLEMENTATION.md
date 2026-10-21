# Selected Projects — review implementation

Implemented on 21 October 2026 from the owner's referenced review in
`REVIEW.md`. That file and its screenshots describe the earlier four-card
baseline; its styling recommendations are now applied to the homepage.

- Retained the same four selected projects, order, case-study destinations and
  link to the complete 11-project collection.
- Matched Experience's 1152px content frame, 40–44px section heading, cobalt
  serif accent, navy/slate text, warm white and subtle blue background.
- Replaced the numbered eyebrow with the faint PROJECTS outline treatment.
- Integrated each cover and description into one light paper surface. Covers
  use 16:9; real diagrams retain `object-fit: contain`.
- Set project names to 19px, summaries to 14px, and technology chips to 12px.
  Each homepage card shows three chips and a short editorial summary. Summaries
  wrap naturally on phones, without line clamping or concealed text.
- Two columns on desktop/tablet, one column at 700px and below, 28px horizontal
  and 36px vertical desktop gaps, and a navy pill for Explore All Projects.

There are no approved project covers yet. Each homepage placeholder now shows
the complete project name and explicitly states that its image is coming soon.
This distinguishes the AWS projects without presenting fabricated diagrams or
screenshots. Add genuine `coverImage` media in `src/data/projects.ts` using the
existing `ProjectMedia` fields (`src`, intrinsic `width`/`height`, meaningful
`alt`, `caption`, and `type`). Use `type: "diagram"` to retain the complete image.

Homepage styling lives in `src/app/selected-projects.css`. `ProjectCard` uses
`variant="selected"` there; collection cards retain their default presentation.
`cardSummary` provides homepage-only editorial text while case-study copy and
metadata continue to use `shortDescription`.

Verification and comparison evidence are recorded in the latest Projects entry
of the root `design-qa.md`. Captures are in `artifacts/projects-review/`.

The owner's separate Experience choice is also applied: two initial experiences,
with a functioning Lihat selengkapnya control revealing the third inline.
