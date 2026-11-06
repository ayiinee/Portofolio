import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";

const label = "WaspadAI app showcase";

test("original Canva hero is unchanged and feature mockups remain interactive", async ({ page }) => {
  await page.goto("/projects/waspadai");
  const root = page.getByRole("region", { name: label });
  const servedArtwork = await page.request.get("/images/projects/waspadai/canva-hero.jpg");
  expect(createHash("sha256").update(await servedArtwork.body()).digest("hex")).toBe("a58291fe523a451ff3097d6a6d5ef7807513cc3eef406c94dfef23fee1135c58");
  await expect(root.locator('[data-slide="introduction"] img')).toBeVisible();
  await expect(root.locator('[data-slide="introduction"] canvas')).toHaveCount(0);
  await expect(root.getByRole("button", { name: "Previous slide" })).toHaveCount(0);
  await expect(root.getByRole("button", { name: "Next slide" })).toHaveCount(0);
  await root.getByRole("link", { name: "Enlarge WaspadAI original cover" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await root.getByRole("button", { name: /^Show slide 2:/ }).click();
  const canvas = root.locator('[data-slide="verification"] [data-renderer="ready"] canvas');
  await expect(canvas).toBeVisible({ timeout: 30000 });
  await expect(page.locator("h1")).toHaveText("WaspadAI");
  await expect(root.getByRole("button", { name: "Putar mockup" })).toHaveCount(0);
  await expect(root.getByRole("group", { name: "Choose a project slide" })).toHaveCount(0);
  await expect(root.locator("[data-slide][inert]")).toHaveCount(2);
  const pixels = () => canvas.evaluate((node: HTMLCanvasElement) => node.toDataURL());
  const original = await pixels();
  const surface = root.getByRole("group", { name: /Putar ponsel/ });
  await surface.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(pixels).not.toBe(original);
  await expect(root.locator('[data-slide="verification"]')).not.toHaveAttribute("inert");
  await page.keyboard.press("Home");
  await expect.poll(pixels).toBe(original);
  const box = (await surface.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down(); await page.mouse.move(box.x + box.width * .75, box.y + box.height / 2, { steps: 8 }); await page.mouse.up();
  await expect.poll(pixels).not.toBe(original);
  await page.keyboard.press("Escape");
  await expect.poll(pixels).toBe(original);
  await expect(root.locator("canvas")).toHaveCount(1);
  const viewport = root.locator('[aria-label^="Project slides"]');
  await viewport.focus(); await page.keyboard.press("ArrowRight");
  await expect(root.locator('[data-slide="community"] [data-renderer="ready"] canvas')).toBeVisible();
  await viewport.focus(); await page.keyboard.press("ArrowRight");
  await expect(root.getByRole("button", { name: /^Show slide 1:/ })).toHaveAttribute("aria-current", "true");
  const artworkHeight = (await root.locator('[data-slide="introduction"] img').boundingBox())!.height;
  await expect.poll(async () => (await viewport.boundingBox())!.height).toBeCloseTo(artworkHeight, 1);
  const bounds = (await root.locator('[aria-label^="Project slides"]').boundingBox())!;
  for (const button of await root.getByRole("button", { name: /^Show slide/ }).all()) {
    const box = (await button.boundingBox())!;
    expect(box.y).toBeGreaterThan(bounds.y);
    expect(box.y).toBeGreaterThanOrEqual(bounds.y + bounds.height - 1);
  }
  await root.getByRole("button", { name: /^Show slide 3:/ }).click();
  await page.locator("#status").scrollIntoViewIfNeeded();
  await expect(root.locator("canvas")).toHaveCount(0);
  await root.scrollIntoViewIfNeeded();
  await expect(root.locator("canvas")).toHaveCount(1);
  expect((await new AxeBuilder({ page }).include('[aria-label="WaspadAI app showcase"]').withTags(["wcag2a", "wcag2aa"]).analyze()).violations).toEqual([]);
});

test("responsive covers and slides retain readable content", async ({ page }) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await fs.mkdir("artifacts/mobile-showcase", { recursive: true });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/", "/projects", "/projects/waspadai"]) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (route === "/projects/waspadai") {
        const root = page.getByRole("region", { name: label });
        for (let index = 0; index < 3; index++) {
          await root.getByRole("button", { name: new RegExp(`^Show slide ${index + 1}:`) }).click();
          await expect(root.locator(`[data-slide]:nth-child(${index + 1})`)).not.toHaveAttribute("inert");
          const slide = root.locator("[data-slide]").nth(index);
          if (index === 0) {
            const artwork = slide.locator("img");
            await artwork.scrollIntoViewIfNeeded();
            const box = (await artwork.boundingBox())!;
            expect(box.width / box.height).toBeCloseTo(16 / 9, 3);
          } else {
            await slide.getByRole("heading").scrollIntoViewIfNeeded();
            await expect(slide.getByRole("heading")).toBeInViewport();
          }
          await root.screenshot({ path: `artifacts/mobile-showcase/detail-${width}-${index + 1}.png` });
        }
      } else {
        const card = page.locator('[data-project="waspadai"]');
        await card.scrollIntoViewIfNeeded();
        await expect(card.getByRole("link")).toHaveAttribute("href", "/projects/waspadai");
        await expect(card.locator("canvas")).toHaveCount(0);
        const cover = card.locator('.project-visual img[src="/images/projects/waspadai/canva-hero.jpg"]');
        await expect(cover).toBeVisible();
        const dimensions = (await cover.boundingBox())!;
        expect(dimensions.width / dimensions.height).toBeCloseTo(16 / 9, 3);
        await card.screenshot({ path: `artifacts/mobile-showcase/${route === "/" ? "home" : "collection"}-${width}.png` });
      }
    }
  }
});

test("touch drag rotates the phone directly; swiping text navigates the carousel", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/projects/waspadai");
  const root = page.getByRole("region", { name: label });
  await root.getByRole("button", { name: /^Show slide 2:/ }).click();
  await root.locator('[data-renderer="ready"]').first().waitFor();
  const session = await context.newCDPSession(page);
  async function swipe(element: import("@playwright/test").Locator) {
    await element.scrollIntoViewIfNeeded();
    const box = (await element.boundingBox())!;
    const x = box.x + box.width * .8, y = box.y + box.height * .5;
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    for (let i = 1; i <= 8; i++) await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - i * box.width * .075, y }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  }
  await swipe(root.getByRole("group", { name: /Putar ponsel/ }));
  await expect(root.getByRole("button", { name: /^Show slide 2:/ })).toHaveAttribute("aria-current", "true");
  await swipe(root.locator('[data-slide="verification"] p').first());
  await expect(root.getByRole("button", { name: /^Show slide 3:/ })).toHaveAttribute("aria-current", "true");
  await context.close();
});

test("autoplay loops smoothly and pauses for interaction, hidden pages, and reduced motion", async ({ page }) => {
  test.setTimeout(90000);
  await page.goto("/projects/waspadai");
  const root = page.getByRole("region", { name: label });
  await expect(root).toHaveAttribute("data-playing", "true");
  await expect(root).toHaveAttribute("data-selected", "1", { timeout: 12000 });
  await root.hover();
  await expect(root).toHaveAttribute("data-playing", "false");
  await page.mouse.move(0, 0);
  await expect(root).toHaveAttribute("data-playing", "true");
  await root.getByRole("button", { name: "Pause slideshow" }).focus();
  await page.keyboard.press("Enter");
  await page.mouse.move(0, 0);
  await expect(root).toHaveAttribute("data-playing", "false");
  await root.getByRole("button", { name: "Play slideshow" }).focus();
  await page.keyboard.press("Enter");
  await page.mouse.move(0, 0);
  await expect(root).toHaveAttribute("data-playing", "true");
  await root.getByRole("button", { name: /^Show slide 3:/ }).click();
  await root.getByRole("button", { name: "Pause slideshow" }).focus();
  await page.keyboard.press("Enter");
  await root.getByRole("button", { name: "Play slideshow" }).focus();
  await page.keyboard.press("Enter");
  await page.mouse.move(0, 0);
  await expect(root).toHaveAttribute("data-selected", "0", { timeout: 12000 });
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(root).toHaveAttribute("data-playing", "false");
  await page.evaluate(() => {
    delete (document as unknown as { visibilityState?: string }).visibilityState;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(root).toHaveAttribute("data-playing", "true");
  await page.locator("#status").scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-playing", "false");
  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-playing", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(root).toHaveAttribute("data-playing", "false");
  await expect(root.getByRole("button", { name: "Pause slideshow" })).toHaveCount(0);
});

test("without JavaScript all slides are readable and controls stay hidden", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  await page.goto("/projects/waspadai");
  const root = page.getByRole("region", { name: label });
  await expect(root.locator("[data-slide][inert]")).toHaveCount(0);
  await expect(root.locator('[data-slide="introduction"] img')).toBeVisible();
  for (const heading of await root.locator('[data-slide]:not([data-artwork])').getByRole("heading").all()) await expect(heading).toBeVisible();
  await expect(root.getByRole("group", { name: "Project slide navigation" })).toHaveCount(0);
  await expect(root.locator("canvas")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("WebGL failure preserves posters and carousel navigation", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (String(args[0]).includes("webgl")) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto("/projects/waspadai");
  const root = page.getByRole("region", { name: label });
  await root.getByRole("button", { name: /^Show slide 2:/ }).click();
  await expect(root.getByRole("status")).toContainText("3D unavailable");
  await expect(root.locator('[data-slide="verification"] img[src*="verification-devices"]')).toBeVisible();
  await root.getByRole("button", { name: /^Show slide 3:/ }).click();
  await expect(root.getByRole("button", { name: /^Show slide 3:/ })).toHaveAttribute("aria-current", "true");
});

test("isolated screenshots enlarge, restore focus, preserve long images, and handle missing textures", async ({ page }) => {
  await page.goto("http://localhost:3101/showcase");
  const root = page.getByRole("region", { name: "Showcase QA app showcase" });
  await expect(root.locator('[data-slide="intro"] [data-renderer="ready"] canvas')).toBeVisible({ timeout: 30000 });
  const trigger = root.locator('[data-slide="intro"]').getByRole("button", { name: "View Wide fixture" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toContainText("Synthetic landscape screen");
  await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
  await root.getByRole("button", { name: /^Show slide 2:/ }).click();
  const longImage = root.getByRole("img", { name: "Tall synthetic screen" });
  await expect(longImage).toBeVisible();
  const dimensions = await longImage.evaluate(node => ({ width: node.clientWidth, height: node.clientHeight }));
  expect(dimensions.height / dimensions.width).toBeCloseTo(4, 1);
  await root.getByRole("button", { name: /^Show slide 3:/ }).click();
  await expect(root.getByRole("status")).toContainText("3D unavailable");
  await expect(root.locator('[data-slide="failure"] [data-renderer="fallback"]')).toBeVisible();
  await root.getByRole("button", { name: /^Show slide 2:/ }).click();
  await expect(root.locator('[data-slide="long"] [data-renderer="ready"] canvas')).toBeVisible();
});
