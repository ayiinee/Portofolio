import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects, featuredProjects } from "../../src/data/projects";
import fs from "node:fs/promises";

test("homepage content, section links, and portrait interaction", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(".hero-one-liner")).toHaveCount(0);
  await expect(page.locator(".hero-greeting")).toHaveAccessibleName(
    "Hi, I’m A'ini.",
  );
  await expect(page.locator(".typing-line")).toHaveClass(/typing-complete/);
  await expect(page.locator(".hero-footline, .workspace-note")).toHaveCount(0);
  await expect(page.locator("#about h2")).toHaveText("About me");
  await expect(page.locator(".profile-panel-glass")).toHaveCSS(
    "backdrop-filter",
    /blur\(24px\)/,
  );
  await expect(page.locator(".hero-edition")).toHaveCount(0);
  await expect(page.locator(".photo-memory")).toHaveCount(2);
  await expect(page.locator(".folder-glass-panel")).toBeVisible();
  // Verify the production CSS retains the actual frosting, not only its tint.
  await expect(page.locator(".folder-glass-panel")).toHaveCSS(
    "backdrop-filter",
    /blur\(16px\)/,
  );
  await expect(page.locator(".folder-open")).toHaveCount(0);
  const glass = await page.locator(".folder-glass-panel").boundingBox();
  const edge = await page.locator(".folder-glass-edges").boundingBox();
  expect(Math.abs(glass!.width - edge!.width)).toBeLessThanOrEqual(1);
  await expect(page.locator(".about-sheet .lanyard-stage")).toHaveCount(0);
  const lanyard = await page
    .locator(".about-layout > .about-lanyard")
    .boundingBox();
  const aboutSheet = await page.locator(".about-sheet").boundingBox();
  expect(lanyard!.x + lanyard!.width).toBeLessThanOrEqual(aboutSheet!.x);
  await expect(page.locator("#about .text-link")).toHaveCount(0);
  await expect(page.locator(".hero-kicker")).toHaveCount(0);
  expect(
    await page
      .locator("[data-project]")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-project")),
      ),
  ).toEqual(featuredProjects.map((project) => project.slug));
  await expect(
    page.getByRole("link", { name: "View My Work" }),
  ).toHaveAttribute("href", "#projects");
  await expect(
    page.getByRole("link", { name: "Let’s Connect" }),
  ).toHaveAttribute("href", "#contact");
  const portrait = page.locator(".portrait-card");
  const dimensions = await portrait.evaluate((element) => ({
    width: element.clientWidth,
    height: element.clientHeight,
  }));
  expect(Math.abs(dimensions.width - dimensions.height)).toBeLessThanOrEqual(1);
  await expect(portrait).toHaveCSS("transform", "none");
  await portrait.hover();
  await expect(portrait).toHaveCSS("transform", "none");
  await page.mouse.move(0, 0);
  await expect(portrait).toHaveCSS("transform", "none");
  await expect(page.locator(".lanyard-art img")).toHaveAttribute(
    "src",
    /blue-lanyard/,
  );
  await page.locator('.nav-pill a[href="#education"]').click();
  await expect(page.locator(".nav-shell")).toHaveClass(/is-scrolled/);
  await expect(page.locator(".nav-glass")).toHaveCSS("opacity", "1");
  await expect(page.locator('.nav-pill a[href="#education"]')).toHaveAttribute(
    "aria-current",
    "location",
  );
  expect(errors).toEqual([]);
});

test("collection filtering and Load More remain independent", async ({
  page,
}) => {
  await page.goto("/projects");
  const cards = page.locator("#project-results [data-project]");
  await expect(cards).toHaveCount(6);
  await page.getByRole("button", { name: "Load More" }).click();
  await expect(cards).toHaveCount(11);
  await expect(page.getByRole("button", { name: "Load More" })).toHaveCount(0);
  for (const [category, count] of [
    ["Cloud & DevOps", 2],
    ["Backend & Web", 4],
    ["AI & Security", 3],
    ["GIS & IoT", 2],
  ] as const) {
    await page.getByRole("button", { name: category }).click();
    await expect(cards).toHaveCount(count);
    expect(
      await cards.evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-project")),
      ),
    ).toEqual(
      projects
        .filter((project) => project.category === category)
        .map((project) => project.slug),
    );
  }
  await page.getByRole("button", { name: /^All/ }).click();
  await expect(cards).toHaveCount(6);
  await expect(page.getByRole("status")).toHaveText("Showing 6 of 11 projects");
  await cards.first().getByRole("link").click();
  await expect(page).toHaveURL(/aws-serverless-ticketing$/);
  await expect(page.locator(".nav-pill a.is-active")).toHaveText("Projects");
  await expect(page.locator('.nav-pill a[href="/#about"]')).toHaveCount(1);
});

test("every case study has unique metadata, context, and valid navigation", async ({
  page,
}) => {
  for (const project of projects) {
    const errors: string[] = [];
    const handler = (error: Error) => errors.push(error.message);
    const onConsole = (message: import("@playwright/test").ConsoleMessage) => {
      if (message.type() === "error") errors.push(message.text());
    };
    page.on("pageerror", handler);
    page.on("console", onConsole);
    const response = await page.goto(`/projects/${project.slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(project.title);
    await expect(page).toHaveTitle(`${project.title} | Qurrotul A'ini`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      project.shortDescription,
    );
    await expect(
      page
        .getByRole("navigation", { name: "Adjacent projects" })
        .getByRole("link"),
    ).toHaveCount(2);
    await expect(page.locator(".gallery-empty")).toContainText(
      "Project image coming soon",
    );
    await expect(page.locator("main")).not.toContainText("TODO");
    expect(errors).toEqual([]);
    page.off("pageerror", handler);
    page.off("console", onConsole);
  }
  expect((await page.goto("/projects/missing-project"))?.status()).toBe(404);
});

test("responsive layouts and mobile navigation", async ({ page }) => {
  test.setTimeout(120_000);
  // Capture every section without offscreen scroll-reveal opacity hiding it.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await fs.mkdir("artifacts/review", { recursive: true });
  for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/",
      "/projects",
      "/projects/aws-infrastructure-recovery",
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${route} at ${width}px`,
      ).toBe(true);
      if (route === "/") {
        const heading = await page
          .locator(".about-section-heading")
          .boundingBox();
        const lanyard = await page.locator(".about-lanyard").boundingBox();
        const panel = await page.locator(".about-sheet").boundingBox();
        if (width <= 900) {
          expect(heading!.y + heading!.height).toBeLessThanOrEqual(
            lanyard!.y + 1,
          );
          expect(lanyard!.y + lanyard!.height).toBeLessThanOrEqual(
            panel!.y + 1,
          );
        } else {
          expect(Math.abs(heading!.x - panel!.x)).toBeLessThanOrEqual(1);
          expect(lanyard!.x + lanyard!.width).toBeLessThanOrEqual(panel!.x);
        }
        await page.screenshot({
          path: `artifacts/review/home-${width}.png`,
          fullPage: true,
        });
      }
      if (width === 1440 && route !== "/")
        await page.screenshot({
          path: `artifacts/review/${route === "/projects" ? "projects" : "case-study"}.png`,
          fullPage: true,
        });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeHidden();
  await toggle.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Achievement" })
    .click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#education")).toBeInViewport();
});

test("keyboard, contrast, and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.locator(".portrait-card").hover();
  await expect(page.locator(".portrait-card")).toHaveCSS("transform", "none");
  await expect(page.locator(".lanyard-stage")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  for (const route of ["/", "/projects", "/projects/waspadai"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});

test("content and all project links remain readable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("#about")).not.toHaveCSS("opacity", "0");
  await page.goto("/projects");
  for (const project of projects)
    await expect(
      page.locator(`noscript a[href="/projects/${project.slug}"]`),
    ).toBeVisible();
  await context.close();
});
