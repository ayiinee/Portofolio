# Qurrotul A’ini — Personal Portfolio

An English-language engineering portfolio built with Next.js App Router, TypeScript, Tailwind CSS, Motion, and Lucide. The desk-inspired design pairs cream paper, cobalt folders, subtle glass panels, a square portrait, and an illustrated lanyard with Plus Jakarta Sans and Instrument Serif. Content is local typed data; no backend, database, or CMS is required.

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
- `src/app/redesign.css`: the moodboard redesign, hero folder composition, square photo, lanyard placement, and coordinated colors across existing sections. Navbar dimensions remain independent of the compact content scale.

The hero greeting uses `TypingGreeting`: the complete accessible greeting is server-rendered, with a one-time visual typing animation after hydration. The scroll cue animates gently and links to About. Both animations respect reduced motion. Hero text is intentionally short; personal background lives in About.

`LanyardCard` combines the decorative generated `public/images/design/blue-lanyard.webp` with editable identity text and the same profile photograph. It is an illustration, not a real credential, certificate, or project image. To replace the photo in both locations, edit `profile.ts`; the hero and badge crop it to 1:1. See [design-qa.md](design-qa.md) for references, asset provenance, and redesign verification.

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

The open hero folder uses the supplied Figma paths in `public/images/design/folder-back-mask.svg`, `folder-front-mask.svg`, and `folder-glass-edges.svg`. Its front is a live frosted surface with CSS backdrop blur, so photographs remain editable behind the glass. The main photograph still comes from `profile.portrait`; the two extra square photo placeholders live in `Hero.tsx`. Replace those slots with approved photographs when available. `ScrollCue.tsx` uses the existing Motion library and respects reduced motion. The navigation label “Achievement” keeps the existing `#education` destination, which contains education and achievements.

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

The gallery fixture app is under `tests/gallery-app`; its explicitly labeled test media is outside the portfolio's public directory and is never shipped as project evidence. Tests cover filtering, Load More, all case-study routes, responsive overflow at seven widths, navigation, typing completion, square portrait, reduced motion, JavaScript-disabled content, WCAG checks, empty/single/multiple galleries, focus restoration, keyboard controls, and touch swiping. Failure artifacts are ignored by Git.

## Deploy to Vercel

1. Push the repository to GitHub and import it as a Vercel Next.js project with this repository as the root.
2. Use the default `npm run build` command. Do not enable static export; Vercel provides Next.js image optimization and metadata image generation.
3. For a custom canonical domain, set `NEXT_PUBLIC_SITE_URL` to the full origin, such as `https://your-domain.example`, before rebuilding. Otherwise Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`, supplies the origin.
4. Deploy and verify canonical URLs, `/sitemap.xml`, `/robots.txt`, and `/opengraph-image` against the actual domain.

An unconfigured local production build omits canonical URLs and sitemap entries instead of inventing a production domain. Development uses localhost. Vercel previews disallow crawler indexing. The sitemap includes the homepage, collection, and all case studies, without fabricated modification dates.

Deployment is not performed by this implementation. Real media, résumé, the optional GPA/research details, and further SiDika/Anabool attribution remain editorial follow-ups.
