import { expect, test } from "@playwright/test";

for (const width of [1122, 1440, 1024, 768, 390]) {
  test(`lanyard remains static and assembled at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1402 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const art = page.locator(".lanyard-static");
    const geometry = () => art.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y + scrollY, width: box.width, height: box.height };
    });
    const before = await geometry();
    await expect(art).toHaveCSS("transform", "none");
    await expect(page.locator(".lanyard-art img")).toHaveAttribute("src", "/images/design/lanyard-composite.png");
    await expect(page.locator(".identity-name")).toHaveText("A'ini");
    await page.locator(".identity-monogram").scrollIntoViewIfNeeded();
    await page.locator(".identity-monogram").hover({ force: true });
    await expect(art).toHaveCSS("transform", "none");
    expect(await geometry()).toEqual(before);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(art).toHaveCSS("transform", "none");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("the static artwork follows About when hero height changes", async ({ page }) => {
  await page.setViewportSize({ width: 1122, height: 1402 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const read = () => page.evaluate(() => {
    const panel = document.querySelector(".about-sheet")!.getBoundingClientRect();
    const art = document.querySelector(".lanyard-stage")!.getBoundingClientRect();
    return { y: art.y + scrollY, inset: art.y - panel.y };
  });
  const before = await read();
  await page.locator(".archive-hero").evaluate((element) => { element.style.paddingBottom = "120px"; });
  const after = await read();
  expect(after.y - before.y).toBeCloseTo(120, 0);
  expect(after.inset).toBe(before.inset);
});

test("Enter interaction, About summaries stay honest and CV waits for a file", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".about-stats dd")).toHaveText(["—", "—", "—", "—"]);
  await expect(page.getByRole("button", { name: /Download CV/ })).toBeDisabled();
  await expect(page.locator(".intro-keycap-a, .about-keycap")).toHaveCount(0);
  await expect(page.locator(".intro-keycap-enter")).toHaveCSS("transform", "none");
  await page.locator(".intro-keycap-enter").click();
  await expect(page).toHaveURL(/#projects$/);
});
