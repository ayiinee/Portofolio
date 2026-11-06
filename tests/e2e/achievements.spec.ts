import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { achievementRecords } from "../../src/data/achievements";

const carousel = ".achievement-carousel";
const currentSlide = '.achievement-slide[aria-hidden="false"]';

test("featured CV records, details, focus and responsive coverflow", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#education");
  const section = page.locator("#education");
  await expect(section.locator(carousel)).toHaveAttribute("data-enhanced", "true");
  await expect(section.locator(".education-card")).toHaveCount(0);
  await expect(section.locator(".achievement-controls, .achievement-counter")).toHaveCount(0);
  await expect(section.locator(".achievement-caption")).toHaveCount(0);
  await expect(section.locator(".achievement-slide")).toHaveCount(6);
  await expect(section.locator(".achievement-filters")).toHaveCount(0);
  await expect(section.getByRole("link", { name: "Explore All 24 Achievements" })).toHaveAttribute("href", "/achievements");
  const firstIds = achievementRecords.slice(0, 6).map((item) => item.id);
  expect(firstIds).toEqual(["lks-city", "mtcna", "garuda-hacks", "agropredict-copyright", "iceeie-paper", "lua-book"]);
  expect(new Set(achievementRecords.map((item) => item.id)).size).toBe(24);
  await section.locator(".achievement-stage").focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  const trigger = section.locator(`${currentSlide} .achievement-card`);
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("000988674");
  await expect(dialog.getByRole("link")).toHaveCount(0);
  const close = dialog.getByRole("button", { name: "Close achievement details" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Close", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  const scan = await new AxeBuilder({ page }).include(".achievement-dialog").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(scan.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("position", "fixed");
  await section.locator(".achievement-stage").focus();
  await page.keyboard.press("ArrowRight");
  await trigger.click();
  await expect(page.getByRole("dialog").getByRole("link", { name: /Open source/ })).toHaveAttribute("href", "https://doi.org/10.1109/ICEEIE66203.2025.11252117");
  await page.keyboard.press("Escape");
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(section.locator(".achievement-title")).toBeVisible();
  }
  const scanSection = await new AxeBuilder({ page }).include("#education").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(scanSection.violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("autoplay, hover, explicit restart, drag, and live reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#education");
  const section = page.locator("#education");
  await page.mouse.move(2, 2);
  await expect(section.locator(carousel)).toHaveAttribute("data-rotating", "true");
  await expect(section.locator(currentSlide)).not.toHaveAttribute("aria-label", "1 of 6", { timeout: 8000 });
  await section.locator(".achievement-stage").hover();
  await expect(section.locator(carousel)).toHaveAttribute("data-rotating", "false");
  const held = await section.locator(currentSlide).getAttribute("aria-label");
  await page.waitForTimeout(5300);
  await expect(section.locator(currentSlide)).toHaveAttribute("aria-label", held!);
  await section.locator(".achievement-stage").focus();
  await page.keyboard.press("ArrowRight");
  await page.mouse.move(2, 2);
  await expect(section.getByRole("button", { name: "Start automatic rotation" })).toBeEnabled();
  await section.getByRole("button", { name: "Start automatic rotation" }).focus();
  await page.keyboard.press("Enter");
  await page.mouse.move(2, 2);
  await expect(section.locator(carousel)).toHaveAttribute("data-rotating", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(section.locator(carousel)).toHaveAttribute("data-reduced-motion", "true");
  await expect(section.locator(carousel)).toHaveAttribute("data-rotating", "false");
  await expect(section.locator('.achievement-card[data-active="true"]')).toHaveCSS("transform", "none");
  await expect(section.getByRole("button", { name: "Start automatic rotation" })).toBeDisabled();
  const reducedPosition = await section.locator(currentSlide).getAttribute("aria-label");
  await page.mouse.wheel(0, 160);
  await page.waitForTimeout(700);
  await expect(section.locator(currentSlide)).toHaveAttribute("aria-label", reducedPosition!);
  await section.locator(".achievement-stage").focus();
  await page.keyboard.press("ArrowRight");
  await expect(section.locator(currentSlide)).not.toHaveAttribute("aria-label", reducedPosition!);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(section.locator(carousel)).toHaveAttribute("data-reduced-motion", "false");
  const stage = section.locator(".achievement-stage");
  await stage.scrollIntoViewIfNeeded();
  const beforeDrag = await section.locator(currentSlide).getAttribute("aria-label");
  const box = (await stage.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 - 180, box.y + box.height / 2, { steps: 15 });
  await page.mouse.up();
  await expect(section.locator(currentSlide)).not.toHaveAttribute("aria-label", beforeDrag!);
  await expect(section.getByRole("button", { name: "Start automatic rotation" })).toBeEnabled();
});

test("user scroll drives direction, anchor jumps do not, and autoplay resumes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#education");
  const section = page.locator("#education");
  await page.mouse.move(2, 2);
  await expect(section.locator(carousel)).toHaveAttribute("data-rotating", "true");
  await expect(section.locator(currentSlide)).toHaveAttribute("aria-label", "1 of 6");
  await page.mouse.wheel(0, 170);
  await expect(section.locator(currentSlide)).toHaveAttribute("aria-label", "2 of 6");
  await page.waitForTimeout(550);
  await page.mouse.wheel(0, -170);
  await expect(section.locator(currentSlide)).toHaveAttribute("aria-label", "1 of 6");
  await expect(section.locator(carousel)).toHaveAttribute("data-rotating", "true", { timeout: 4000 });
  // Programmatic navigation is intentionally not treated as user scroll.
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(section.locator(carousel)).toHaveAttribute("data-rotating", "false");
  await section.locator(".achievement-stage").scrollIntoViewIfNeeded();
  await page.mouse.move(2, 2);
  await expect(section.locator(currentSlide)).toHaveAttribute("aria-label", "1 of 6");
  await expect(section.locator(carousel)).toHaveAttribute("data-rotating", "true");
});

test("featured records remain readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto("/#education");
    const section = page.locator("#education");
    await expect(section.locator(".achievement-fallback")).toHaveCount(6);
    for (const item of achievementRecords.filter((item) => item.featuredOrder)) await expect(section).toContainText(item.title);
    await expect(section.locator(".achievement-track")).toHaveCSS("display", "grid");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  } finally { await context.close(); }
});
