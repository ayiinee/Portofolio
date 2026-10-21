# Experience archive

The implementation follows `IMPLEMENTATION.md`. Current records remain in
`src/data/experience.ts`; no documentary images have been supplied yet.

## Adding real photos

Place approved activity images in `public/images/experience/`, then add a
`gallery` array to the corresponding experience record:

```ts
gallery: [
  {
    src: "/images/experience/database-practical.jpg",
    width: 1600,
    height: 1067,
    alt: "Describe the actual activity visible in this approved photo",
    caption: "Optional context for this activity",
  },
],
```

This is an example shape, not an existing photo. Use the actual file name and
intrinsic image dimensions. The array order determines the gallery order, and
the first photo supplies the row thumbnail. Omit `gallery` or leave it empty to
show the deliberate empty state. One photo has no carousel controls; two or
more enable previous/next, the position indicator, arrow keys when the gallery
is focused, and touch swipe. Opening a detail always starts at the first photo.
Local public assets work immediately; external image hosts must be allowed in
Next.js `images.remotePatterns` before using them.

## Initial list size

Change `INITIAL_EXPERIENCE_COUNT` in
`src/components/experience/ExperienceArchive.tsx` from `2` to `3` or `5`, or pass an
`initialCount` prop. The expansion control only appears when there are more
records than this count. It expands the same list without navigation.
The owner selected two initial records so the third real experience is revealed
by the visible "Lihat selengkapnya" control.

## Verification

`tests/e2e/experience.spec.ts` covers the real portfolio plus synthetic records
in the existing `tests/gallery-app` test harness. Synthetic records and SVG
images never enter production data. Run with `npm run test:e2e`; if Playwright's
bundled Chromium is unavailable, the existing configuration accepts
`PLAYWRIGHT_CHANNEL=msedge` for installed Microsoft Edge.
