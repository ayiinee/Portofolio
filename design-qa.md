# Hero–About design QA — latest correction

**Preview:** http://localhost:3002/ (production build).

**Visual source:** `C:/Users/THINKPAD/Downloads/A’ini portfolio hero and about panel.png`, 1122 × 1402. The owner's latest request changes the target to a wider Hero, smaller greeting, restored original folder front, and keycaps without extra rotation. These instructions take precedence over the corresponding mockup dimensions.

## Evidence and capture conditions

- Installed Google Chrome, controlled through Playwright; deviceScaleFactor 1; fonts loaded; home route at top; reduced motion for static screenshots. Original archive animation was tested separately with motion enabled.
- Source beside production render: `artifacts/hero-review/correction-final-comparison.png`, 2244 × 1402, source left and implementation right. Opened and reviewed after the final production build.
- Source and implementation remain at the same 1122 × 1402 viewport for this comparison. There is no screenshot scaling in the saved comparison.
- Exact large desktop viewport captures: `correction-desktop-1918.png` (1918 × 861) and `correction-desktop-1536.png` (1536 × 689).
- Additional production renders: `correction-final-1440.png`, `correction-final-1024.png`, `correction-final-768.png`, `correction-final-390.png`. Focused Hero/About crops are saved as `correction-preview-*.png`.
- Baseline before this correction: `correction-before-1536.png`, `correction-before-1918.png`. Earlier `production-*`, `final-*` and `focused-*` files belong to the previous iteration and are not current evidence.

## Findings and fixes

1. **P1 — excessive left space on wide desktop.** The 1280 px centered Hero wrapper placed the heading at x224 at a 1536 px viewport and x415 at 1918 px. Hero and home navigation now span the available width with responsive gutters. Both large captures measure heading x72; the Hero wrapper starts at x0 and equals the viewport width. The illustration retains a proportional stage capped at 820 px so it does not grow without bounds. Other section wrappers were not changed in this correction.
2. **P1 — greeting too large.** The desktop heading was capped at 96 px. It now caps at 72 px, with smaller tablet sizing and the existing compact mobile layout. The original two lines and serif italic blue name remain. At 1122 px the heading is approximately 60.6 px. Its reduced height also moves the following description, social links and CTAs upward, as expected.
3. **P1 — folder front no longer had its previous shape.** Restored the original mask, edge and contact-shadow SVGs from the repository baseline together, restored the full front-panel bounds and original −1 degree transform, and restored the previous surface/blur treatment. Removed the compressed, shifted front-panel geometry. All three helper SVGs match the baseline. The original GSAP archive entrance source remains unchanged.
4. **P2 — extra keycap rotation.** Removed the −45 and −40 degree rotations from the two PNG wrappers. Both now compute to `transform: none` in the actual production browser. The photographed perspective remains part of each original image. Press feedback and keyboard/click navigation still work.

## Surfaces reviewed

- **Typography:** original Plus Jakarta Sans / Instrument Serif remain. Smaller greeting follows the latest request. ABOUT keeps its existing sans outline font and overlaps About me. Body text and other sections were not restyled.
- **Layout / spacing:** reviewed source beside 1122 render, focused large-desktop Hero captures, and tablet/mobile captures. Hero/navigation fill the screen with intentional gutters. The About panel follows the content height; at 1122 its top is y818.6, approximately 14 px below the original mockup guide after the wider Hero reflow. No fixed 1402 px page height was introduced.
- **Colors:** retained the continuous cream/blue Hero–About background. No new section-boundary gradient or white overlay was added.
- **Images:** the supplied A, Enter and lanyard PNG files match the original Downloads files by SHA-256. The lanyard remains one static artwork with its existing monogram content and sibling panel anchor.
- **Content / controls:** existing copy, social links, CTAs, navigation, four pending statistics, disabled CV control and Experience link remain. No data values or PDF URL were invented. No unrelated section was redesigned in this correction.

## Verification

- **10/10 selected Playwright tests passed**, including the two new wide viewport checks, responsive layout/navigation, keycap orientation and navigation, static lanyard, honest summaries and pending CV.
- Desktop containment checks cover 1918 × 861, 1536 × 689, 1444 × 810, 1440 × 900, 1440 × 768 and 1366 × 768. The responsive test also covers 320, 375, 390, 768, 1024, 1440 and 1920 px.
- Separate interaction script passed: original archive entrance, hover/focus lift, reduced motion, static lanyard on hover/scroll, artwork anchoring after Hero height changes, CTA links, and mobile menu/Escape focus restoration. Playwright virtual clock was used for the original archive timeline.
- Alpha sampling found no opaque lanyard material over the checked Hero/About text or controls at 1122, 1440, 1024, 768 and 390 px.
- Production screenshots at 1122, 1536, 1918, 1440, 1024, 768 and 390 px reported no horizontal overflow or browser console/page errors. Additional production geometry assertions passed at the exact two large desktop viewports.
- Production build, TypeScript check, ESLint and `git diff --check`: passed. The existing metadataBase warning remains because the deployment origin has not been configured.
- Unrelated gallery/animation suites, field performance metrics and native browser zoom were not rerun or claimed in this focused correction. The previous axe result is historical; no new accessibility audit is claimed here.

## Remaining differences from the original mockup

- The full-width desktop composition, smaller greeting and unrotated PNG wrappers intentionally follow the latest instruction. This is not a claim of pixel identity with the earlier mockup.
- ABOUT uses the original sans font as requested. The Enter PNG has a different shape and perspective from the mockup. Archive concept content is retained.
- Material reflections and shadow softness still differ from the flattened reference; the folder front now uses its previous implementation rather than the rejected reshaping.
- On narrow screens, Hero and About stack. Overlap is reduced to keep content clear. Statistics remain dashes and Download CV remains disabled until verified values and the PDF link are supplied.

No remaining P0/P1/P2 findings in the four requested corrections after the final production review. The noted reference differences are explicit constraints or residual polish.

## Latest feature — editable 3D keycap

The owner subsequently authorized replacing the ivory PNG instance with a real 3D model whose letter changes. This supersedes the previous A-keycap navigation behavior and PNG-only rendering for that one object. The original PNG file remains unchanged; the Enter keycap, original archive timeline and other sections remain as before.

- Created `public/models/aini-keycap.glb`: 65,924 bytes, self-contained glTF 2.0 binary with no external textures/buffers. Rounded tapered ivory shell, shallow top dish, stationary stem, and separate navy `Legend_A`, `Legend_I`, `Legend_N` meshes. `Pressable_Cap` moves independently of the stem.
- Model source is `scripts/create-keycap.mjs`; glyph source/attribution is retained. `public/models/KEYCAP.md` documents regeneration, node names, press travel and the glyph license.
- The Hero button cycles A → I → N → I → A through mouse, keyboard or touch, without navigating away. Enter keycap still links to Projects. There is no hover rotation or idle spin. Reduced motion applies the pressed pose without the spring transition.
- Three.js loads asynchronously on the client. Demand rendering stops at rest. Resources are disposed on unmount. If the model/WebGL is unavailable, the letter remains usable as a flat button.
- Actual production screenshots reviewed: `artifacts/hero-review/keycap-home.png`, `keycap-A.png`, `keycap-pressed.png`, `keycap-I.png`, `keycap-N.png`, plus `keycap-production-1122.png` and responsive captures at 1440/1024/768/390. Captured with installed Chrome through Playwright, deviceScaleFactor 1. The small model follows the ivory/navy palette and existing footprint; its modeled silhouette and lighting are an intentional replacement rather than a pixel clone of the PNG.
- **6/6 targeted tests passed on the final production build:** real canvas pixels change under compression; the full letter cycle works; keyboard and repeated-key handling work; mobile taps preserve Hero geometry; model failure has a functioning fallback; Enter navigation and desktop containment remain intact.
- Production screenshots and interaction capture reported no page/console errors or horizontal overflow. Build/TypeScript, scoped ESLint, GLB header/node checks and `git diff --check` passed. The existing metadataBase warning remains unrelated. PNG hashes and original Hero/unrelated section source checks passed.
- Older screenshot paths and the earlier 10-test result above document the preceding layout iteration; these are not the evidence for the 3D feature. Native device/GPU coverage and a fresh full-site accessibility audit are not claimed.

## Latest refinement — plastic shader and studio reflections

The owner asked whether the model was from Spline and requested shader/reflection work to recover the original theme. The implementation remains a custom Three.js model. This pass changes its material and lighting; it does not change the geometry, camera, layout, press travel or letter sequence.

- Replaced the shell's flat standard material with dielectric `MeshPhysicalMaterial`: satin ivory, metalness 0, roughness .34, clearcoat .28 / roughness .24, IOR 1.46. Kept the navy ink from washing out with a low-specular physical material.
- Added a shell-local procedural GLSL grain shader with small roughness, color and surface-normal variation. Screen derivatives filter the fine grain at the actual small Hero size. No time-driven shader loop or idle motion was added.
- Generated a 128 px PMREM studio environment from white/warm/blue reflection panels. The environment lights the model only; the Hero's transparent background and shared gradient remain intact. Reflection resources are released on teardown, and failed environment initialization disposes the renderer before the existing fallback activates.
- The updated self-contained model is 66,344 bytes. Its PBR clearcoat/IOR properties are included in the GLB. The custom grain and generated studio lighting are runtime features; this distinction is documented in `public/models/KEYCAP.md`.
- Opened the original ivory PNG and compared it beside the final production model in `artifacts/hero-review/material-final-source-comparison.png`. The model detail is temporarily displayed at 600 × 600 solely for material inspection. Actual 1122 × 1402 page and native keycap captures are `material-final-home.png` and `material-final-key.png`. The ivory/navy palette, subtle grain, soft edge highlights and cool side reflections were reviewed. Geometry and viewing angle still differ from the PNG; this is not an exact asset recreation.
- Initial room-lighting iteration overexposed the shell. Replaced it with a darker reflection-only studio and tuned the lighting, then recaptured. Also corrected reflected navy ink that had become gray. Final production capture reported no console/page errors, including shader compilation.
- **6/6 targeted Playwright tests passed again on the final production build**, covering actual rendered compression, letter cycle, keyboard/repeated key behavior, touch/reduced motion, fallback, Enter navigation and desktop containment. Production build/TypeScript, scoped ESLint and diff whitespace checks passed. The existing metadataBase warning remains unrelated.
- Representative responsive production captures at 1440 and 390 px were reviewed in addition to the primary viewport. Native device/GPU coverage is not claimed. The previous screenshots/test counts above are historical.

final result: passed

## Latest refinement — smaller archive, frontal Enter, edge-to-edge lanyard

- Archive stage reduced by about 10%, with an additional viewport-height limit and 16px shadow clearance on short desktop screens. Front/back, cards, labels and shadows retain their proportions and existing GSAP insertion/hover behavior. Specialties dimensions and spacing reduced separately, keeping mobile labels at 10px minimum.
- Added `public/images/design/return-keycap-front.png` (1942 × 809 RGBA) using built-in imagegen with the original asset as reference. Symmetrical frontal view, level edges, blue plastic and navy return symbol; original PNG preserved. Exact generation prompt is in the neighboring Markdown file. Enter still presses and navigates to Projects; the A/I/N/I 3D keycap is unchanged.
- Lanyard artwork now starts at viewport x=0, with artwork opacity .85 and unchanged identity opacity. Mobile artwork width is 100vw so the whole card fits. At widths >=1600px, the artwork sits lower with sufficient About height to keep its strap clear of the heading and its card fully visible.
- Final production captures: `artifacts/hero-refinement/home-{1444,1440,1366,1920,768,390}.png`, plus `wide-final-full.png`. Viewports: 1444×810, 1440×768, 1366×768, 1920×1080, 768×1024 and 390×844. Reviewed final short-laptop, wide About and mobile crops; all captures reported no horizontal overflow, page errors or console errors. All laptop labels and keycaps fit in the initial viewport.
- Validation: 15 targeted Playwright tests passed for archive motion, 3D compression/letter cycling, keyboard/reduced motion, fallback, touch, static lanyard/vertical anchoring, navigation and responsive layouts. After the final wide-layout and shadow-clearance refinements, both desktop containment and responsive/mobile navigation tests passed again (2/2) on the final production build. Local test config used installed Chrome, port 3004 and a 30s expectation timeout; the first run's 10s WebGL initialization timeouts under load were resolved on rerun, without changing keycap code.
- Final production build (including TypeScript), explicit typecheck, ESLint and diff whitespace checks passed. Existing metadataBase warning remains. Preview: http://localhost:3004/. No new full-site accessibility audit or native GPU/device coverage is claimed.

## Enter keycap — approved upright asset and press interaction (2026-10-20)

- Source visual truth: `public/images/design/return-keycap-upright.png`, 1536 x 1024 RGBA, background-extraction edit of the approved upright ImageGen result. The cap, navy arrow, raised-back viewing angle and navy socket are retained.
- Implementation: `artifacts/enter-keycap/page.png` (browser viewport capture) and `detail-normalized.png` (focused region). CSS viewport 714 x 668; browser capture 699 x 654 pixels. The screenshot provider normalizes its image density; focused comparison uses that scale. `comparison.png` puts the real source and rendered crop side by side, both enlarged to approximately 428 x 288 for inspection. Enlargement makes screenshot JPEG softness visible; it does not represent native asset quality.
- State: homepage, Enter at rest, archive in view. Full-view capture shows the component beside the existing folder without overflow or interference with the specialties panel. Focused comparison verifies the more upright face, material, arrow, cap/socket alignment and complete silhouette. No actionable P0/P1/P2 visual differences found.
- Fonts/typography: no typography added; arrow remains part of the source image. Spacing/layout: existing placement and width retained; image aspect ratio updated to match its true dimensions. Colors/tokens: approved powder-blue/navy asset retained. Image quality: alpha checked directly (outside pixels have zero alpha), no visible glow rectangle on the page. Copy/content: accessible Projects link name and destination retained.
- Pointer click and keyboard Enter both successfully scroll to Projects. Rest state returns to data-pressed=false. Browser console error log empty; no horizontal overflow at the tested viewport. TypeScript and scoped ESLint passed. Whitespace check passed. Press travel is configured as 2.5% of the image height with a spring return; socket stays outside the animated layer. Reduced-motion travel is zero.
- Limitations: held-press pixel measurement was unavailable through the in-app browser's read-only DOM scope (DOMMatrixReadOnly unsupported). No automated held-state, native touch-device, extra viewport, or full-site regression test run is claimed for this refinement. Earlier reports above describe previous work.
- Comparison history: initial screenshot detail used document/viewport coordinates inconsistently; recaptured and normalized the focused region from the actual viewport screenshot before the comparison above. This was a capture correction, not a product visual change.

final result: passed

## Hero–About gradients and A keycap removal — 2026-10-20

- Implemented the approved follow-up plan: removed the mounted A keycap from About and its placement styles. Original component/model/assets remain as source; the homepage has no 3D canvas or model request. Enter remains in the archive.
- Kept a single `.intro-flow` background with three overlapping radial layers: right-side Hero blue, left-side About blue, and a low-opacity connecting layer. Tablet/mobile centers follow the stacked layout. Gradients fade into the same paper color without section-local background edges.
- Replaced the lanyard shadow with a close blue shadow and a wider soft blue shadow. Mobile uses smaller offsets/blur. Original artwork, opacity .85, layout and identity layers are unchanged.
- Visual evidence: `artifacts/gradient-review/hero-{1440,768,390}.png`, `about-{1440,768,390}.png`, `transition-{1440,768,390}.png`, and complete `intro-{1440,768,390}.png`. Viewports 1440x900, 768x1024, 390x844; browser screenshots at native CSS density. Reviewed desktop/mobile complete composition and tablet/mobile transition captures. No visible gradient boundary or new shadow clipping. Section and lanyard typography, content and proportions retained; blue shadows follow the transparent artwork silhouette. Panel text remains readable against its pale surface.
- Validation: 14 targeted browser tests passed (Chrome against the local development server): three visual/responsive checks, A/model absence, actual held Enter cap travel with fixed socket, keyboard/reduced motion, mobile tap, five lanyard viewport checks, About anchoring, and existing summaries/CV/Enter navigation. Responsive captures reported no console/page errors and no horizontal overflow. TypeScript, scoped ESLint and diff whitespace checks passed. No production build or full-site regression suite was run for this scoped CSS/component update.

final result: passed

## Compact About with complete biography dialog — 2026-10-21

- Source visual: the user-provided screenshot, copied to `artifacts/about-refinement/source-original.png` (1918x870), plus the explicitly approved compact About plan. This is an intentional refinement, not an exact recreation of the previous oversized layout.
- Implementation evidence: `artifacts/about-refinement/about-{1918,1440,1366,1280,768,390,375}.png` at native CSS-pixel density, respectively 1918x870, 1440x900, 1366x768, 1280x720, 768x1024, 390x844, 375x667. At rest after direct #about navigation, the heading, framed lanyard and complete profile panel sit below the navbar and above the viewport bottom. No horizontal overflow was observed. The original artwork is framed, not replaced; its decorative straps may fade at the vignette edges while the identity card stays visible.
- Combined full-view comparison: `source-comparison.png` places the provided screenshot beside the final 1918x870 implementation, both normalized to 959x435. Inspected both together. The smaller/lighter overlapping heading, separated artwork, condensed panel and omission of empty stats match the approved changes. Focused visual checks: native desktop 1366 and mobile 375 captures, plus `dialog.png` (1280x720 in-app browser). Card silhouette, title separation and panel copy remain readable at native scale.
- Required fidelity surfaces: existing sans/serif typography retained, with 16px minimum profile-body text; tighter panel spacing and a separate heading/artwork grid remove overlap; approved blue gradients and silhouette shadows retained; the real PNG and identity overlay remain aligned, with soft framing instead of abrupt rectangular cuts; summary copy matches the approved wording and the original full biography remains in the dialog. CV remains honestly unavailable and Experience stays linked.
- Iteration history: first-pass vignette edges were too abrupt (P2); applied soft alpha framing and reviewed revised captures. First keyboard test found focus leaving the native dialog after Tab (P1); added explicit Tab/Shift+Tab wrapping, then the full About suite passed. No remaining actionable P0/P1/P2 findings.
- Validation: first targeted run passed 20/21 tests, then all 10 About tests passed after the focus/framing fixes; the other 11 passing tests cover Enter input/navigation and static lanyard assembly/anchoring. Two additional existing tests passed for responsive layouts/mobile navigation and keyboard/contrast/reduced motion (including axe checks across Home, Projects and a case study). About tests include seven viewport containment checks, navbar navigation from Hero and Contact, dialog focus/background scroll/Escape/close/restore, dialog axe, touch and doubled profile-body text with natural page scrolling. TypeScript, scoped ESLint and whitespace checks passed. In-app browser dialog review reported no console errors. Native device hardware and a production build were not tested.

final result: passed

## Restore original About composition, retain heading refinement — 2026-10-21

- At the owner's request, reverted the compact About redesign: restored full-size original lanyard positioning, original panel layout, complete original bio, four placeholder statistics, and original CV/Experience styling. Removed the biography dialog, summary-only copy, viewport-fit/framing styles, and tests for those removed features.
- Retained only the latest heading treatment: smaller, lighter ABOUT outline and the overlapping About me title, including responsive sizes. Earlier approved gradient/shadow updates and removal of keycap A remain intact.
- Reviewed the restored page in the in-app browser; screenshot `artifacts/about-refinement/restored-about.png`. Seven lanyard/anchoring/Enter tests passed across 1122, 1440, 1024, 768 and 390px. TypeScript and scoped ESLint passed. Previous compact About acceptance results above are historical and no longer describe the current layout.

final result: passed

## Experience compact archive and detail gallery — 2026-10-21

### Evidence

- Source: `docs/design/experience/experience-overview-approved.png` and `experience-dialog-approved.png`, each 1487 × 1058 pixels. Final requirements in `IMPLEMENTATION.md` override the eyebrow, expansion-button visibility, and gallery behavior.
- Final browser captures: `artifacts/experience/overview-1487.png` (1487 × 833 section capture), `dialog-1487.png` (1487 × 1058 viewport capture), `overview-390.png` and `dialog-390.png`. Desktop CSS viewport 1487 × 1058; phone viewport 390 × 1058; deviceScaleFactor 1. No image stretching or density rescaling was used. The overview excludes navigation/About above the section, so its shorter height is a crop difference.
- Opened and compared source and implementation together in `artifacts/experience/overview-comparison.png` and `dialog-comparison.png`. The first board preserves blank space below the shorter section capture. Focused native-scale evidence in `row-comparison.png` verifies typography, date wrapping, dividers, thumbnail size and detail controls. Focus outlines show the actual keyboard-visible state, absent in the reference.
- Responsive overflow checks additionally cover 320, 768 and 1024px. Touch/short-dialog checks use 390 × 650. No mobile visual source was provided; mobile is a responsive adaptation.

### Findings and iteration history

- P1, fixed: dialog cleanup dispatched a close event during React development effect replay and dismissed the dialog immediately. Removed the redundant close-event state handler. Escape and explicit close buttons handle dismissal.
- P1, fixed: native reverse tabbing could leave the dialog controls. Added explicit Tab/Shift+Tab boundary wrapping alongside native modal background inertness. Final focus, restoration, Escape and scroll-lock tests pass.
- P2, fixed: the first dialog lacked the small archive tab and visible contribution bullets. Added the tab and explicit disc markers; reviewed revised `dialog-comparison.png`.
- P2, fixed: narrow date columns wrapped the ending year away from its month. Dates now break between their exact start/end periods, with preserved textual whitespace. Final captures and period assertions pass.
- No remaining actionable P0/P1/P2 findings in Experience. Expected differences: the explicit 40–44px heading and modest body sizing override the larger raster target; the three-record production list needs no expansion button; missing documentation is identified honestly; focus rings remain visible.

### Required fidelity surfaces

- Typography: existing Plus Jakarta Sans and Instrument Serif; approximately 44px maximum section heading, 19px role, 15px course, 14px body/date and 32px serif year at the default root scale. Blue italic heading accent retained. Rem sizing respects root scaling; content is not clipped.
- Layout/spacing: one 1152px milky archive sheet, integrated label tab, three compact horizontal rows, fine rules, narrow date track and 170 × 96px folder-shaped thumbnails. Natural content height. Phones read date, content, thumbnail and action in order. No internal list scroller or sticky heading. The 760px rounded paper dialog scrolls internally with a reachable sticky close control.
- Colors/surfaces: warm `#fafbf7`, powder `#b7daf6`, navy `#152c49`, slate `#526887`, cobalt `#096bf0`, subtle edges/shadow and a blue blurred backdrop. Experience styles are scoped; Home/About and shared navbar sources remain unchanged.
- Images/icons: current entries deliberately have no approved photos. Empty slots follow the reference and the dialog says documentation has not been added. Lucide supplies image/close/arrow icons. Production contains no synthetic activity images. Gallery records require source, dimensions and meaningful alt text; captions are optional.
- Content/states: all three roles/course names, organizations, exact periods and contributions preserved. No ended role is labelled current. Detail and inline expansion remain distinct. Zero/one/multiple-photo, caption, selected position, disabled ends, hover/focus and reduced-motion states implemented.

### Validation and limits

- Final Experience suite: **5 passed** using installed Microsoft Edge via `PLAYWRIGHT_CHANNEL=msedge`; log `artifacts/experience/e2e-final.txt`. Covers record selection through both triggers, both close controls, Escape, focus containment/restoration, background lock/scroll restoration, initial counts 3 and 5, seven-record inline expansion fixtures, zero/one/three-photo fixtures, arrows, focused keyboard navigation, captions, reset, touch swipe, short-screen overflow and close reachability.
- Existing gallery suite: **3 passed** in the preceding combined run. The two Experience failures in that run were superseded by the final five-test pass. Axe found no WCAG A/AA violations in the tested dialog/gallery states.
- Typecheck, full ESLint, production build and smoke checks passed during implementation. Build includes TypeScript; the existing unset `metadataBase` warning remains. Smoke verifies 13 content pages, all 11 projects, anchors, metadata, assets and unknown-project 404.
- The broader suite reported two failures in unchanged Home/Projects animation expectations: `project hover and focus share one lift; reduced motion removes it` expected a transform translation although existing CSS uses individual `translate`; `cards insert once, lift on hover, and respect live motion preferences` expected unequal paper widths although the existing layout reports equal widths. Those components/styles/tests were preserved. No full-suite pass is claimed.
- The in-app browser opened the implemented detail dialog and reported no console errors. Cross-browser engines and real-device hardware were not tested.

### Maintenance

- Add approved local photos with their actual dimensions/alt text to each record's ordered `gallery` array in `src/data/experience.ts`; its first entry supplies the thumbnail. Exact instructions: `docs/design/experience/MAINTENANCE.md`.
- Set `INITIAL_EXPERIENCE_COUNT` in `ExperienceArchive.tsx` to 5 when desired. The expansion control only appears when records exceed the limit.
- Local preview remains the existing project on port 3000. No deployment or publication performed.

final result: passed

## Experience browser annotations — 2026-10-21

- Source truth: the owner's three browser comments at 714 × 668: refine the archive folder silhouette, add an outline EXPERIENCE heading like ABOUT, and remove all date-column dots. These instructions supersede the corresponding details of the original approved overview.
- Changes: added a curved folder shoulder using the repository's existing vector-surface pattern (`public/images/design/experience-folder-tab.svg`); matched tab/body paper color and removed the doubled border/rounded junction. Added an aria-hidden outline behind the existing accessible heading, using the About stroke/color/opacity treatment with responsive sizing. Removed the date pseudo-element circles while retaining the vertical dividers.
- Visual evidence: opened `artifacts/experience/annotation-comparison.png`, which places the before and after section captures together at native scale. Both use a 1487 × 1058 CSS viewport, deviceScaleFactor 1. The section crop grows by 28px to accommodate the outline; no density scaling was applied. Before source: `annotation-before-1487.png`; final: `overview-1487.png`. Also opened final `overview-714.png`, from the exact annotated 714 × 668 viewport. These native captures make the heading, tab seam and first-row divider readable without further detail crops.
- Fidelity review: existing sans/serif typography, cobalt accent, slate outline and body copy retained; heading overlap follows About. The curved folder silhouette has a continuous fill and no detached right corner. Content, thumbnail scale, row spacing, gallery and dialog behavior remain intact. This is a code-native UI surface, with no replacement photographic assets. The decorative outline is hidden from assistive technology, so the section's accessible name stays The journey so far.
- Checks: existing production archive test passed at 320, 390, 714, 768, 1024 and 1487px, including detail opening/closing and no horizontal overflow. Typecheck, scoped ESLint and diff whitespace checks passed. In-app browser inspection confirmed EXPERIENCE text, `::after` content `none` for all three dates, no horizontal overflow and no console errors. Full suite/build were not repeated for these scoped presentation edits.
- Findings: no remaining actionable P0/P1/P2 issue within the three requested annotations. Home/About and navbar sources remain unchanged by this revision.

final result: passed

## Projects review applied; Experience expansion — 2026-10-21

### Source and visual evidence

- Read the referenced chat `Cari referensi Journey So Far` with `read_thread`, then read its actual `projects-four-review/review.md` and opened its source screenshots. A copy of that review and its linked images is in `docs/design/projects/`.
- The target is the review's explicit recommendations for the existing four-card section, rather than a new visual concept: 40–44px heading, 18–20px names, 14–16px summary, 12px chips, 16:9 covers, 1152px frame, lighter paper materials and the Experience palette.
- Reviewed source and final render together in `artifacts/projects-review/comparison.png` and `detail-comparison.png`. The baseline section image is 1120 × 1603, placed on a 1264px-wide canvas without scaling; final section capture is 1264 × 1430 from a 1264 × 1000 CSS viewport, density 1. The source section crop already clips some left-edge text; original full viewport `03-after-top.png` and `04-after-bottom.png` were also opened to check that text. Crop differences are not product findings.
- Final captures also include `projects-390.png` (390 × 2325), `projects-768.png` (768 × 1363) and `projects-1440.png` (1440 × 1431). These are content-only section captures: floating shared navigation, skip link and development tools were hidden only during capture, so they do not obscure the cards. Application navigation remains functional and was tested separately.

### Fidelity and iteration

- Typography and content: retained Jakarta Sans and Instrument Serif, the original heading words and four factual project identities. Measured desktop heading 42.98px, names 19px, chips 12px; body 14px. Three tags per card and concise homepage-only `cardSummary` text provide two-line desktop summaries without clipping mobile text. The PROJECTS outline mirrors Experience. Case-study descriptions and metadata are preserved.
- Spacing and surfaces: 1152px centered frame aligns with Experience; desktop grid remains 2 × 2 with 28px horizontal/36px vertical gaps. Cover/info form one rounded milky paper surface. The background uses warm `#fafbf7`, subtle powder blue, navy `#152c49`, slate `#526887` and cobalt `#096bf0`. The collection link uses a navy pill. Mobile stacks all four cards naturally.
- Images: 16:9 slots preserve complete real diagrams through the existing contain behavior. No approved covers are present, so the review's explicit placeholder fallback is used: full distinct project names plus an unavailable-image label. No real application screen or architecture diagram was invented. Shared collection placeholders keep their original default mode.
- States/icons: each whole-card link and its visible View details cue leads to the existing case study; the footer link reaches the complete collection. Existing Lucide arrow icons, focus indicators, hover and reduced-motion handling remain. The owner-selected Experience behavior now shows two records and reveals the third inline, with a 236 × 46px navy pill and collapse action.
- Initial capture issue, corrected: fixed navbar and offscreen reveal states obscured the full-section browser capture. Final reduced-motion captures expose all cards and exclude only floating shared UI. This was a capture correction, not an application layout workaround. No remaining actionable P0/P1/P2 issue was found against the requested review; real media remains an explicit content gap.

### Verification

- Production build (including TypeScript), explicit typecheck, scoped ESLint and smoke checks passed. Smoke confirms four homepage selections, all 11 case studies, metadata, anchors, static assets and 404. The existing unset metadataBase warning remains.
- Six distinct relevant Playwright scenarios passed across the final run and targeted rerun: Experience initial two/expand-to-three and detail accessibility/focus/scroll; homepage anchors; collection filtering/Load More/case-study routing; responsive layout/mobile navigation; and keyboard/axe contrast/reduced motion on Home, collection and a case study.
- The first run encountered concurrent tests deleting the shared trace directory, so later runs used isolated output folders. A case-study route initially exceeded the 10s expectation during development compilation; the same collection test passed on rerun without application changes. Logs: `artifacts/projects-review/validation.txt` (5 passed, 1 route timeout), `recheck.txt` (2 passed).
- Responsive checks cover 320, 375, 390, 768, 1024, 1264, 1440 and 1920px, with no horizontal overflow. Existing homepage navigation testing was updated to scroll upward before using the navbar, matching its current intentional hide-on-downward-scroll behavior.
- This implementation scopes the new design to the homepage Projects section. Concurrent edits to shared navigation, profile data and language were preserved. No deployment or publication was performed.

final result: passed

## Collection and project story redesign — 2026-10-21

### Findings and resolution

- No remaining actionable P0/P1/P2 issue in the requested collection/detail redesign. The owner explicitly requested an additive adaptation of the attached story layout within the existing portfolio style, rather than a wholesale copy of the dark screenshot.
- Reading measure refinement: the first desktop inspection exposed a broad narrative column. Limited narrative content to 75ch while allowing galleries/architecture to use the available column. Recaptured and opened `detail-after-aligned.png` after the change; body copy remains readable with the metadata rail and contribution ordinals clearly separated.
- Existing content gaps remain explicit: project photos/covers have not been supplied. Existing unavailable-image states remain; no screenshots, personal contributions, dates, or technical claims were invented. Optional `timeline` is supported but omitted when absent from the record.

### Source and comparison evidence

- Structural reference: owner attachment copied to `artifacts/project-routes-redesign/reference-story.png` (1458 × 816 pixels). Palette and card source: existing Home/selected Projects, captured in `home-selected-source.png` (1265 × 712 pixels); the fixed shared navbar obscures part of that source header, so this capture is used for its visible card treatment rather than header-position precision.
- Final collection: `artifacts/project-routes-redesign/collection-after-desktop.png`; final story: `detail-after-aligned.png`; supplemental contribution view: `detail-after-desktop-story.png`. All desktop final screenshots were requested at a 1458 × 816 CSS viewport; browser screenshot output is 1443 × 807 pixels. The source is 1458 × 816; the browser returned a slightly smaller raster. Images were opened together in one comparison input without rescaling; no pixel-perfect clone or exact raster-density match is claimed. Structure, hierarchy, line wrapping and palette are the intended comparisons.
- Opened Home card source and final collection together, then opened the owner's exact reference and final aligned story together. The story capture starts with metadata and Overview near the top, followed by Challenge and What I did, matching the reference's reading state. This preserves the existing Challenge content and therefore intentionally makes What I did section 03. Differences in facts, paragraph lengths, theme, type size and section order reflect the owner's existing site/content and additive scope.
- Mobile evidence: `collection-after-mobile.png` and `detail-after-mobile-header.png` / `detail-after-mobile-story.png`, requested at 390 × 844 CSS pixels; returned collection raster is 375 × 811 pixels. Opened the saved mobile collection and story images to verify wrapping, stacked metadata, chips and narrative. The desktop story and mobile story already make typography, chips, borders and ordinals readable, so no extra magnification crop was needed.

### Required fidelity surfaces

- Typography: existing Plus Jakarta Sans and Instrument Serif. Compact collection heading approximately 40–44px, card names 19px, summaries 14px and chips 12px at the default root scale. Narrative headings 26px desktop / 22px mobile; body 15px / 14px. Retained the serif blue accent and outline PROJECTS treatment. No fixed-height text clipping.
- Layout/spacing: 1152px centered frame; collection uses three columns on wide desktops, two on tablets and one on phones. Covers are 16:9 and card content stretches consistently. Detail preserves header, cover, gallery, external links and adjacent-project navigation; the new reading area uses a 240px metadata rail plus narrative, collapsing to one column below 760px. Thin rules and comfortable section spacing establish hierarchy.
- Colors/tokens: warm #fafbf7, powder blue #b7daf6, navy #152c49, slate #526887 and cobalt #096bf0 follow Home/About/Experience. Light paper surfaces, soft outlines and restrained shadows are intentional adaptations of the dark structural reference. Styles are route scoped; Home still contains exactly four selected projects.
- Images/icons: retained original media dimensions, contain behavior, provenance captions and working ProjectGallery component. Full project names distinguish the existing empty covers. Existing Lucide arrows remain. The supplied reference has no photo asset to recreate; no raster asset generation was needed.
- Copy/content/states: all existing project records, overview paragraphs, challenges, contribution statements/bullets, engineering highlights, architecture, limitations and links are preserved. Roles and technologies come from local project data rather than the different claims in the screenshot. The new semantic ordered contribution list keeps all six WaspadAI contributions.

### Verification and handoff

- Production build passed with all 11 static project pages. Existing metadataBase warning remains. After the final Next Image priority-to-preload update, explicit typecheck and scoped ESLint passed again; diff whitespace check passed. Relevant bundled Next.js routing, CSS, server/client and Image documentation was read before implementation.
- HTTP smoke passed for 13 content pages, all 11 projects, homepage selected-count four, metadata, anchors, assets and unknown-project 404.
- In-app browser: exercised every category (Cloud 2, Backend 4, AI 3, GIS 2), All initial six, Load More to all 11, collection-to-detail navigation, and return to selected Home projects. Mobile AI filter and WaspadAI navigation also worked. Collection no-overflow checks: 320, 390, 768 and desktop widths; story: 320, 390, 768, 1440 and 1458. Browser console error check returned none.
- Existing gallery code is reused. No new real-photo/lightbox fixture, cross-browser engine run or full Playwright suite was performed for this change. Prior unrelated working-tree edits were preserved.
- Implementation checklist complete: collection restyled, reference structure added to detail, source facts retained, responsive browser checks complete, build/typecheck/lint/smoke passed, screenshots opened and compared. Local collection and WaspadAI previews remain open. No deployment/publication performed.

final result: passed

## Case-study cover size and back visibility — 2026-10-21

- Source truth: the owner's two annotations on `/projects/aws-serverless-ticketing`: reduce the oversized desktop cover and improve Back to Projects visibility. Scoped changes are in route-local `projects.css` and the detail page's empty-cover class/arrow semantics.
- Desktop at 1440 × 900 CSS pixels: measured cover reduced from 1152 × 648 to 880 × 320. Figures now cap at 880px; actual-image containers cap at 420px high. Empty covers use a responsive 180–320px height and smaller 24–36px placeholder typography, retaining the complete project identity and honest unavailable-media label. Existing diagram containment stays intact.
- Back to Projects now has navy text, an opaque white pill, defined border, larger arrow, hover styling, and a minimum 44px target. Its accessible name and `/projects` destination remain. At 484 × 668 it measures about 171 × 44, starts at y112 below the navbar, and successfully navigates to `/projects` with keyboard Enter.
- Visual evidence: `artifacts/case-hero-refinement/before-1440.png` and `after-1440.png` were opened together in `comparison.png`. Both API captures are 1425 × 891 from the same 1440 × 900 CSS viewport, without further scaling; provider raster normalization is shared. `after-484.png` is 469 × 647 from the annotated 484 × 668 CSS viewport and was also opened. These native captures clearly show both requested surfaces, so another focused crop was unnecessary.
- Fidelity surfaces: existing sans/serif pairing, copy, navy/slate/powder palette, rounded paper surface, media state and surrounding layout retained. Only cover bounds/placeholder scale and back-control contrast/padding changed. No replacement image assets or project facts were introduced. The smaller hero brings project metadata and Overview higher in the document.
- P2 found and fixed during validation: the old mobile 16:9 rule combined with the new fixed empty-slot height produced a 320px intrinsic width inside a 276px container. Added explicit 100% width and a more-specific auto aspect ratio for empty covers. The responsive test passed after that correction; no actionable P0/P1/P2 issue remains.
- Checks: typecheck, scoped ESLint and whitespace validation passed. Existing metadata/navigation coverage passed for all 11 case studies; keyboard/axe contrast/reduced-motion coverage passed. Responsive/mobile-navigation coverage passed on rerun at 320, 375, 390, 768, 1024, 1264, 1440 and 1920px. Manual annotated-viewport check found no horizontal overflow and verified the back action. Logs: `artifacts/case-hero-refinement/validation.txt` and `recheck.txt`. Full build/suite were not repeated for these scoped presentation edits.

final result: passed

## Centered 16:9 project gallery — 2026-10-21

- Source truth: owner's AWS detail annotations request a centered Devpost-inspired gallery, smaller title, landscape 16:9 media and carousel. Inspected https://devpost.com/software/hack-stack in the browser and saved `artifacts/case-carousel/devpost-reference.png`. Its centered title and media-before-story hierarchy informed this scoped adaptation. Existing portfolio palette, navigation, typography and narrative remain authoritative.
- Layout: introduction centered at an 800px measure; title now 30–36px desktop and 28–30px mobile at the 14px root scale. Media is centered, capped at 800px and exactly 16:9 for empty and populated states. The previous fixed-height empty-cover rule is superseded by the owner's explicit landscape request. Back to Projects retains its visible 44px pill outside the centered introduction.
- Media behavior: cover first, then gallery, deduplicated by src. Reused Embla and the existing lightbox with a hero variant, thumbnail navigation, captions/provenance and contain sizing. No duplicate A closer look section remains below the story; architecture media stays in its contextual section. Arrows, keyboard and swipe synchronize thumbnails. Inactive slides remain inert; lightbox focus restores. Reduced motion sets Embla duration to zero. No autoplay.
- Honest states: all current production records lack approved image files. Empty slots show the existing explicit label and no controls; one image can enlarge; multiple images reveal navigation and thumbnails. Synthetic 800x500 test images remain confined to the fixture app and demonstrate containment within the 16:9 slot. No project imagery or facts were fabricated.
- Visual evidence opened together: previous `artifacts/case-hero-refinement/after-1440.png` and current `artifacts/case-carousel/after-1440.png`, both 1425x891 raster from a 1440x900 CSS viewport, without rescaling. Also opened the actual Devpost source and current desktop/mobile captures together. Devpost is a structural reference rather than a pixel clone; its source capture uses the default 1280x720 CSS viewport (1265x712 raster), while the current annotated 484x668 viewport yields 469x647. `carousel-fixture.png` plus manual browser thumbnail selection verify populated media treatment. No further magnification was needed for the requested surfaces.
- Fidelity review: existing Plus Jakarta Sans / Instrument Serif pairing, navy/slate/powder-blue colors, rounded border and truthful copy retained. Title hierarchy and balanced wrapping are smaller, media centered, metadata/story still flow below. All image content is contained; captions and control targets remain readable. No remaining actionable P0/P1/P2 issue in the requested scope.
- Verification: typecheck, scoped ESLint, whitespace checks and production build passed (all eleven project routes). Eight distinct Playwright scenarios passed across the initial run and focused rerun: empty/single media and focus restoration; inline gallery controls/lightbox/axe; hero thumbnail/keyboard/lightbox synchronization and 16:9 slots at 320/484/1440; touch swipes on both gallery variants; every detail route and metadata; responsive navigation at eight widths; keyboard/contrast/reduced motion; and no-JavaScript reading. The first hero-test assertion wrongly expected role queries to omit inert elements; corrected the assertion to inspect inert slide state, then reran successfully. The existing metadataBase warning persists. No deployment performed.

final result: passed

## Project introduction alignment correction — 2026-10-21

- Owner clarification: the annotated category, title and description should be left aligned; only the media gallery should be centered. Supersedes the centered-introduction choice documented above.
- Updated route-local header alignment/margins, eyebrow flex alignment and introduction margins. Smaller typography and the centered 16:9 carousel remain intact. Updated the gallery design note accordingly.
- Browser verification at the supplied narrow viewport: category, title and paragraph align with the Back to Projects control and page edge. Computed text alignment is left, eyebrow justification is flex-start, introduction left margin is 0, and horizontal overflow is absent. Saved and opened `artifacts/case-text-alignment/after.png`; compared with the owner's annotated centered state. Existing colors, content, line height and gallery treatment are retained. No remaining actionable issue in this correction.
- CSS-only adjustment verified visually; no additional automated test or production build was needed.

final result: passed

## Project detail Impact & achievements — 2026-10-21

- Owner explicitly selected project detail pages, rather than the homepage Achievement section. Added a numbered Impact & achievements section after engineering/architecture and before project context, with Project outcomes and optional Milestones & recognition groups.
- Added optional impact/achievements arrays to Project and documented editing in `docs/design/projects/IMPACT-ACHIEVEMENTS.md`. Server-rendered content uses semantic headings and lists. Empty groups and a fully empty section are omitted; narrative numbering remains automatic.
- Content for all 11 projects summarizes existing documented capabilities and contribution statements. Where recorded, provincial competition participation and hackathon MVP/prototype/concept stages appear as milestones. No measured user/business results, placement awards, feature ownership, or relationships between general profile awards and particular projects were invented. Anabool explicitly retains concept status and unknown implementation/real-world outcomes.
- Presentation follows the existing narrative column: restrained powder-blue card, navy subgroup headings, slate text, thin separators, rounded corners, and the site's existing typography. Browser inspection confirmed readable desktop/mobile wrapping and no horizontal overflow at 320px. Opened saved desktop and mobile screenshots during verification: `artifacts/project-impact/impact-1440.png` (1440x900 CSS viewport) and `impact-484.png` (484x800 CSS viewport). Screenshots retain the native browser raster. No actionable issue remains in this scope.
- Verification passed: production build (all 11 static project detail routes), explicit typecheck, scoped ESLint, whitespace check and HTTP smoke. Two focused Playwright scenarios passed: content/metadata/navigation for every project, including outcomes and conditional milestones; and keyboard, contrast/axe and reduced-motion coverage. Existing metadataBase warning persists. No deployment performed.

final result: passed

## Detail palette and gradient refinement — 2026-10-21

### Findings and comparison

- No actionable P0/P1/P2 issue remains in this scoped refinement. The owner requested closer alignment with Home/About colors and more visible gradients/depth on existing detail pages. Existing local screenshots and the implemented portfolio palette remain the target; this is an additive style revision, not a new layout concept.
- Source/current-state evidence: `artifacts/project-routes-redesign/color-refinement/before-header.png` and `before-story.png`. Final evidence: `after-header.png`, `after-story-focused.png`, `after-mobile.png`, and `after-long-title-mobile.png` in the same folder. Opened before/after header images together in one tool input alongside final story/mobile captures. The original Home palette/card source was already opened in the preceding comparison.
- Header before/after are both the WaspadAI route at scroll top in the default 870 × 668 CSS viewport; both saved images are 855 × 656 pixels. No image rescaling performed. The floating shared navbar changes its existing appearance with scroll history; it was not edited. The new category pill intentionally adds modest height before the existing gallery. Story capture is a supplemental focused reading-state view, rather than an exact before/after scroll-position match.
- Responsive snapshots: WaspadAI at 390 × 900 CSS pixels (375 × 864 returned raster) and AWS Infrastructure Automation & Recovery at 320 × 844 CSS pixels (305 × 804 raster). The browser capture returns a smaller raster than the DOM-reported viewport; no exact 1:1 pixel fidelity is claimed. No fixed device frame or extra normalization was used.

### Required fidelity surfaces

- Typography: retained the existing Jakarta Sans / Instrument Serif families, header sizes, 26px desktop / 22px mobile section titles, 15px / 14px narrative text and all wrapping behavior. Title ink now matches navy. Section ordinals gain small blue tinted badges while maintaining the established hierarchy.
- Layout/spacing: retained the existing left-aligned introduction, centered gallery, metadata/narrative columns and mobile stacking. Metadata becomes a padded 18px-radius paper surface; Overview gains a 20px-radius panel, with 28px desktop / 22px mobile padding. Remaining narrative stays open, separated by existing rules. Adjacent-project links gain restrained paper surfaces. No sticky regions, motion or extra controls were added.
- Colors/tokens: detail-only background uses the existing warm #fafbf7 base with powder #b7daf6 radial washes at top, middle-left and lower-right. White-to-blue gradients on metadata/Overview/outcomes and the empty hero create depth, with subtle white borders and navy-tinted shadows. Body slate #526887 and navy #152c49 remain legible over the light surfaces. Tech chips use translucent white to separate them from the metadata panel.
- Images/icons: no image files, gallery content, image contain behavior, thumbnails or icon assets changed. The existing missing-image state receives a surface gradient; it still explicitly identifies missing project imagery. This is background material styling, not a substitute image asset.
- Copy/content/states: all project facts and narrative remain intact, including six WaspadAI contributions and current impact/achievement content. Only a detail-route modifier class and existing route stylesheet were edited. Existing collection/Home, gallery interactions and content work from other edits were preserved.

### Verification

- Browser no-overflow checks at 320, 390, 768 and 1440px passed for WaspadAI; verified 14px mobile / 14.994px desktop body text and six contribution items. Inspected saved mobile screenshots and the long AWS title at 320px: no clipped content or horizontal overflow.
- Clicked the adjacent-project link to AWS Infrastructure Automation & Recovery and Back to Projects. Collection still shows six initial cards and has no detail background modifier. Browser console error check returned none.
- Production build, including TypeScript and all 11 static project pages, passed. Scoped route ESLint and whitespace checks passed. Existing unset metadataBase warning remains. No new tests were added for these reversible visual changes; the full e2e suite and real-photo/lightbox fixtures were not rerun.
- Responsive viewport overrides reset; collection and detail previews kept open. No publication or deployment performed.

final result: passed

## Detail narrative panel annotation — 2026-10-21

- Source truth: browser Comment 1 asks for matching backgrounds on the unframed The challenge / What I did area. This supersedes the preceding refinement's choice to leave later narrative sections open. The supplied annotation is a structural/style instruction rather than a pixel-identical target at the current browser width.
- [P2] Resolved: narrative surfaces were inconsistent with Overview. Applied its exact white-to-blue gradient, white border, 20px radius and subtle shadow to all case-section panels, with 24px gaps. Removed the old between-section rules and the now-redundant inner Impact panel surface. Desktop padding is 28px; phone padding is 22px. Only the existing route CSS changed.
- Evidence: opened `artifacts/project-routes-redesign/panel-consistency/before.png` and `after.png` together in one comparison input, plus `mobile.png`. Before/after show WaspadAI's Challenge/Contribution reading state at the same default 754 × 668 CSS viewport, both 739 × 655 returned pixels. Browser scroll anchoring shifts nearby content slightly after panel padding changes; no rescaling or exact pixel-clone claim. Mobile is 390 × 900 CSS / 375 × 864 pixels. These focused views show the full panel widths, typography, borders and gradient treatment clearly; no further detail crop was needed.
- Fidelity surfaces: existing Jakarta Sans/Instrument Serif families, font sizes, navy/slate copy, blue ordinals and all content preserved. Panel spacing and materials now match Overview throughout. Images/icons and gallery behavior are untouched; no new assets. All six WaspadAI sections report the same computed background/radius/padding; all six contribution items remain.
- Checks: browser layout at 320, 390, 754 and 1440px has no horizontal overflow; saved desktop/mobile screenshots inspected. No browser console errors. Whitespace check passed. No new tests or repeated build/full suite for this scoped CSS-only annotation; the immediately preceding production build passed before this edit. Viewport overrides reset and previews retained.
- No remaining actionable P0/P1/P2 findings for this annotation. No deployment/publication performed.

final result: passed

## Detail back-button size annotation — 2026-10-21

- Owner request: reduce the oversized Back to Projects button. Scoped CSS change: height 44 → 34px, padding 9px 16px → 6px 11px, label 14 → 13px, arrow 18 → 14px, gap 10 → 6px. Measured width 171.1 → 145.3px. Color, pill shape, border, shadow, focus/hover styling and /projects destination preserved.
- Opened source `back-button/before.png` and final `back-button/after.png` together, under the existing local visualization directory `project-routes-redesign/`, at the same 754 × 668 CSS viewport / 739 × 655 raster and scroll-top state. No resizing or density normalization; the focused header region is legible in both full captures. Typography/spacing changes match the explicit request; other content, assets, background and layout retained.
- Browser confirms 34px rendered height, 13.006px label and /projects link target. No actionable P0/P1/P2 findings. CSS-only revision; no new tests or repeated build. Preview retained.

final result: passed

## Homepage Skills refinement — 2026-10-27

- Updated Skills to follow the existing Home, Experience and Projects palette, typography, outline heading and content width. Five paper cards retain all original descriptions and 55 technology/service tags. Cloud has a separate AWS services panel beside its introduction on desktop; cards and the panel stack on phones.
- Scoped presentation lives in src/app/skills.css, imported after selected-projects.css. No data or proficiency claims changed. Existing Reveal motion and reduced-motion handling remain in place. Technology groups now use semantic lists.
- Passed npm run typecheck, npm run lint and git diff --check. Chrome checks at 320, 390, 768, 1024 and 1440px retained all five categories and 55 tags without horizontal overflow. A scoped axe WCAG A/AA check reported no violations; no uncaught page errors occurred during that check.
- Opened and visually reviewed desktop and phone captures. Evidence is in artifacts/skills-review/ (before-desktop.png, after-desktop.png, after-mobile.png and preview-desktop.png). Browser captures include the existing fixed navigation. No production build or deployment performed. Development preview remains at http://localhost:3000/#skills.
