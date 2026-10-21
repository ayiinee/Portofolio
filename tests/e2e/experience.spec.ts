import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";

const fixtureURL = "http://localhost:3101";

test("production archive preserves real records, anchor, and compact responsive layout", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#experience");
  const section = page.locator("#experience");
  await expect(section.getByRole("heading", { level: 2 })).toHaveText("The journey so far.");
  await expect(section).not.toContainText(/02\s*[—–]\s*EXPERIENCE/);
  await expect(section.locator(".experience-row")).toHaveCount(3);
  await expect(section.getByRole("button", { name: "Show more" })).toHaveCount(0);
  await expect(section).toContainText("February 2026 – May 2026");
  await expect(section).toContainText("August 2025 – December 2025");
  await expect(section).toContainText("December 2022 – February 2023");
  await expect(section).not.toContainText(/Present|Current|Now/);
  await fs.mkdir("artifacts/experience", { recursive: true });
  for (const width of [320, 390, 714, 768, 1024, 1487]) {
    await page.setViewportSize({ width, height: width === 714 ? 668 : 1058 });
    await section.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 1487) {
      const sheet = (await section.locator(".experience-archive").boundingBox())!;
      const baseline = (await page.locator(".skills-grid").boundingBox())!;
      expect(sheet.x).toBeCloseTo(baseline.x, 0);
      expect(sheet.width).toBeCloseTo(baseline.width, 0);
      for (const row of await section.locator(".experience-row").all()) {
        const box = (await row.boundingBox())!;
        expect(box.height).toBeGreaterThanOrEqual(150);
        expect(box.height).toBeLessThanOrEqual(205);
      }
    }
    if (width === 390 || width === 714 || width === 1487) {
      await section.screenshot({ path: `artifacts/experience/overview-${width}.png` });
      await section.getByRole("button", { name: "View details", exact: true }).first().click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toContainText("Database Course");
      await page.screenshot({ path: `artifacts/experience/dialog-${width}.png` });
      await page.keyboard.press("Escape");
    }
  }
});

test("each production detail opens the right record and restores focus and scroll", async ({ page }) => {
  await page.goto("/#experience");
  const rows = page.locator("#experience .experience-row");
  for (let index = 0; index < 3; index++) {
    const row = rows.nth(index);
    const trigger = row.getByRole("button", { name: "View details", exact: true });
    await trigger.scrollIntoViewIfNeeded();
    await trigger.focus();
    const scroll = await page.evaluate(() => scrollY);
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(await row.locator(".experience-organization").innerText());
    await expect(dialog).toContainText(await row.locator(".experience-date p").innerText());
    await expect(dialog.getByRole("button", { name: "Close experience details" })).toBeFocused();
    await expect(page.locator("body")).toHaveCSS("position", "fixed");
    await expect(dialog).toContainText("Photos coming soon");
    await expect(dialog.getByRole("button", { name: /Next photo|Previous photo/ })).toHaveCount(0);
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("button", { name: "Close", exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: "Close experience details" })).toBeFocused();
    if (index === 0) {
      expect((await new AxeBuilder({ page }).include(".experience-dialog").withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
      await page.keyboard.press("Escape");
    } else if (index === 1) {
      await dialog.getByRole("button", { name: "Close", exact: true }).click();
    } else {
      await dialog.getByRole("button", { name: "Close experience details" }).click();
    }
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("position", "fixed");
    await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(scroll, 0);
    const thumbnail = row.locator(".experience-thumbnail");
    await thumbnail.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(thumbnail).toBeFocused();
  }
});

test("counts three and five expand records inline independently of the detail dialog", async ({ page }) => {
  await page.goto(fixtureURL);
  for (const [id, count] of [["experience-three", 3], ["experience-five", 5]] as const) {
    const section = page.getByTestId(id);
    await expect(section.locator(".experience-row")).toHaveCount(count);
    const expand = section.getByRole("button", { name: "Show more" });
    await expand.click();
    await expect(section.locator(".experience-row")).toHaveCount(7);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page).toHaveURL(fixtureURL + "/");
    await expect(section.getByRole("button", { name: "Show less" })).toHaveAttribute("aria-expanded", "true");
    await section.getByRole("button", { name: "View details", exact: true }).last().click();
    await expect(page.getByRole("dialog")).toContainText("Synthetic QA role 7");
    await page.keyboard.press("Escape");
    await expect(section.locator(".experience-row")).toHaveCount(7);
    await section.getByRole("button", { name: "Show less" }).click();
    await expect(section.locator(".experience-row")).toHaveCount(count);
  }
});

test("single photo has no redundant controls; multiple photos support arrows and reset", async ({ page }) => {
  await page.goto(fixtureURL);
  const rows = page.getByTestId("experience-three").locator(".experience-row");
  await rows.nth(1).getByRole("button", { name: "View details", exact: true }).click();
  let dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("img", { name: "QA fixture one" })).toBeVisible();
  await expect(dialog).toContainText("First test image");
  await expect(dialog.getByRole("button", { name: /Next photo|Previous photo/ })).toHaveCount(0);
  await expect(dialog.locator(".experience-gallery-caption span")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await rows.nth(2).getByRole("button", { name: "View details", exact: true }).click();
  dialog = page.getByRole("dialog");
  await expect(dialog.locator(".experience-gallery-caption")).toContainText("1 / 3");
  await expect(dialog.getByRole("button", { name: "Previous photo" })).toBeDisabled();
  await dialog.getByRole("button", { name: "Next photo" }).click();
  await expect(dialog.locator(".experience-gallery-caption")).toHaveText("2 / 3Second test image");
  const viewport = dialog.locator(".experience-gallery-viewport");
  await viewport.focus();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.locator(".experience-gallery-caption")).toContainText("Third test image");
  await expect(dialog.getByRole("button", { name: "Next photo" })).toBeDisabled();
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.locator(".experience-gallery-caption")).toContainText("Second test image");
  await dialog.getByRole("button", { name: "Previous photo" }).click();
  await expect(dialog.locator(".experience-gallery-caption")).toContainText("1 / 3");
  await dialog.getByRole("button", { name: "Next photo" }).click();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await rows.nth(0).getByRole("button", { name: "View details", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("Photos coming soon");
  await page.keyboard.press("Escape");
  await rows.nth(2).getByRole("button", { name: "View details", exact: true }).click();
  await expect(page.getByRole("dialog").locator(".experience-gallery-caption")).toContainText("1 / 3");
});

test("mobile dialog scrolls internally, keeps close reachable, and supports touch swipe", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 650 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto(fixtureURL);
  await page.getByTestId("experience-three").locator(".experience-row").nth(2).getByRole("button", { name: "View details", exact: true }).click();
  const dialog = page.getByRole("dialog");
  const gallery = dialog.locator(".experience-gallery-viewport");
  const bounds = (await gallery.boundingBox())!;
  const session = await context.newCDPSession(page);
  const x = bounds.x + bounds.width * .8;
  const y = bounds.y + bounds.height / 2;
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let step = 1; step <= 8; step++) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - step * bounds.width * .075, y }] });
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(dialog.locator(".experience-gallery-caption")).toContainText("2 / 3");
  await dialog.evaluate((element) => { element.scrollTop = element.scrollHeight; });
  await expect(dialog.getByRole("button", { name: "Close experience details" })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await dialog.getByRole("button", { name: "Close experience details" }).click();
  await expect(dialog).toHaveCount(0);
  await context.close();
});
