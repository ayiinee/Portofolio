# Project detail gallery

Implemented on 2026-10-21 from the owner's annotated AWS project detail screenshots.

- Center the media, borrowing the hierarchy of [Devpost's project detail](https://devpost.com/software/hack-stack). Following the owner's subsequent annotation, keep the category, title and description left aligned with the page frame. Keep the portfolio's existing palette, typefaces, metadata and project narrative.
- Reduce the heading to 30–36px desktop and 28–30px mobile at the current 14px root scale.
- Use a centered media container capped at 800px. Both empty and populated viewports retain a 16:9 landscape ratio at every breakpoint. Images use `object-fit: contain` to preserve diagrams and screenshots.
- Put `coverImage` first, followed by `gallery`, deduplicated by source URL. The media gallery now lives above the narrative, avoiding duplicate cover/gallery sections. Architecture media remains with its explanatory text.
- Multiple images support previous/next buttons, keyboard arrows, touch swipe, selectable thumbnails, captions and enlargement. Controls stop at the ends; there is no autoplay. Reduced-motion preferences disable carousel movement animation.
- One image supports enlargement without navigation controls. Zero images retain the explicit unavailable-media state without nonfunctional controls. Production records currently contain no approved image files; synthetic fixture images are isolated in the QA app.

Validation: production build, typecheck and scoped ESLint passed. Eight distinct Playwright scenarios passed across the initial run and focused rerun: zero/one media and focus restoration; inline multi-image gallery; hero thumbnail/keyboard/lightbox synchronization; touch swipe for inline and hero layouts; all eleven detail routes and metadata; responsive layouts; keyboard/contrast/reduced motion; and reading without JavaScript. The initial hero test incorrectly assumed Playwright excludes inert elements from role queries; the assertion was corrected to check the inactive slides' inert state, and the rerun passed.

Evidence is saved under `artifacts/case-carousel/`: `devpost-reference.png`, `after-1440.png`, `after-484.png` and `carousel-fixture.png`. No deployment was performed.
