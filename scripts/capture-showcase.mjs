/** Capture transparent posters from the actual reusable Three.js scene.
 * Start the site, then: node scripts/capture-showcase.mjs waspadai
 * Optional: SHOWCASE_ORIGIN=http://localhost:3002
 */
import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const slug = process.argv[2] || "waspadai";
if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("Use a project slug, such as waspadai");
const origin = process.env.SHOWCASE_ORIGIN || "http://localhost:3000";
const browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}), args: ["--enable-webgl", "--use-gl=angle", "--use-angle=swiftshader"] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 2 });
  await page.goto(`${origin}/projects/${slug}`, { timeout: 120000, waitUntil: "domcontentloaded" });
  // The semantic label uses the display title, so locate by the stable enhancement attribute.
  const root = page.locator('[data-enhanced="true"]').filter({ has: page.locator("[data-slide]") });
  await root.waitFor();
  const slides = root.locator("[data-slide]");
  const targets = await slides.evaluateAll(nodes => nodes.map(node => ({ id: node.getAttribute("data-slide"), poster: node.querySelector('img[src*="devices"]')?.getAttribute("src") })));
  for (let index = 0; index < targets.length; index++) {
    await root.getByRole("button", { name: `Show slide ${index + 1}:`, exact: false }).click();
    const slide = slides.nth(index);
    await slide.scrollIntoViewIfNeeded();
    const canvas = slide.locator('[data-renderer="ready"] canvas');
    await canvas.waitFor({ timeout: 30000 });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const data = await canvas.evaluate(node => node.toDataURL("image/png").split(",")[1]);
    const poster = targets[index].poster;
    if (!poster) throw new Error(`Set a poster path for slide ${targets[index].id} before capturing`);
    const asset = new URL(poster, origin);
    const source = asset.searchParams.get("url") || asset.pathname;
    if (!source.startsWith(`/images/projects/${slug}/`) || !source.endsWith(".png")) throw new Error(`Unexpected poster destination: ${source}`);
    const destination = path.resolve("public", `.${source}`);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, Buffer.from(data, "base64"));
    console.log(`Captured ${destination}`);
  }
} finally { await browser.close(); }
