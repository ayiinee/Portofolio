import { expect, test } from "@playwright/test";

for (const width of [1440, 1024, 390, 320]) {
  test(`lanyard stays assembled and settles once at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    // Wait for hydration to set up ScrollTrigger before crossing its start.
    await expect(page.locator(".lanyard-motion")).not.toHaveCSS("transform", "none");

    const samples = await page.evaluate(async () => {
      const motion = document.querySelector<HTMLElement>(".lanyard-motion")!;
      const content = document.querySelector<HTMLElement>(".identity-content")!;
      const frame = document.querySelector<HTMLElement>(".lanyard-art")!;
      const photo = document.querySelector<HTMLElement>(".identity-photo-source")!;
      const localGeometry = () => [content, frame, photo].map((element) => [
        element.offsetLeft, element.offsetTop, element.offsetWidth, element.offsetHeight,
        getComputedStyle(element).transform,
      ]);
      const assembled = content.parentElement === motion && frame.parentElement === motion;
      const section = document.querySelector("#about")!;
      window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - innerHeight * 0.7, behavior: "instant" });
      const samples = [];
      const start = performance.now();
      do {
        const style = getComputedStyle(motion);
        const matrix = new DOMMatrixReadOnly(style.transform);
        samples.push({
          assembled,
          geometry: localGeometry(),
          rotation: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI,
          scaleX: Math.hypot(matrix.a, matrix.b),
          scaleY: Math.hypot(matrix.c, matrix.d),
          opacity: style.opacity,
          overflow: document.documentElement.scrollWidth > innerWidth,
        });
        await new Promise((resolve) => setTimeout(resolve, 30));
      } while (performance.now() - start < 1800);
      return samples;
    });

    expect(Math.min(...samples.map((sample) => sample.rotation))).toBeLessThan(-0.1);
    expect(Math.max(...samples.map((sample) => sample.rotation))).toBeGreaterThan(0.1);
    for (const sample of samples) {
      expect(sample.assembled).toBe(true);
      expect(sample.geometry).toEqual(samples[0].geometry);
      expect(sample.scaleX).toBeCloseTo(1, 3);
      expect(sample.scaleY).toBeCloseTo(1, 3);
      expect(sample.opacity).toBe("1");
      expect(sample.overflow).toBe(false);
    }
    await expect(page.locator(".lanyard-motion")).toHaveCSS("transform", "none");
    await expect(page.locator(".lanyard-motion")).toHaveCSS("will-change", "auto");

    // Scrolling back into About must not replay the entrance.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.locator("#about").scrollIntoViewIfNeeded();
    await expect(page.locator(".lanyard-motion")).toHaveCSS("transform", "none");
    const navIsOnTop = await page.locator(".nav-shell .brand").evaluate((brand) => {
      const box = brand.getBoundingClientRect();
      return brand.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2));
    });
    expect(navIsOnTop).toBe(true);
  });
}

test("changing motion preference cancels the swing and restores all content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const lanyard = page.locator(".lanyard-motion");
  await expect(lanyard).not.toHaveCSS("transform", "none");
  await page.evaluate(() => {
    const section = document.querySelector("#about")!;
    window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - innerHeight * 0.7, behavior: "instant" });
  });
  await expect(page.locator(".about-outline")).not.toHaveCSS("opacity", "0");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(lanyard).toHaveCSS("transform", "none");
  for (const selector of [".lanyard-motion", ".about-outline", "#about-heading", ".about-sheet"]) {
    await expect(page.locator(selector)).toHaveCSS("opacity", "1");
  }
  await expect(page.locator(".identity-name")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(lanyard).toHaveCSS("transform", "none");
});
