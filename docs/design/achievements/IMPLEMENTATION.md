# Achievement coverflow

Implemented on 28 October 2026 from the owner's approved Motion coverflow plan.

The homepage retains the existing `#education` anchor and Achievement navigation
label. The education card and separate training list have been replaced by a
six-record selection with an Explore All Achievements link. Other homepage
sections and project case studies are unchanged.

The homepage caption below the carousel and its separate View details button were
removed at the owner's request. Active cards still open the dialog, and a visually
hidden live message announces manual selections. A pale-blue invitation panel
now links to the full collection with a count badge and arrow; it stacks on phones
and limits the hover animation to visitors without reduced-motion preferences.

## Content and media

`src/data/achievements.ts` exports `AchievementRecord`, category labels and the
ordered `achievementRecords`. There are 24 records: 11 awards/competition entries,
8 certifications/training/test credentials, 2 copyrights and 3 publications/writing
entries. The existing provincial LKS participation is preserved. Six records have
an explicit featured order; the remaining records follow descending known year.
Missing issuers, journal publication status, rankings and dates are not inferred.

Cards currently use approved factual typography, not document facsimiles. Add
genuine media with `media: { src, width, height, alt }` and an optional `url` to a
record. Store media under `public/images/achievements/` and reference the public
path. Covers and dialog images use contain so documents remain uncropped. The
full title and summary remain available in the dialog; only supplied links appear.

## Complete archive

`/achievements` displays the 24-record archive in a three-column collection, two
columns at 1000px and below, one at 700px and below. It follows the selected paper
card mockup with the owner's revisions: italic only in the page heading, upright
card and dialog text, and document-preview areas above each record. Missing media
is honestly labelled Document preview not uploaded; no generated certificates or
publication covers are presented as evidence. Genuine images use object-fit contain.

The archive sorts known years descending (undated records last), independent of
the homepage's featured order. All four category filters show computed counts;
enhanced pagination displays six matching records per page with Previous, page
numbers and Next. Changing category returns to page one; page changes focus and
scroll to the results. The count reports the displayed range. Enlarged 1.4:1
previews open the shared accessible native dialog; card summaries and separate
View details buttons were removed at the owner's request. Before
JavaScript enhancement, native details disclosures expose full titles, references
and source links, and all 24 records remain readable without pagination. The new
route has its own metadata, sitemap entry and active
Achievement navigation state. The Back link returns to the retained homepage anchor.

## Interaction

The existing Embla dependency drives navigation and drag. Coverflow transforms are
applied to inner cards, using public slide geometry so Embla retains correct drag
and loop measurements. Two-item collections wrap through keyboard navigation without
requiring duplicate records. A one-item collection disables rotation/navigation;
an empty collection has a text empty state. The unenhanced server-rendered grid
contains every title and summary and remains readable without JavaScript.

Autoplay advances after 5 seconds, only while at least half the stage is visible
and the document is active. Native user scroll advances/reverses after 140px,
throttled to one step per 450ms; it pauses autoplay until 1.5 seconds of quiet,
then starts a fresh 5-second delay. The page is never pinned or wheel-locked.
Programmatic jumps, anchors, resize and modal scroll restoration are excluded.
Hover suspends autoplay. Focus, filter changes, drag, navigation and opening a
dialog stop automatic movement until Play. Changing filters resets to item 1;
closing a dialog retains selection. The visible navigation/counter toolbar was
removed at the owner's request. Rotation retains a screen-reader-accessible
text button before slide content; it is revealed only on keyboard focus.

Reduced motion uses a hydration-safe `useSyncExternalStore` media-query subscriber.
It disables automatic movement, vertical-scroll navigation and 3D transforms,
including when the OS/browser preference changes while the page is open. Manual
navigation remains immediate. Only the active enhanced slide enters the keyboard
and screen-reader sequence. Dialogs use native modal behavior, contained focus,
Escape, scroll locking and restoration of focus/scroll to the trigger.

## Verification

Four focused Playwright scenarios cover records/filters/dialogs/axe/responsiveness,
autoplay and live reduced motion, scroll direction and visibility, and reading
without JavaScript. Run `PLAYWRIGHT_CHANNEL=chrome npx playwright test
achievements.spec.ts --project=chromium` (set the environment variable separately
in PowerShell). Tests use the existing gallery fixture server configuration.
Visual evidence and comparison with the selected Motion reference are recorded
in the latest root `design-qa.md` entry. No deployment is part of this change.
