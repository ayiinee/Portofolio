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

## Audit follow-up: mobile readability — 2026-11-07

Source visual truth: artifacts/clean-design-audit-2026-11-07/03-mobile-before.jpg and 04-mobile-screen-viewer.jpg, with the accepted findings in that folder's report.md. The target is the existing composition plus readable supporting text; the miniature slide artwork is intentionally retained.
Implementation evidence: artifacts/audit-fixes-2026-11-07/mobile-details.jpg, mobile-viewer.jpg, mobile-320.jpg, tablet-768.jpg and desktop-1200.jpg. Combined comparison: artifacts/audit-fixes-2026-11-07/comparison.jpg. Final two-state preview: result.jpg in the same folder. Opened and inspected saved files and combined comparison.

Viewport/density: 390 x 844 CSS px for the main mobile pass; saved page raster 375 x 811 and viewer raster 390 x 844. The full-page source mobile raster is 375 x 2472, cropped to its first 811 px for comparison; each before/after pair is shown at equal pixel width without stretching. The external readout is deliberately taller after the change. Viewer comparison uses the same original app screenshot and viewport. Additional checks at 320 x 844, 768 x 1024, and 1200 x 950. Tablet capture made immediately during viewport resize was rejected and replaced after the viewport settled (753 x 1004 saved raster).

Initial P2 findings and fixes:
- Tiny internal slide text: added the complete current slide description below the carousel at <=1024 px. Annotations appear in a native keyboard-operable Keterangan slide disclosure, closed initially. Content follows the selected slide; disclosure resets when moving to another slide. Existing miniature design remains unchanged.
- Reading interrupted by slide rotation: autoplay now runs only at desktop widths. Mobile/tablet retain swipe and dot navigation. Keyboard instructions match the enabled behavior. Reduced-motion behavior remains in place.
- Tiny duplicate screen links: hidden inside the scaled slide at non-desktop widths. The external View screens button provides a 44 px high target and opens the full gallery. Disclosure summary is also 44 px high.
- Caption covering app screenshot: non-desktop lightbox reserves a separate 80 px footer plus safe-area inset, with a 16 px gap between image and caption. At 390 x 844, measured image bottom 748 and caption top 764; no intersection. Caption may scroll if longer. The image shrinks slightly to preserve the entire screenshot and close toolbar.
- Text scaling: compact card body, metadata values and section headings now use rem sizes with effectively unchanged default dimensions. New readout uses rem and darker theme ink. No line clamp hides the slide description.

Required fidelity surfaces:
- Fonts/typography: existing families retained; compact card defaults preserved; supporting text uses 12 px equivalent, 1.65 line height, and dark ink rgb(17,50,85). Annotation numbering is explicit. No truncated description at tested widths.
- Spacing/layout: existing 16:9 frame and card padding retained. Added readout creates intentional extra height. Optional annotations are collapsed by default; no extra white card is introduced.
- Colors/tokens: home blue background and opaque white information cards remain intact. Readout uses existing theme ink; viewer footer is opaque dark neutral for readable captions.
- Image quality/assets: original logos, screenshots, 3D hero, and flat mockups are unchanged. Full screenshot visible above the caption in viewer. Placeholder continuation strips remain intentional and require owner-supplied final assets.
- Copy/content: description and annotation strings come from the existing showcase data; no product capabilities or screenshots invented. External title/category follows the selected slide.

Primary interactions tested in the browser: dot navigation to slides two and three, description synchronization, Enter to open native disclosure, disclosure reset on slide change, opening View screens, advancing to the next screenshot, Escape to close, focus returning to the external trigger. Non-desktop data-playing=false verified; arrows have zero size at tablet and 44 px width on desktop; desktop supporting readout is hidden. No horizontal overflow at 320, 390, 768, or 1200 px. Browser error log empty. Typecheck, lint, production build, and diff validation passed. Final CSS ink adjustment checked in browser.

Comparison history: initial audit identified unreadable miniature copy and caption overlay. First fix added readout and reserved viewer space. Inspection caught unnumbered annotations and a capture taken during tablet resize; numbering corrected and capture replaced. Final pass darkened readout ink and confirmed the revised screenshots. Full and focused before/after comparison shows the requested structure preserved and the actionable findings addressed.

Remaining limits: no physical device, screen reader, text-only zoom, pinch gestures, or complete WCAG audit. Internal miniature copy remains small by design, with the same complete description/annotations now available as normal text outside it. Intentional screenshot placeholders cannot be completed without the actual assets. These are stated scope limits, not claims of full accessibility compliance.

final result: passed

## Compact project card typography — 2026-11-07

Source visual truth: user attachments C:/Users/THINKPAD/AppData/Local/Temp/codex-clipboard-9242cdb5-ab11-4c9b-b18d-495bdaf5f700.png (1062 x 815) and codex-clipboard-86448f90-b1d3-4cf7-904a-c183d3d96055.png (1177 x 825). Targeted request: smaller project card typography with editorial hierarchy and unboxed section numbers. Reference themes, article copy, and full-page layout are not requested replacements.

Implementation evidence: artifacts/card-typography-2026-11-07/desktop-cards.jpg (1531 x 900 CSS viewport; 1516 x 886 saved raster), mobile-cards.jpg (390 x 844 CSS viewport; 375 x 811 raster), cards-preview.jpg (focused crop of the desktop screenshot), and reference-comparison.jpg (both supplied sources with the rendered implementation). Saved images and combined comparison opened and reviewed. Source viewport/density is unknown, so comparison concerns hierarchy and decoration rather than pixel-perfect reproduction. The original reference images are uniformly reduced only for the comparison sheet; no UI is redrawn.

Initial issues: desktop heading 26 px/body 15 px with loose vertical spacing; section numbers rendered as bordered blue badges. User explicitly requested smaller typography and removal of the number border.

Fixes: desktop headings now 20 px equivalent, body 13.5 px with 1.75 line height, subheadings 13.5 px, metadata 13 px, labels 11 px, and tech tags 10.5 px. Card padding 24 px instead of 28 px, heading/content gap 14 px instead of 20 px, contribution gaps 18 px instead of 22 px. Section numbers have border:0, background:none, padding:0 and no reserved badge box. Mobile headings are 14 px and body remains 12 px to preserve readability. Removed obsolete mobile overrides that would otherwise enlarge desktop-defined typography at the tablet/mobile breakpoint.

Fidelity surfaces: existing font family/weights retained with a quieter title/body ratio; compact spacing preserves white card boundaries and all copy; brand blue and page gradients retained; original image/logo/mockup assets untouched; no reference article claims copied into the project. The targeted number element is plain text, while the containing card border remains as requested by the scoped annotation.

Verification: browser computed sizes match 20/13.5 px desktop and 14/12 px mobile; number border width 0, transparent background, padding 0. No horizontal overflow at 320, 390 and 1531 px. Desktop and mobile screenshots show clear section hierarchy, readable wrapping, and intact metadata/list content. git diff --check passed. No additional build/tests for this CSS-only visual adjustment.

Comparison history: first scoped typography pass removes the reported badge decoration, reduces the heading/body sizes, and tightens spacing. Combined reference/render and focused crop review found no remaining actionable P0/P1/P2 issues within this request. Existing mobile disclosure/viewer behavior is preserved. Other uncommitted files belong to the preceding audit follow-up and were not reverted.

final result: passed

## Named sticky project information — 2026-11-07

Scoped browser annotations: add project name and keep the information card visible while scrolling; remove the numbers above section headings and increase heading size slightly. No project content or contribution-list numbering was changed.

Implementation: project.title rendered as a sidebar heading; sidebar position:sticky at top:112px on the two-column layout (>760px), constrained to the narrative grid. Its maximum height is 100dvh - 136px, with native overflow scrolling and data-lenis-prevent so links remain reachable on short screens. The aside can receive keyboard focus for scrolling. On the stacked mobile layout it remains static. Removed section heading number spans and obsolete number CSS. Desktop section headings 20 -> 22 px equivalent; mobile 14 -> 15 px equivalent. Existing compact body sizes remain intact.

Evidence opened and inspected: artifacts/sticky-project-info-2026-11-07/sidebar-sticky.jpg at 870 x 668 CSS viewport (855 x 655 raster), mobile-project-info.jpg at 390 x 844 (375 x 811 raster). Browser measurements prove sticky top stays 112px at page scroll positions about 1151 and 1929px while the content grid moves upward. Short-screen inner scrolling reaches the repository link (inner maximum 78px; PageDown reached about 77px). Zero section-number spans remain. Mobile computed position is static, title WaspadAI is present, headings are 15px, and scroll width 375 <= viewport 390.

Typecheck, lint, production build and git diff --check passed. Existing metadataBase build warning remains unrelated. This is a scoped interaction/layout verification; no claim of full accessibility or all-project visual audit.

final result: passed

## Hero mockup entrance — 2026-11-07

Request: animate the hero mockup when entering the project detail page. Scoped changes: PhoneStage.tsx and the hero canvas styles in MobileShowcase.module.css.

The 3D canvas now fades in while moving upward from a small lower/right offset, scaling from .94 to 1, and rotating from 3deg to its original CSS orientation. Duration 1.15s, cubic-bezier(.22,1,.36,1). The animation is attached only after the first successful synchronous Three render has marked the stage ready; loading still shows no 2D poster. Completion is retained in component state, so navigating between carousel slides does not replay the entrance, and later renderer recreation after scrolling retains the completed introduction. The existing 3D scene/phone poses and direct rotation handlers are unchanged. No permanent render loop or timer was introduced.

Reduced-motion path: animation rule is limited to prefers-reduced-motion:no-preference; if reduce is selected when the scene becomes ready, the introduction is marked consumed. The existing reduce rule disables the opacity transition as well. OS preference switching was not exercised in the browser.

Evidence inspected: artifacts/hero-entrance-2026-11-07/entrance-start.jpg and entrance-complete.jpg at 870 x 668 CSS viewport (855 x 655 rasters). Browser captured the running CSS animation at opacity .302593, duration 1.15s, and transformed matrix; completion had data-introduced=true, opacity=1, transform=none, animation=none. Moving to slide two and back retained introduced=true, animation=none, and one hero canvas. At 390 x 844 the same animation was observed in progress; mobile-complete.jpg was recaptured from scrollY=0 after rejecting an earlier offscreen/scroll-restored capture. The saved complete mobile image was opened and inspected. Browser console error log empty; mobile scroll width 375 <= viewport 390. Targeted ESLint, TypeScript and git diff --check passed. No unrelated tests/build repeated for this scoped entrance change.

final result: passed
