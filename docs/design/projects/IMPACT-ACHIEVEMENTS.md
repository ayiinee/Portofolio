# Impact & achievements

Each project detail page renders this section after engineering/architecture content and before project context and limitations.

Edit the corresponding record in `src/data/projects.ts`:

- `impact`: documented project outcomes or capabilities. Measured user, business or performance impact should only be added with supporting evidence.
- `achievements`: confirmed project milestones, competition participation or awards. Omit this field when no project-specific milestone or recognition is recorded.

The section and each subgroup are omitted when their arrays are absent or empty. Numbering follows the other narrative sections automatically. Content is server rendered and remains readable without client-side JavaScript.

Initial content summarizes the existing project descriptions and contribution statements for all 11 projects. Competition participation and hackathon stages are preserved as milestones. General profile awards are not assigned to individual projects without a confirmed relationship. Anabool remains explicitly a team concept with unestablished implementation and real-world outcomes; no individual feature ownership is added.

Validation on 2026-10-21: build, typecheck, scoped lint, smoke and two relevant Playwright scenarios passed. Browser review covered desktop and mobile, including no horizontal overflow at 320px. Screenshots: `artifacts/project-impact/impact-1440.png` and `impact-484.png`.
