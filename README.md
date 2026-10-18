# Qurrotul A’ini — Personal Portfolio

An English-language engineering portfolio built with Next.js App Router, TypeScript, Tailwind CSS, GSAP, Lenis, and Lucide. The editorial design pairs warm white, cobalt folders, selective glass, and an illustrated lanyard with Plus Jakarta Sans and Instrument Serif. Content is local typed data; no backend, database, or CMS is required.

## Run locally

Use Node.js 24 LTS (Next.js minimum: 20.9).

Type checking retains TypeScript 7 through the `@typescript/native` alias. The `typescript` package name points to the official TypeScript 6 compatibility API, as required by the current ESLint parser.

```sh
npm ci
npm run dev
```

Visit the Local URL printed by Next.js, normally http://localhost:3000. The first build needs internet access to download the Google Fonts; the application then serves them locally.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

The homepage includes About, Experience, six selected projects, Skills, Education & Achievements, and Contact. `/projects` contains all 11 projects with category filters and Load More. Every project has a statically generated `/projects/[slug]` case study.

## Edit content

- `src/data/profile.ts`: identity, hero copy, confirmed email, social links, portrait configuration, and optional résumé path.
- `src/data/projects.ts`: ordered project records. The `Project` and `ProjectMedia` interfaces live in `src/types/project.ts`. Set `featured` and `featuredOrder` to choose homepage projects. Maintain neighboring slugs when changing the collection order.
- `src/data/experience.ts`, `skills.ts`, and `achievements.ts`: employment, skills, education, awards, and training. Homepage biography copy lives in the About component.
- `src/app/globals.css`: shared colors, typography, spacing, responsive layouts, focus indicators, and reduced-motion styles.
- `src/app/redesign.css`: existing section styling and lanyard placement. Navbar dimensions remain independent of the compact content scale.
- `src/app/archive.css`: current hero layout, palette, typography, folder layers, social icons, and responsive adjustments.

The hero uses Plus Jakarta Sans semibold with an Instrument Serif italic name. Its second line is 13% larger than the first. `PersonalArchive` keeps the supplied folder masks and edges as separate back/card/front layers. Two existing interface concepts are explicitly labeled as concepts; the center retains the personal monogram. Edit `src/data/archive.ts` to replace them with approved project media and actual case-study links.

`src/lib/gsap.ts` registers GSAP, ScrollTrigger, and `useGSAP`. The hero timeline lasts 1.83 seconds, with staggered card arrival and insertion into the overlapping fan. The shared `Reveal` animates existing section groups once in view. Context and match-media cleanup support Strict Mode and live motion preference changes.

`SmoothScrollProvider` uses the official `lenis/react` adapter. GSAP's ticker is the only animation driver (`autoRaf: false`). Lenis reads CSS scroll-padding for anchor navigation. Coarse-pointer/touch devices and reduced-motion users retain native scrolling. Content is server-rendered in its final visible state, so the page remains readable without JavaScript. Normal anchor links work without the scrolling provider.

`LanyardCard` retains the existing owner image and decorative frame. The About panel uses a paper material; the navbar and folder front are the primary glass surfaces. See [design-qa.md](design-qa.md) for redesign verification.

Social brand icons are official Bootstrap Icons SVG assets in `public/icons/`, with the upstream MIT license included. Lucide continues to supply the existing UI icons.

Project records distinguish personal contributions from team scope, competition exercises, prototypes, concepts, and ongoing integrations. Keep missing details optional. Source TODOs are editorial notes and are not rendered publicly. SiDika and Anabool intentionally use concise role statements until individual feature ownership is confirmed.

## Add approved media

The portrait and project media currently use clearly labeled placeholders. No placeholder represents an actual photograph, project screenshot, or architecture result.

1. Put the owner's photograph under `public/images/portrait/`, set its path and alt text in `profile.ts`, and set `portraitIsPlaceholder: false`.
2. Put project images under `public/images/projects/[slug]/`. Prefer optimized WebP or AVIF for screenshots and photographs. Use sufficient resolution for diagrams.
3. Add `coverImage`, `gallery`, or `architecture.media` to the corresponding project record:

```ts
{
  src: "/images/projects/waspadai/verification-01.webp",
  width: 1200,
  height: 800,
  alt: "Describe the actual verification screen shown",
  caption: "Describe the documented workflow and context",
  type: "screenshot",
  provenance: "original",
}
```

Media types: `screenshot`, `mobile`, `diagram`, `photo`, `presentation`, `workflow`. Provenance can be `original`, `competition-provided`, or `reconstructed`. The latter two automatically add visible attribution. Set `type: "diagram"` for architecture covers so they are contained rather than cropped. A dedicated architecture section takes `{ description, media }` and supports enlargement.

The Embla gallery has arrows, keyboard navigation, touch swiping, and captions, without autoplay. A single image can be enlarged without carousel controls; missing media shows an abstract placeholder. The dynamically imported lightbox supports keyboard navigation, Escape, captions, and focus restoration.

Sanitize citizen, customer, and internal administration records before adding screenshots. Do not publish unapproved internal media. The Dinoyo Kamera storefront link provides business context, rather than evidence of frontend authorship.

Only set `resume` after adding the real approved PDF. No placeholder CV is included.

The open hero folder retains `public/images/design/folder-back-mask.svg` for its rear body. Its curved front lip uses `archive-front-mask.svg` and the matching `archive-front-edge.svg` in the same directory; keep their path geometry in sync when editing the shape. The front is a live frosted surface. Cards remain editable DOM links behind it. The navigation label ?Achievement? keeps the existing `#education` anchor and its original content.

Hero and About share the off-white `.intro-flow` canvas. A background-only gradient in `src/app/intro-transition.css` starts above About and gradually adds pale blue below it. This scoped stylesheet loads after the general redesign styles so hero decoration changes do not replace the transition. The desktop lanyard starts at the About boundary and reserves its own layout height; it does not depend on hero height. Only the top 120px of the strap image is masked, leaving the clasp, card, identity, and section text fully opaque. About has an outline heading above its single frosted panel. Phones show heading, lanyard, then panel. The supplied PNG, `aini-lanyard-source.png`, supplies the real portrait; an edited transparent `dusty-blue-lanyard-frame.webp` sits in front of the editable identity content. `LanyardCard.tsx` and its CSS set the photo crop and frame insets. `profile-panel-mask.svg` and `profile-panel-edge.svg` keep the panel and tab in one silhouette. No swinging animation is applied. The hero's glass outline uses the same full dimensions as the glass surface, including its intentional overhang. Decorative arrows are kept out of the folder, badge, and navigation; directional controls and useful link indicators remain.

## Validation

See [VALIDATION.md](VALIDATION.md) for the completed phase summaries, executed checks, and remaining editorial follow-ups.

After a production build, run the HTTP checks against a running production server:

```sh
npm start
# In another terminal:
npm run test:smoke
```

Browser tests start a production server when port 3000 is free and an isolated gallery fixture server on port 3101:

```sh
npx playwright install chromium
npm run test:e2e
```

To use an installed Chrome instead, set `PLAYWRIGHT_CHANNEL=chrome` in your shell before running the tests. This is the browser used for the local verification of this implementation.

The gallery fixture app is under `tests/gallery-app`; its explicitly labeled test media is outside the portfolio's public directory and is never shipped as project evidence. Tests cover filtering, Load More, all case-study routes, responsive overflow at seven widths, navigation, card entrance/hover, live reduced-motion changes, reduced motion, JavaScript-disabled content, WCAG checks, empty/single/multiple galleries, focus restoration, keyboard controls, and touch swiping. Failure artifacts are ignored by Git.

## Deploy to Vercel

1. Push the repository to GitHub and import it as a Vercel Next.js project with this repository as the root.
2. Use the default `npm run build` command. Do not enable static export; Vercel provides Next.js image optimization and metadata image generation.
3. For a custom canonical domain, set `NEXT_PUBLIC_SITE_URL` to the full origin, such as `https://your-domain.example`, before rebuilding. Otherwise Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`, supplies the origin.
4. Deploy and verify canonical URLs, `/sitemap.xml`, `/robots.txt`, and `/opengraph-image` against the actual domain.

An unconfigured local production build omits canonical URLs and sitemap entries instead of inventing a production domain. Development uses localhost. Vercel previews disallow crawler indexing. The sitemap includes the homepage, collection, and all case studies, without fabricated modification dates.

Deployment is not performed by this implementation. Real media, résumé, the optional GPA/research details, and further SiDika/Anabool attribution remain editorial follow-ups.
