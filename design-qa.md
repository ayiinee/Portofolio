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
