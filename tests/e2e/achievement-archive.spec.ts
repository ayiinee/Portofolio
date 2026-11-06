import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { achievementRecords } from "../../src/data/achievements";

test("archive filters all records, keeps card text upright and opens correct details", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/achievements");
  await expect(page).toHaveTitle(/Achievements/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A collection of milestones.");
  await expect(page.locator('.nav-pill a[href="/#education"]')).toHaveAttribute("aria-current", "location");
  await expect(page.locator(".achievement-archive-card")).toHaveCount(6);
  await expect(page.locator(".achievement-archive-card").first()).toContainText("Garuda Hacks 7.0");
  await expect(page.locator(".achievement-preview-missing")).toHaveCount(6);
  await expect(page.locator(".achievement-archive-summary, .achievement-archive-card .achievement-details")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("1–6 of 24 achievements");
  await expect(page.getByRole("button", { name: "Previous page", exact: true })).toBeDisabled();
  const seen: string[] = [];
  for (let current = 1; current <= 4; current++) {
    await expect(page.getByRole("button", { name: `Page ${current}`, exact: true })).toHaveAttribute("aria-current", "page");
    seen.push(...await page.locator(".achievement-archive-card").evaluateAll((cards) => cards.map((card) => card.getAttribute("aria-labelledby")!)));
    if (current < 4) await page.getByRole("button", { name: "Next page", exact: true }).click();
  }
  expect(new Set(seen).size).toBe(24);
  await expect(page.getByRole("button", { name: "Next page", exact: true })).toBeDisabled();
  await expect(page.getByRole("group", { name: "Achievement results", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Previous page", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("13–18 of 24 achievements");
  await page.getByRole("button", { name: "Page 1", exact: true }).click();
  for (const card of await page.locator(".achievement-archive-card").all()) {
    expect(await card.locator("h2").evaluate((node) => getComputedStyle(node).fontStyle)).toBe("normal");
    await expect(card.locator(".achievement-archive-distinction")).toHaveCSS("font-style", "normal");
  }
  for (const [category, count] of [["Awards", 11], ["Certifications", 8], ["Intellectual Property", 2], ["Publications", 3], ["All", 24]] as const) {
    await page.getByRole("button", { name: new RegExp(`^${category}`) }).click();
    await expect(page.locator(".achievement-archive-card")).toHaveCount(Math.min(count, 6));
    await expect(page.getByRole("status")).toContainText(`${count} achievements`);
    if (count > 6) {
      await expect(page.getByRole("button", { name: "Page 1", exact: true })).toHaveAttribute("aria-current", "page");
      await page.getByRole("button", { name: "Page 2", exact: true }).click();
      await expect(page.locator(".achievement-archive-card")).toHaveCount(Math.min(count - 6, 6));
    } else await expect(page.getByRole("navigation", { name: "Achievement pages", exact: true })).toHaveCount(0);
  }
  await page.getByRole("button", { name: /^Intellectual Property/ }).click();
  const trigger = page.getByRole("button", { name: "View document and details: AGROPREDICT", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("000988674");
  await expect(dialog.getByRole("link")).toHaveCount(0);
  await expect(dialog.locator(".achievement-distinction")).toHaveCSS("font-style", "normal");
  const result = await new AxeBuilder({ page }).include(".achievement-dialog").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: /^Publications/ }).click();
  await page.getByRole("button", { name: "View document and details: Landfill Smart Weighing", exact: true }).click();
  await expect(dialog.getByRole("link", { name: /Open source/ })).toHaveAttribute("href", "https://doi.org/10.1109/ICEEIE66203.2025.11252117");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /^All/ }).click();
  const scan = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(scan.violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("archive remains readable at all widths and without JavaScript", async ({ page, browser, baseURL }) => {
  await page.goto("/achievements");
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const columns = await page.locator(".achievement-archive-grid").evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length);
    expect(columns).toBe(width <= 700 ? 1 : width <= 1000 ? 2 : 3);
    const preview = await page.locator(".achievement-archive-preview").first().boundingBox();
    expect(preview!.width / preview!.height).toBeCloseTo(1.4, 1);
    await expect(page.getByRole("button", { name: "Page 4", exact: true })).toBeVisible();
  }
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const noJS = await context.newPage();
    await noJS.goto("/achievements");
    await expect(noJS.locator(".achievement-archive-card")).toHaveCount(24);
    for (const item of achievementRecords) await expect(noJS.locator("main")).toContainText(item.title);
    await noJS.locator('[aria-labelledby="archive-iceeie-paper"] summary').click();
    await expect(noJS.getByRole("link", { name: "Open source", exact: true })).toHaveAttribute("href", "https://doi.org/10.1109/ICEEIE66203.2025.11252117");
  } finally { await context.close(); }
});
