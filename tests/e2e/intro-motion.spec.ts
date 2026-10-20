import { expect, test } from "@playwright/test";

const matrixY = (element: Element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42;

test("archive keeps the insertion and 10px hover with the reference fan layout", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const card = page.locator(".archive-card-motion").first();
  await expect(card).not.toHaveCSS("transform", "none");
  await expect(card).toHaveCSS("transform", "none");
  const rotations = await page.locator(".archive-card-position").evaluateAll((elements) => elements.map((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return Math.round(Math.atan2(matrix.b, matrix.a) * 180 / Math.PI);
  }));
  expect(rotations).toEqual([-9, 3, 12]);
  const photo = page.locator(".archive-photo").first();
  await photo.hover();
  await expect.poll(() => photo.evaluate(matrixY)).toBeCloseTo(-10, 0);
  await page.mouse.move(0, 0);
  await photo.focus();
  await expect.poll(() => photo.evaluate(matrixY)).toBeCloseTo(-10, 0);
  await page.locator(".archive-connect").focus();
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(card).toHaveCSS("transform", "none");
  await expect(page.locator(".archive-folder-toggle")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await photo.focus();
  await expect(photo).toHaveCSS("transform", "none");
  await expect(card).toHaveCSS("transform", "none");
});

test("project hover and focus share one lift; reduced motion removes it", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const card = page.locator(".project-card").first();
  await card.scrollIntoViewIfNeeded();
  await card.hover();
  await expect.poll(() => card.evaluate(matrixY)).toBeCloseTo(-5, 0);
  await expect(card.locator(".project-arrow")).toHaveCSS("transform", "none");
  await page.mouse.move(0, 0);
  await card.locator("a").focus();
  await expect.poll(() => card.evaluate(matrixY)).toBeCloseTo(-5, 0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => card.evaluate(matrixY)).toBeCloseTo(0, 0);
});

test("About placeholders, existing anchors, and pending CV", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  const stats = page.locator(".about-stats");
  await expect(stats.locator("dd")).toHaveText(["—", "—", "—", "—"]);
  await expect(page.locator("#about .about-inline-details")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Download CV/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Download CV/ })).toBeDisabled();
  for (const id of ["top", "about", "experience", "projects", "skills", "education", "contact"]) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
});
