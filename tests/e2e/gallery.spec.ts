import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3101");
});

test("zero media has no controls; one image enlarges and restores focus", async ({
  page,
}) => {
  const empty = page.getByTestId("empty");
  await expect(empty).toContainText("Project image coming soon");
  await expect(empty.getByRole("button")).toHaveCount(0);
  const single = page.getByTestId("single");
  await expect(single.getByRole("button", { name: /image$/ })).toHaveCount(0);
  const trigger = single.getByRole("button", { name: /Enlarge/ });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText(
    "Competition-provided architecture reference.",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("multiple images support arrows, keyboard, captions, and lightbox", async ({
  page,
}) => {
  const gallery = page.getByTestId("multiple");
  await expect(
    gallery.getByRole("button", { name: "Previous image" }),
  ).toBeDisabled();
  await gallery.getByRole("button", { name: "Next image" }).click();
  await expect(gallery.locator(".gallery-controls")).toContainText(
    "2 / 3 — Second test image",
  );
  const viewport = gallery.locator(".gallery-viewport");
  await viewport.focus();
  await page.keyboard.press("ArrowRight");
  await expect(gallery.locator(".gallery-controls")).toContainText(
    "Reconstructed later for explanation.",
  );
  await expect(
    gallery.getByRole("button", { name: "Next image" }),
  ).toBeDisabled();
  const image = gallery.getByRole("button", {
    name: "Enlarge: QA fixture three",
  });
  await image.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("dialog")).toContainText("Second test image");
  await page.keyboard.press("Escape");
  await expect(image).toBeFocused();
  await viewport.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(gallery.locator(".gallery-controls")).toContainText("2 / 3");
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
      .violations,
  ).toEqual([]);
});

test("hero thumbnails synchronize with arrows, keyboard, and the lightbox", async ({ page }) => {
  const gallery = page.getByTestId("hero");
  const thumbnails = gallery.locator(".gallery-thumbnail");
  await expect(thumbnails).toHaveCount(3);
  await expect(thumbnails.nth(0)).toHaveAttribute("aria-current", "true");
  await thumbnails.nth(2).click();
  await expect(gallery.locator(".gallery-controls")).toContainText("3 / 3");
  await expect(thumbnails.nth(2)).toHaveAttribute("aria-current", "true");
  await expect(gallery.getByRole("button", { name: "Next image" })).toBeDisabled();
  await gallery.getByRole("button", { name: "Previous image" }).click();
  await expect(thumbnails.nth(1)).toHaveAttribute("aria-current", "true");
  await gallery.locator(".gallery-viewport").focus();
  await page.keyboard.press("ArrowLeft");
  await expect(thumbnails.nth(0)).toHaveAttribute("aria-current", "true");
  await expect(gallery.getByRole("button", { name: "Previous image" })).toBeDisabled();
  await expect(gallery.locator(".gallery-slide[inert]")).toHaveCount(2);
  const trigger = gallery.getByRole("button", { name: "Enlarge: QA fixture one" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toContainText("First test image");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();

  await fs.mkdir("artifacts/case-carousel", { recursive: true });
  await gallery.screenshot({ path: "artifacts/case-carousel/carousel-fixture.png" });
  const empty = page.getByTestId("hero-empty");
  await expect(empty.getByRole("button")).toHaveCount(0);
  for (const width of [320, 484, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const slot of [gallery.locator(".gallery-viewport"), empty.locator(".gallery-empty")]) {
      const bounds = await slot.boundingBox();
      expect(bounds).toBeTruthy();
      expect(Math.abs(bounds!.height - bounds!.width * 9 / 16)).toBeLessThan(1);
    }
  }
});

test("mobile gallery responds to a touch swipe without clipping", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3101");
  const session = await context.newCDPSession(page);
  for (const testId of ["multiple", "hero"]) {
    const gallery = page.getByTestId(testId);
    await expect(gallery.getByRole("button", { name: "Next image" })).toBeEnabled();
    await gallery.scrollIntoViewIfNeeded();
    const bounds = await gallery.locator(".gallery-viewport").boundingBox();
    expect(bounds).toBeTruthy();
    const x = bounds!.x + bounds!.width * 0.8;
    const y = bounds!.y + bounds!.height / 2;
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    for (let step = 1; step <= 8; step++)
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x - step * bounds!.width * 0.075, y }],
      });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect(gallery.locator(".gallery-controls")).toContainText("2 / 3");
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await context.close();
});
