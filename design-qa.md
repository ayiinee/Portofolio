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
