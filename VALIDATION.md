# Implementation and verification

Verified locally on 15 October 2026 with Node.js 24.19.0, npm 11.17.0, and installed Google Chrome through Playwright.

## Development phases

| Phase | Completed work and principal files | Validation | Remaining items |
| --- | --- | --- | --- |
| 1 — Foundation | Consolidated `src/app/globals.css`; shared layout, Navbar, Footer, Hero, PortraitCard, and profile configuration. Exact hero copy, inline portrait, restrained hover, seven navigation sections, responsive glass navigation. | TypeScript; browser portrait transforms and navigation; visual screenshots at all seven requested widths. | Replace the labeled portrait placeholder with an approved photograph. |
| 2 — Homepage | About, Experience, Projects, Skills, Education, Contact; local experience, skills, and achievements data. Six featured projects in brief order; confirmed contact links. | Content checks, server-rendered sections, responsive overflow, keyboard and mobile navigation, automated WCAG checks. | Optional GPA and research details intentionally omitted. |
| 3 — Project pages | `src/types/project.ts`, `src/data/projects.ts`, `/projects`, reusable `/projects/[slug]`, shared cards, metadata, collection controls, and adjacent-project navigation. | All 11 case studies return 200 with their titles and descriptions; unknown slugs return 404; category counts and Load More/reset behavior verified. | Detailed SiDika and Anabool ownership remains a source TODO; concise confirmed statements are public. |
| 4 — Media and SEO | ProjectGallery, MediaLightbox, MediaPlaceholder, origin resolution, sitemap, robots, Open Graph image, ESLint configuration, README. Separate gallery QA app under `tests/gallery-app`. | Zero-, one-, and three-image fixtures; arrows, keyboard, captions, provenance, Escape, focus restoration, and touch swipe. SEO/assets and origin precedence checked. | Real project media and résumé are unavailable. Configure the canonical production origin when deploying. |
| 5 — QA | `tests/e2e`, `scripts/smoke.mjs`, Playwright configuration, tooling compatibility aliases, documentation. | All final commands below passed. | Browser coverage is Chrome; no cross-browser or measured performance claim is made. |

## Final checks

- `npm run lint` — passed without warnings.
- `npm run typecheck` — passed.
- `npm run build` — passed; homepage, collection, all 11 case studies, 404, and SEO routes generated. The unconfigured local build emits Next.js’s metadata-origin warning; Vercel environment variables or `NEXT_PUBLIC_SITE_URL` provide the real deployment origin.
- `npm run test:smoke` against the production server — passed: 13 content pages, six featured projects, section anchors, metadata, adjacent navigation, media placeholders, assets, SEO routes, 404, and site-origin precedence/defaults.
- `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e` — **9 passed** in the final run. In PowerShell, set `$env:PLAYWRIGHT_CHANNEL='chrome'` first.
- Automated axe checks — no reported WCAG A/AA violations on the homepage, collection, WaspadAI case study, and isolated gallery fixtures.
- Responsive checks — no horizontal overflow on the homepage, collection, and an AWS case study at 320, 375, 390, 768, 1024, 1440, and 1920px. Homepage screenshots at every width, plus desktop collection and case-study screenshots, were visually reviewed.
- Valid-page browser console and uncaught-error checks — passed for the homepage and all case studies.
- `git diff --check` with per-command line-ending normalization — passed.
- `npm audit --omit=dev` — zero vulnerabilities.

The full development dependency audit reports five findings from one unpatched [`braces` advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) through the ESLint tooling dependency tree. No framework downgrade or forced incompatible audit fix was applied.

Browser testing found and fixed an initialization race: carousel arrows now remain disabled until Embla is ready. The complete final suite passed after that fix. Test assets are clearly marked fixtures in a separate Next.js app and are not portfolio screenshots or production routes.

Local review screenshots are in ignored `artifacts/review/`; browser failure artifacts and generated fixture build files are also ignored. Test servers were managed locally. No hosting deployment, remote publication, or domain change was performed.
