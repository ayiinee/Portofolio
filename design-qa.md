# Carousel reference QA

final result: passed

## Scope and evidence

The owner's supplied three-section reference is the layout authority. This is an
adaptation to WaspadAI: preserve the existing logo, Poppins font, palette and
original app screens; retain explicit placeholders for missing long screenshots.

- Source visual truth: C:/Users/THINKPAD/AppData/Local/Temp/codex-clipboard-75108f6b-4786-4814-a5fd-b0658b582e89.png (1200 x 2022).
- Implementation: http://localhost:3000/projects/waspadai.
- Desktop viewport: 1200 x 950 CSS px. Slide: 1036 x 582.75 CSS px; captures approximately 1036 x 583 raster px.
- Full-view comparison: artifacts/carousel-reference/comparison.jpg. Each source section is cropped to 1200 x 674 and normalized to 720 x 404 beside the corresponding implementation. No content is stretched independently of its frame.
- Final implementation captures: artifacts/carousel-reference/hero-final.jpg, slide-2-final.jpg, slide-3-final.jpg.
- Mobile viewport: 390 x 844 CSS px; screenshot files are 375 x 811 due to browser screenshot scaling. Evidence: artifacts/carousel-reference/mobile-slide-2.jpg and mobile-slide-3.jpg. This is a composition check, not a 1:1 pixel comparison.
- State: default hero pose and selected second/third slides. Full-page feature captures were taken with scrollY = 0 and cropped to the slide's document bounds to exclude the fixed navigation.

## Findings and required fidelity surfaces

No actionable P0/P1/P2 issues remain within the requested layout and placeholder scope.

- Typography: retained local Poppins and WaspadAI copy. Two-line feature titles, small section labels and compact annotations follow the source hierarchy. Korean copy and the Runflow font/wordmark are intentionally replaced by existing project content.
- Layout: hero copy stays left, two angled phones stay right, and the second phone intentionally extends below the canvas. Slide 2 uses the source's 43.3% vertical split, a large cropped phone at 32%, a strip at 57.8%, and a smaller phone at 77%. Slide 3 uses a 49.6% horizontal split, a large phone at 37.3%, and a strip at 67%. Annotation rules point toward the relevant mockup slots.
- Colors: the existing WaspadAI primary/surface/ink colors are retained. The source's light/blue sectioning and annotation contrast are reproduced. A tinted photograph of the city replaces the source's running illustration as requested.
- Images: original app screenshots retain their natural proportions; the missing full-length screens have explicitly labeled placeholder slots. The city image uses the upper portion of the supplied background, with no newspaper band leaking into the layout. Real photography remains raster imagery. Existing Three.js device infrastructure is retained only in the hero.
- Copy: Indonesian feature descriptions and callouts describe the existing verification and community features. Placeholder text is intentional and identifies missing detail imagery.

Focused regions were inspected at full capture resolution in addition to the contact sheet: hero logo/phone edges, feature text, small phone, strip placeholder and annotation lines. See hero-final.jpg, slide-2.png and slide-3.png for detailed composition views; the final captures include the later city-overlay treatment.

## Comparison history

1. Initial check: cropped logo, wrong hero device arrangement, blue background showing the old newspaper band, and feature screenshots cropped into a long strip. Fixed the logo, hero rig and camera framing, cropped the background to its city region, and introduced dedicated long-screen placeholders.
2. Updated check: adjusted phone sizes/positions to keep the first phone inside the canvas and the second intentionally cropped only below. Improved photographic overlay contrast. Final source/implementation contact sheet shows the requested vertical and horizontal divisions, mockup positions and annotation placement.
3. Capture normalization: discarded intermediate captures with a negative viewport crop or a sticky navbar over the slide. Final feature evidence was recaptured from page top and cropped from full-page screenshots using document coordinates.

## Browser validation

- Hero: one ready WebGL canvas; keyboard rotation surface available and arrow-key interaction exercised.
- Slide 2: three flat mockup slots and no WebGL canvas inside the feature composition.
- Slide 3: two flat mockup slots and no WebGL canvas inside the feature composition.
- Dot navigation and carousel ArrowLeft navigation exercised.
- Screenshot lightbox opened and closed; focus returned to its originating button.
- Mobile slides retain the presentation-board ratio and produce no document horizontal overflow.
- Browser error log: no errors recorded during verification.
- Typecheck, ESLint and production build passed.

## Implementation checklist

- [x] Restrict interactive 3D to the hero.
- [x] Match reference section divisions and mockup slot positions.
- [x] Add photo overlays and positioned annotations.
- [x] Keep dedicated placeholders for full-length screenshots.
- [x] Preserve working carousel navigation and image enlargement.
- [x] Verify desktop and mobile composition.

## Follow-up polish and limits

The long-screen images are intentionally still placeholders. Supply approved tall
screenshots through the matching entries in src/data/projects.ts. The miniature
16:9 board scales as a whole on mobile, so small annotations are presentation
content rather than full-size mobile body copy. Automated Playwright E2E,
WebGL-failure injection, no-JavaScript rendering and autoplay timing were not
rerun in this pass; interaction verification used the connected in-app browser.

## Browser annotation revision — spacing and navigation

final result: passed

Source truth for this scoped revision is the owner's four browser comments and
their marked screenshots: increase spacing between the two hero phones, use an
animated active pill with inactive dots, remove the pause button, and add glass
previous/next arrows with smooth slide motion. The prior hero capture is
artifacts/carousel-reference/hero-final.jpg. The remaining composition is preserved.

Evidence: artifacts/carousel-navigation/hero-navigation.jpg (699 x 654 raster px,
714 x 668 CSS viewport), mobile-navigation.jpg (375 x 811 raster px, 390 x 844 CSS
viewport), transition.jpg (an intermediate scroll frame), and comparison.jpg.
The comparison normalizes the old 1036 x 583 hero and the new cropped 16:9 hero
to the same 720 x 405 size. Browser screenshots scale the CSS viewport by about
0.979; crops account for that scale. Both hero poses are reset/default poses.
navigation-preview.jpg is the focused hero-and-controls crop used for handoff.

Changes and fidelity checks:

- Spacing: moved the hero phones apart horizontally. Visual comparison shows a visible blue gap between their bezels. Their sizes, tilt, sectioning and image content remain intact.
- Navigation: Motion animates the current indicator to 26 px wide; inactive dots measure 7 px. No pause/play button remains. Glass arrows use the existing icon set and sit just outside the canvas below 900 px to avoid covering the wordmark.
- Typography and copy: unchanged by this revision; accessible Previous slide/Next slide labels were added.
- Color and imagery: existing tokens, photo overlays and screenshots remain intact. Arrow glyphs use the dark ink token so they stay visible over light panels and during transitions.
- Smooth motion: Embla owns the track animation with duration 32. The hero's demand-rendered scene now stays ready while the carousel is visible, including when it is offscreen inside the track. It is released when the carousel leaves the viewport or the page is hidden. This avoids swapping the live canvas for a differently arranged poster at selection time. Feature mockups remain flat.

Iteration history: first arrow placement slightly overlapped the hero wordmark
at the annotation viewport. Added the 900 px breakpoint and verified the controls
outside the copy area. The next arrow was too pale over a light incoming panel;
changed both arrow glyphs to the ink token and rechecked the final capture.
No actionable P0/P1/P2 issues remain.

Validation: exercised both arrows, previous-from-first and next-from-last looping,
dot navigation and the active-pill state. The hero renderer stayed ready when a
feature slide was selected and when returning to the hero. At 390 px the arrows
remain inside the document width and produce no horizontal overflow. Browser
error log was empty. Typecheck, ESLint and the final production build passed.
Motion was checked visually in the intermediate frame and live browser;
no frame-rate benchmark or automated Playwright E2E was run.

## Compact mobile project detail revision

final result: passed

The user's request is to make mobile preview cards and information compact while
retaining useful content. The existing page is the visual baseline. This revision
changes detail pages below 600 px; desktop layout and the slide artwork remain
unchanged. No project text, technology entries or case-study sections were removed.

Source visual truth: artifacts/project-mobile/before-390.jpg, captured before edits
at 390 x 844 CSS px. Implementation: artifacts/project-mobile/after-390.jpg and
preview-390.jpg, same viewport, default hero selected and page at top. Full-view
comparison: artifacts/project-mobile/comparison-390.jpg. Both 375 px raster-wide
page captures were normalized to 390 px and compared over the same top-of-page
region. Capture heights are 4348 px before and 3206 px after; total screenshot
height is not used for exact density measurements. DOM measurements establish
component sizes. Focused regions: focus-320.jpg for narrow-screen text/wrapping,
detail-footer-390.jpg for long section headings and adjacent-project cards, and
lightbox-390.jpg for readable full-screen app imagery.

Required fidelity surfaces:

- Typography: case-study body remains 14 px with a 1.65 line height; section headings are 18 px, metadata values 13 px, and compact technology badges 11 px. Number badges sit beside headings instead of occupying a separate row. No text is line-clamped or hidden.
- Spacing/layout: mobile gutter is 16 px; card padding is 16 px; card radii are 14 px. Role and year stay in two columns even at 320 px, while timeline, project type and technology rows span the card. Section gaps, contribution numbering and adjacent-project links are more compact.
- Color/tokens: existing ink, muted text, glass surfaces, borders and blue accents are retained. No new palette or icon treatment was introduced.
- Images: the 16:9 showcase composition and original screenshots are preserved. A readable current-slide caption and touch-friendly View screens button below the carousel provide access to the existing full-screen lightbox.
- Copy/content: all ten WaspadAI technology entries and six case-study sections remain present. Mobile caption follows the selected slide. The other tested detail page retains all twelve AWS technology entries and its long project title.

Measured at 390 px: sidebar/card height decreased from 452.4 px to 284.4 px
(about 37%). The Overview section now starts at 743.45 px instead of 939 px.
At 320 px the WaspadAI information card is 331.55 px tall, retains its two-column
role/year row, and has no horizontal document overflow.

Browser validation used the connected in-app browser:

- WaspadAI at 320 x 740 and 390 x 844: no horizontal overflow; all technology entries remain visible; feature-slide caption updates with navigation.
- View screens opens the original home screenshot in the lightbox, and Close restores focus to the button.
- AWS Infrastructure Automation & Recovery at 320 px: 24 px title, all twelve technology badges retained, no horizontal overflow.
- Desktop at 1200 px: the original 240 px sidebar/two-column layout remains; the mobile caption is display:none.
- Hero renderer ready; browser error log empty.
- Typecheck, ESLint and production build passed. Automated Playwright E2E was not run.

Comparison history: the first implementation met the compact-density target.
Visual inspection covered the full-view before/after comparison, narrow-screen
metadata and caption wrapping, long narrative headings, and adjacent-project
links. No actionable P0/P1/P2 issues were found. Original miniature slide copy
remains presentation-board content; full-screen source images are available
through View screens rather than enlarging the entire carousel.

## Smaller typography and cards — follow-up

final result: passed

Source target: the user's correction that fonts and cards are still too large.
Prior implementation reference: artifacts/project-mobile/after-390.jpg. Revised
implementation: artifacts/project-mobile/denser-390.jpg, with handoff preview in
denser-preview-390.jpg. Both use the same 390 x 844 CSS viewport/default hero;
denser-comparison.jpg normalizes both raster captures to 380 px wide and compares
the same top-of-page region. Additional evidence: denser-320.jpg and denser-714.jpg.

Typography: body text 14 -> 12 px; section headings 18 -> 15 px; metadata values
13 -> 11.5 px; technology badges 11 -> 10 px. Layout: card padding 16 -> 12 px,
section gaps 14 -> 10 px, and tighter paragraph/heading spacing. At 390 px the
metadata card is now 226.9 px tall (previously 284.4 px). Compact styling extends
through 760 px so the 714 px narrow preview also receives the smaller sizes.
Colors, photo overlays, app screenshots and all project copy are unchanged.
No fields, technology entries or narrative sections were removed.

The combined comparison was opened and inspected for typography, spacing,
colors, imagery and content. Labels, badges and heading hierarchy remain clear
at the requested denser scale; no clipping or actionable P0/P1/P2 findings remain.
At 320, 390 and 714 px the browser reports no horizontal overflow; all ten
technology entries remain present. Browser error log empty. Production build
(including TypeScript) and diff whitespace validation passed. No extra E2E tests
were added or run for this scoped CSS density adjustment.

## WaspadAI wordmark arrangement

final result: passed

Source visual truth: C:/Users/THINKPAD/Downloads/Kelompok 1_Innovation Management_WaspadAI (3).png,
876 x 224 RGBA. The original transparent artwork was copied unchanged to
public/images/projects/waspadai/brand-lockup.png. SHA-256 matches the source:
f2091730656f6a5cb5b78c27c0117e8197f29f99e0e37692cd52ea9832a02f7d.

The shared ShowcaseComposition renders this asset for the hero and ShowcaseCover,
which supplies thumbnails on both the homepage and project collection. This
preserves the exact supplied arrangement: W symbol on the left, aspadAI to its
right, and the tagline underneath. The prior separate icon, heading and tagline
are replaced only when the optional brandLockup asset is present. The detail-page
h1 remains named WaspadAI; the tagline remains available as screen-reader text.

Implementation evidence: artifacts/waspadai-brand/hero.jpg (1036 x 583),
thumbnail.jpg (328 x 184), mobile.jpg, and brand-comparison.jpg. Desktop viewport
1200 x 950; mobile viewport 390 x 844. Source artwork was opened alongside the
rendered hero and thumbnail. Full-view inspection confirms spacing away from
mockups, preserved slide composition, and matching branding between surfaces.
Focused inspection used the exact source artwork and wordmark region. The
brand-comparison sheet enlarges raster crops for inspection; thumbnail pixel
softness at that enlarged scale is expected and not a native-resolution metric.

Fidelity surfaces: type shapes, letter spacing, tagline position, logo proportions,
colors and transparency come directly from the unchanged source PNG. Both hero
and thumbnail preserve its approximately 3.911 aspect ratio. The asset is served
without lossy optimization. Surrounding typography, overlays and project copy
are unchanged. No actionable P0/P1/P2 issues were found.

Validation: hero has a single supplied lockup and retains its accessible h1;
project collection and homepage cards each use the same asset and have no WebGL
canvas. At mobile width there is no horizontal overflow. Browser error log was
empty. Typecheck, ESLint, production build and source/destination checksum checks
passed. No additional automated E2E tests were needed for this asset/layout edit.

## Subtle white gradient at hero top

final result: passed

User target: browser annotation requesting a slight white gradient at the top of
the hero. Added a background-only white wash at 25% opacity at the top, 8% at
18% of the hero height, fading to transparent at 40%. Shared hero/cover styling
keeps thumbnails consistent. Foreground logo, screenshots and text retain their
original colors, positions and typography; the feature-slide backgrounds retain
their prior sectioning. Browser-rendered evidence:
artifacts/waspadai-brand/hero-top-gradient.jpg, default hero selected, 552 x 668
CSS viewport. Visual inspection and computed background confirm the requested
subtle fade. No actionable P0/P1/P2 issues. Diff whitespace validation passed;
no new tests or production build were necessary for this one-line CSS adjustment.

## Stronger half-frame gradient and larger hero caption

final result: passed

Target: user's follow-up requests a stronger white gradient over roughly half the
hero and a larger caption immediately below the WaspadAI lockup, with bold italic
emphasis on Social Engineering Scam and Moment-of-Exposure.

The gradient now starts at 85% white opacity, reaches 50% white at 22% height,
and fades out at 52%. The small top section label uses the existing ink color
for visibility on the lighter background. Caption moves from 61% to 51% height,
shares the lockup's 5.2% left edge and 38% width, and increases from 1.05cqw to
1.5cqw (about 43%). Its desktop size at a 1036 px canvas is 15.54 px. Both
highlighted terms use the supplied local bold italic Poppins face and existing
accent color. Moment-of-Exposure is no longer deliberately split between lines;
spaces between sentence segments are preserved for copying and accessibility.

Evidence: artifacts/waspadai-brand/hero-strong-gradient-caption.jpg, 1036 x 583
capture at 1200 x 950 CSS viewport; hero-strong-gradient-caption-mobile.jpg at
390 x 844 CSS viewport. The image was opened and inspected, including the
wordmark-to-caption gap, full four-line caption, emphasis, top gradient extent
and section label contrast. Source truth is the user's requested caption and
half-frame gradient, with the supplied brand artwork retained unchanged.
The same shared composition applies these updates to thumbnails.

Typography, spacing, colors, imagery and copy checked: no actionable P0/P1/P2
issues for this scoped revision. Mobile has no horizontal overflow; computed
styles confirm italic emphasis and the stronger gradient. Browser error log
empty. Production build (including TypeScript) and diff whitespace checks passed.
Phone scene/interaction code and feature-slide layouts were not changed.

## Restore the earlier subtle gradient

final result: passed

Restored the previous 25% white / 8% white / transparent gradient stops at
0% / 18% / 40%, and restored the light section label appropriate to the blue
background. The enlarged caption, its position and bold italic emphasis remain.
Browser computed styles confirm the restored stops. Evidence:
artifacts/waspadai-brand/hero-gradient-restored.jpg. Diff validation passed.

## Raised hero copy, desktop-only arrows, and initial 3D flash fix

final result: passed

Source target: the owner's browser request and screenshot
C:/Users/THINKPAD/AppData/Local/Temp/codex-clipboard-919ac80f-da3c-4914-9724-7aa3df73001b.png.
That source captures the unwanted temporary 2D mockup, with part of the frame
cropped. It is compared by aspect-preserving containment rather than treated as
a pixel-aligned full-frame reference.

Evidence: artifacts/showcase-load-fix/comparison.jpg (opened source/result pair),
desktop-hero.jpg (1036 x 583; 1200 x 950 CSS viewport), mobile-hero.jpg
(390 x 844 CSS viewport), tablet.jpg (768 x 1024 CSS viewport), and
initial-state.json (observed cold-reload loading state).

Typography/layout: brand block rises from 33% to 25%, and caption from 51% to
42%. Both start at 7.8% left with 36% width. The existing 1.5cqw caption size,
bold italic emphasis and original transparent brand asset remain. At 1200 px
the settled caption-to-left-arrow horizontal gap is 24.8 px. Full-view and
focused copy inspection show no arrow/text collision or caption clipping.

Colors: white gradient increases modestly from 25% to 40% at the top, with a
14% white stop at 20% height, fading out at 46%. The small top label uses the
existing ink color for contrast. Photography, app screenshots and brand colors
remain unchanged. Copy text and content hierarchy are retained.

Responsive controls: arrows now appear only above 1024 px on a device with a
fine pointer and hover. Browser confirms display:block at 1200 px and display:none
at both 768 px and 390 px. Dot navigation still works; no horizontal overflow.

Initial-load fix: PhoneStage no longer renders a poster while loading. The 2D
fallback is mounted only after an actual failure. The live canvas starts hidden
and fades in after createPhoneScene has synchronously drawn its first frame.
Initial setup errors dispose their allocated scene before falling back. Resize
notifications that repeat the existing dimensions are ignored, avoiding a buffer
clear immediately after the initial frame. Autoplay waits for hero initialization
to resolve instead of advancing while the model is still loading.

Validation:
- Actual SSR HTTP response: loading stage present; no posterLayer or fallbackDevices markup.
- Cold browser reload with document visible: renderer loading, zero posters/fake phones, autoplay false (initial-state.json).
- Subsequently: renderer ready, canvas opacity 1, zero posters; live 3D visually inspected.
- Keyboard rotation and reset exercised. Moving to slide 2 retains the ready hero scene and does not insert a 2D preview.
- Desktop text/arrow clearance checked; tablet and mobile controls and overflow checked.
- Browser error log empty. Typecheck, ESLint, production build and diff validation passed.

No actionable P0/P1/P2 findings remain. Image/typography/spacing/color/content
surfaces were reviewed in the combined source/result comparison and final
mobile capture. WebGL failure was not artificially injected; its retained
fallback path was reviewed in code. Automated Playwright E2E was not run.

## Solid cards and softer, brighter cobalt page background

final result: passed

Target: keep all cards below the carousel solid, use cobalt geometry/opacity on
the page background, then refine that background to glow more brightly with no
harsh edges or outline lines, similar to the existing homepage gradients.
Homepage grounding: the soft radial fades and warm base in src/app/hero-about.css.

Source and comparison evidence:
- artifacts/cobalt-page-background/before-desktop.jpg: original gradient cards.
- after-desktop.jpg: intermediate solid cards with more defined geometry.
- soft-cobalt-desktop.jpg: final softened cobalt background.
- comparison.jpg: original/solid-card comparison.
- soft-comparison.jpg: defined-edge/soft-edge comparison, opened and reviewed.
- soft-cards-preview.jpg: final focused content-card region.
- soft-cobalt-mobile.jpg: final mobile page.

Desktop captures use 1200 x 950 CSS viewport; full-page rasters are 1184 x 3608.
The comparisons crop the same document region (840 through 2520 px) from the
same-sized desktop captures and scale both sides equally. Mobile inspection
uses 390 x 844; overflow and card/geometry styles were also checked at 320 px.

Changes and fidelity surfaces:
- Cards: information sidebar, all narrative sections and both adjacent-project links have opaque white backgrounds and background-image:none. Light card borders/shadows remain; gradient and transparency no longer tint their interiors.
- Background: scoped to project detail pages. Five noninteractive decorative layers use square, circular and diagonal forms, combined with broad radial fades. The final cobalt is RGB 0 71 255, with stronger opacity stops, over the original warm #fafbf7 base.
- Edges: all geometry borders and outline shadows are removed. Responsive blur is 60 px at desktop and 36 px on the tested mobile viewport. The clipped prism is painted on a child pseudo-element so the parent blur softens the polygon instead of being cut sharply by its own clip-path.
- Typography/copy: sizes, wrapping, card padding and all project information are retained, including the previously requested compact mobile typography (12 px body).
- Images/content: original screenshots and branding are unchanged. The page backdrop is intentionally procedural decoration; no content images or icons were replaced.
- Layout: absolute decorative layers have no layout footprint. Page raster height remains unchanged; cards and text stay in their previous positions. Layers are aria-hidden and pointer-events:none, with overflow clipped at the page boundary.

Validation: browser confirms all nine main card surfaces are solid white with no
background image; all five geometry layers have 0 px borders and no box shadows.
At 320 and 390 px there is no horizontal overflow. The decorative layer cannot
intercept clicks. Browser error log is empty. Typecheck, ESLint and production
build passed for the structural/card changes; the final CSS color and feathering
refinement was checked in the browser and with diff validation, without adding
new automated tests for this visual-only edit.

Comparison history: initial composition introduced solid cards and visible
geometric bands. User requested brighter cobalt and softer edge blending.
Removed outlines, increased saturation/opacity, restored the warm base and
feathered all geometry. Combined before/after and focused mobile inspection show
no actionable P0/P1/P2 issues in the final requested treatment.
