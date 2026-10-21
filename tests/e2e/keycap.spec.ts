import { expect, test } from "@playwright/test";

test("homepage omits the A keycap and does not load its 3D model", async ({ page }) => {
  const modelRequests: string[] = [];
  page.on("request", request => {
    if (request.url().includes("aini-keycap.glb")) modelRequests.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator(".archive-photo")).toHaveCount(3);
  await expect(page.locator(".intro-keycap-a, .about-keycap, .keycap-3d, .intro-flow canvas")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "View my projects", exact: true })).toBeVisible();
  expect(modelRequests).toEqual([]);
});

test("Enter cap presses while its socket stays fixed and still opens Projects", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const key = page.getByRole("link", { name: "View my projects", exact: true });
  await key.scrollIntoViewIfNeeded();
  const socket = key.locator(".intro-keycap-base");
  const cap = key.locator(".intro-keycap-face");
  const initialSocket = await socket.boundingBox();
  const box = (await key.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(key).toHaveAttribute("data-pressed", "true");
  await expect.poll(() => cap.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42)).toBeGreaterThan(0.5);
  expect(await socket.boundingBox()).toEqual(initialSocket);
  await page.mouse.up();
  await expect(key).toHaveAttribute("data-pressed", "false");
  await expect(page.locator("#projects")).toBeInViewport();
});

test("Enter supports held keyboard input and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const key = page.getByRole("link", { name: "View my projects", exact: true });
  await key.focus();
  await page.keyboard.down("Enter");
  await expect(key).toHaveAttribute("data-pressed", "true");
  await expect(key.locator(".intro-keycap-face")).toHaveCSS("transform", "none");
  await page.keyboard.up("Enter");
  await expect(key).toHaveAttribute("data-pressed", "false");
  await expect(page.locator("#projects")).toBeInViewport();
});

test("mobile Enter tap navigates without horizontal overflow", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await page.getByRole("link", { name: "View my projects", exact: true }).tap();
  await expect(page.locator("#projects")).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
