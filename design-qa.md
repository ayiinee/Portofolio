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
