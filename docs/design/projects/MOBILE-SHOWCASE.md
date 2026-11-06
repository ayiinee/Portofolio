# Reusable mobile app showcase

WaspadAI is the first project using `Project.mobileShowcase`. Other projects keep the existing cover and gallery. WaspadAI's hero and card use the owner's original Canva JPEG intact, because exact fidelity is now the priority. The hero is static artwork; reusable, directly draggable Three.js devices remain on feature slides. Engineering narrative and metadata remain below.

## Add screenshots or another app

1. Place original screenshots under `public/images/projects/<slug>/`. Prefer raw screens without device frames. Screens already composited into a phone should be replaced with the raw originals for a clean result.
2. Add a `mobileShowcase` configuration to the project in `src/data/projects.ts`. For generated layouts, supply theme colors, optional `backgroundPhoto`, optional `accent`, overlay opacity (0–1), and optionally a real app `logo`. Photo themes use a white overlay, a horizontal brand-color band, and a wordmark; an optional `illustration` remains supported for other themes. Store any required source attribution alongside third-party assets.
3. Give each screen a stable `id`, a `label`, and optional `media` using the existing `ProjectMedia` fields (`src`, intrinsic dimensions, meaningful `alt`, `caption`, `type`). Omit `media` until a genuine screenshot is available. Do not insert fabricated application UI.
4. Reference screen IDs in `hero.screenIds` and each slide. Use `hero` for two tilted phones, `feature` for one phone, `comparison` for two screens, and `scroll` for one phone plus a full-length screenshot strip. At most two device screens are rendered per scene. For `scroll`, the first screen belongs to the phone and the second to the strip. Each slide has an `id`, `eyebrow`, `title`, `description`, optional `annotations`, and optional transparent `poster` path. Set optional `artwork: ProjectMedia` to display an authored composition intact instead of the generated layout. The card automatically uses the hero artwork when present.
5. Write explanations from verified project facts. The screenshot alone does not establish implementation status, ownership, usage, or measured outcomes. WaspadAI uses the exact supplied JPEG, including its original skyline, branding, and overlay; the former substitute skyline is no longer used.
6. Regenerate posters after changing screen media, labels, layout, or the device scene. Updating text outside the devices or CSS colors does not require new posters.

Example screen entry:

```ts
{
  id: "verification",
  label: "Verification result",
  media: {
    src: "/images/projects/waspadai/verification.webp",
    width: 1080,
    height: 2400,
    alt: "WaspadAI verification result with evidence and safety recommendations",
    caption: "Verification result in the Android application.",
    type: "mobile",
  },
}
```

Screens are letterboxed inside the device to preserve their full aspect ratio; no stretching or destructive cropping is applied. Long screenshots belong in a `scroll` slide, whose separate strip preserves the original height. “View …” opens the original image in the existing lightbox.

## Capture posters

Start the site with `npm run dev -- --port 3002`. Give each slide a `.png` poster path under `/images/projects/<slug>/`, then run in PowerShell:

```powershell
$env:SHOWCASE_ORIGIN = 'http://localhost:3002'
$env:PLAYWRIGHT_CHANNEL = 'chrome' # or omit when Playwright Chromium is installed
node scripts/capture-showcase.mjs waspadai
```

The script visits the actual project, skips authored artwork slides, selects each generated slide, and saves the transparent canvas from the shared scene to its configured poster path. Commit these generated images with screenshot changes. They are displayed before 3D loads, without JavaScript, and when WebGL or a texture fails. Without a configured poster, the component uses a simple HTML phone preview instead. Posters are scene snapshots and can become stale if not regenerated.

Authored artwork is served unchanged with image optimization disabled. It retains its full 16:9 composition on every screen, with no CSS crop, filter, replacement overlay, or rounded clipping. Click/tap it to enlarge. Since its text and devices are baked into the image, changing its screenshots requires a fresh Canva export; changing feature screenshots still only requires replacing `screens[].media` and regenerating feature posters. The original JPEG SHA-256 is recorded in `CREDITS.txt` and checked by the browser test.

## Interaction and resource lifecycle

Three.js is imported only for the active visible slide. Rendering happens on load, resize, drag, keyboard rotation, or reset; there is no idle loop or device auto-rotation. Devices rotate directly on drag, together, with full horizontal rotation and limited vertical tilt; zoom is disabled. No entry/exit button is needed. Double-click, Home, or Escape resets the composition. Arrow keys rotate when the device area has focus, and navigate slides when the carousel viewport has focus. Embla ignores gestures starting on a device; swiping text or other slide space navigates the carousel.

Navigation uses three bare dots under the artwork, based on [Apple's page control guidance](https://developer.apple.com/design/human-interface-guidelines/page-controls). There are no arrow buttons, capsule, thumbnails, or visible counter. A playback control appears only when keyboard focused; Space on the carousel viewport also pauses/resumes playback. Slides loop every 6.5 seconds with smooth movement and automatic height adjustment. Autoplay pauses on mouse hover, keyboard focus, device drag, open lightbox, hidden document, or leaving the viewport. An explicit pause remains in effect until Play is chosen. Reduced motion disables autoplay and carousel animation; direct device rotation remains available on generated feature slides.

Leaving the viewport or changing slides releases the renderer, textures, geometry, materials, shadows, observers, and pending animation frame. WebGL/context or texture failures retain the poster and carousel controls. Server-rendered slides are stacked and readable before hydration and without JavaScript; enhancement adds carousel navigation and makes inactive slides inert.

## Verification

`tests/e2e/mobile-showcase.spec.ts` covers rotation/reset, navigation, touch gesture separation, resource release, responsive cards/slides, no-JavaScript reading, WebGL failure, original-image lightbox/focus restoration, long screenshots, and missing-texture recovery. The QA-only `/showcase` route on port 3101 uses synthetic screenshots; these are never production project media.

Run `npm run typecheck`, `npm run lint`, `npm run build`, then `npm run test:e2e -- tests/e2e/mobile-showcase.spec.ts tests/e2e/gallery.spec.ts`. Use `PLAYWRIGHT_CHANNEL=chrome` when bundled Chromium is unavailable. Responsive evidence is saved under `artifacts/mobile-showcase/`.

Verified on 1 November 2026: typecheck, full ESLint (with focused checks after follow-up edits), production build, and the 14-page smoke check passed. Twelve distinct Playwright scenarios passed across the initial run and focused reruns: four existing gallery scenarios, six showcase scenarios, collection filtering, and all eleven case-study routes/metadata. Responsive covers and every showcase slide were checked at 320, 390, 768, and 1440 pixels. Axe found no WCAG A/AA violations in the WaspadAI showcase. Evidence includes `home-<width>.png`, `collection-<width>.png`, and `detail-<width>-<slide>.png` in `artifacts/mobile-showcase/`. Chrome was used because the installed Playwright browser revision did not match the current package. No deployment was performed.

Revision verified on 2 November 2026: the owner's Gambar Porto JPEG/Canva direction replaces WaspadAI's shield/orbit illustration with a desaturated city photo, white overlay, blue horizontal band, and yellow accent. The Canva share link permitted reference previews but not individual asset access; the alternative skyline is Ibhi19's unchanged original JPEG from Wikimedia Commons (CC BY-SA 4.0), credited via the in-frame information link and `public/images/projects/waspadai/CREDITS.txt`. The obsolete shield SVG is removed. Thumbnails, the visible counter, the external toolbar, and the rotation entry button are removed. Direct rotation, in-frame dash/arrow navigation, and smooth looping autoplay are covered by seven showcase scenarios; all seven plus four existing gallery scenarios passed together (11 tests). Typecheck, full/focused ESLint, the final production build, the 14-page smoke check, and the in-showcase Axe check passed. Responsive evidence at 320/390/768/1440 is refreshed in `artifacts/mobile-showcase/`; additional design previews are in `artifacts/showcase-revision/`.

Subsequent fidelity correction on 2 November 2026 supersedes the approximation above: WaspadAI's hero and card now render the supplied `Gambar Porto.jpg` unchanged at its original 16:9 ratio. No CSS crop, filter, replacement photo, rewritten typography, or rounded hero clipping is applied. The original SHA-256 is `a58291fe523a451ff3097d6a6d5ef7807513cc3eef406c94dfef23fee1135c58`; the browser test verifies the bytes served by the site. This deliberately makes the hero static authored artwork; changing its embedded devices requires a new Canva export. Feature slides retain replaceable, directly draggable 3D screens, now populated with original application screenshots extracted from the local WaspadAI presentation export (pages 12 and 14). Feature posters were regenerated. The substitute skyline file and all arrow buttons are removed. Three small dots below the image replace the capsule navigation. The playback control appears on keyboard focus, and Space also controls playback. The hero opens in the existing lightbox or, without JavaScript, as its original file.

The final production build, full/focused ESLint, typecheck, 14-page smoke check, and all 11 gallery/showcase Playwright scenarios passed, including original-file integrity, hero enlargement, responsive 16:9 covers, automatic slide height, 3D interaction on feature slides, autoplay, no-JavaScript reading, and failure recovery. Additional visual previews are saved under `artifacts/canva-fidelity/`; responsive evidence is refreshed under `artifacts/mobile-showcase/`.
