import { expect, test } from "@playwright/test";

test("3D keycap compresses, changes letters and stays on the home page", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const key = page.getByRole("button", { name: /^Keycap A\./ });
  await expect(key).toHaveAttribute("data-renderer", "ready");
  const canvas = key.locator("canvas");
  await expect(canvas).toBeVisible();
  const rest = await canvas.screenshot();
  const box = (await key.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(key).toHaveAttribute("data-pressed", "true");
  // Compare the actual WebGL pixels after travel settles, not just a CSS class.
  await expect.poll(async () => (await canvas.screenshot()).equals(rest)).toBe(false);
  await page.mouse.up();
  const button = page.locator(".keycap-3d");
  await expect(button).toHaveAttribute("data-pressed", "false");
  await expect(button).toHaveAccessibleName("Keycap I. Press to change to N.");
  for (const letter of ["N", "I", "A"]) {
    await button.click();
    await expect(button).toHaveAttribute("data-letter", letter);
  }
  await expect(button.locator("canvas")).toHaveCount(1);
  await expect(page).not.toHaveURL(/#/);
  expect(errors).toEqual([]);
});

test("keycap supports keyboard, reduced motion and cancelled presses", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const key = page.locator(".keycap-3d");
  await expect(key).toHaveAttribute("data-renderer", "ready");
  await key.focus();
  await page.keyboard.down("Space");
  await expect(key).toHaveAttribute("data-pressed", "true");
  await page.keyboard.up("Space");
  await expect(key).toHaveAttribute("data-letter", "I");
  await page.keyboard.down("Enter");
  await expect(key).toHaveAttribute("data-letter", "N");
  await page.keyboard.down("Enter");
  await expect(key).toHaveAttribute("data-letter", "N");
  await page.keyboard.up("Enter");
  await expect(key).toHaveAttribute("data-pressed", "false");
  await key.dispatchEvent("pointercancel");
  await expect(key).toHaveAttribute("data-letter", "N");
  await expect(key).toHaveCSS("transform", "none");
});

test("keycap remains usable when the model is unavailable", async ({ page }) => {
  await page.route("**/models/aini-keycap.glb", route => route.fulfill({ status: 503, body: "Unavailable" }));
  await page.goto("/");
  const key = page.locator(".keycap-3d");
  await expect(key).toHaveAttribute("data-renderer", "fallback");
  await expect(key.locator(".keycap-3d-fallback")).toHaveText("A");
  await key.click();
  await expect(key.locator(".keycap-3d-fallback")).toHaveText("I");
});

test("mobile tap advances one letter without resizing the About panel", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  const key = page.locator(".keycap-3d");
  await expect(key).toHaveAttribute("data-renderer", "ready");
  await key.scrollIntoViewIfNeeded();
  const initial = await page.locator(".about-sheet").boundingBox();
  await key.tap();
  await expect(key).toHaveAttribute("data-letter", "I");
  await key.tap();
  await expect(key).toHaveAttribute("data-letter", "N");
  expect(await page.locator(".about-sheet").boundingBox()).toEqual(initial);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
