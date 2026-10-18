import { expect, test } from "@playwright/test";

for (const width of [1440, 1024, 390, 320]) {
  test(`lanyard stays assembled and settles once at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    // Drive GSAP's timer/RAF callbacks deterministically, including on hosts
    // that throttle background browser frames during visual review.
    await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
    await page.clock.pauseAt("2026-01-01T00:00:01Z");
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    // Wait for hydration to set up ScrollTrigger before crossing its start.
    await expect(page.locator(".lanyard-motion")).not.toHaveCSS("transform", "none");

    const samplesPromise = page.evaluate(async () => {
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
      } while (performance.now() - start < 2400);
      return samples;
    });
    await page.clock.runFor(2500);
    const samples = await samplesPromise;

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
    await page.clock.resume();

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
  await expect(page.locator("#about-heading")).not.toHaveCSS("opacity", "0");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(lanyard).toHaveCSS("transform", "none");
  for (const selector of [".lanyard-motion", ".about-outline", "#about-heading", ".about-sheet"]) {
    await expect(page.locator(selector)).toHaveCSS("opacity", "1");
  }
  await expect(page.locator(".identity-name")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(lanyard).toHaveCSS("transform", "none");
});

test("desktop hover swings after the entrance, settles, and respects reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const lanyard = page.locator(".lanyard-motion");
  const stage = page.locator(".lanyard-stage");
  await expect(lanyard).not.toHaveCSS("transform", "none");
  const initialTransform = await lanyard.evaluate(element => getComputedStyle(element).transform);
  await stage.dispatchEvent("pointerenter");
  await expect(lanyard).toHaveCSS("transform", initialTransform);
  await page.evaluate(() => window.scrollTo({
    top: document.querySelector("#about")!.getBoundingClientRect().top + scrollY - 120,
    behavior: "instant",
  }));
  await expect(lanyard).toHaveCSS("transform", "none");

  await page.locator(".identity-photo").hover();
  await expect(lanyard).not.toHaveCSS("transform", "none");
  await expect(lanyard).toHaveCSS("transform", "none");
  await expect(lanyard).toHaveCSS("will-change", "auto");

  // A new hover can interrupt a return without leaving a residual rotation.
  await page.mouse.move(0, 0);
  await page.locator(".identity-photo").hover();
  await expect(lanyard).not.toHaveCSS("transform", "none");
  await page.mouse.move(0, 0);
  await expect(lanyard).toHaveCSS("transform", "none");
  await page.locator(".identity-photo").hover();
  await expect(lanyard).not.toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(lanyard).toHaveCSS("transform", "none");
  await expect(lanyard).toHaveCSS("will-change", "auto");
  await stage.dispatchEvent("pointerenter");
  await expect(lanyard).toHaveCSS("transform", "none");
});

test("touch devices do not activate hover swings", async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 1024, height: 900 }, hasTouch: true,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto("/");
  const lanyard = page.locator(".lanyard-motion");
  await expect(lanyard).not.toHaveCSS("transform", "none");
  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(lanyard).toHaveCSS("transform", "none");
  await page.locator(".lanyard-stage").dispatchEvent("pointerenter");
  await expect(lanyard).toHaveCSS("will-change", "auto");
  await expect(lanyard).toHaveCSS("transform", "none");
  await context.close();
});
