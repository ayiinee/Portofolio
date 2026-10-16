import assert from "node:assert/strict";
import fs from "node:fs/promises";
import ts from "typescript";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const source = (
  await fs.readFile(new URL("../src/data/projects.ts", import.meta.url), "utf8")
).replaceAll("\r\n", "\n");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const { projects: records } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
assert.equal(records.length, 11);
assert.equal(new Set(records.map((project) => project.slug)).size, 11);
assert.equal(records.filter((project) => project.featured).length, 6);

// Check URL behavior without inventing a production domain or requiring deployment.
const originSource = await fs.readFile(
  new URL("../src/lib/site.ts", import.meta.url),
  "utf8",
);
const originModule = ts.transpileModule(originSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const { getSiteOrigin } = await import(
  `data:text/javascript;base64,${Buffer.from(originModule.outputText).toString("base64")}`
);
const keys = [
  "NODE_ENV",
  "NEXT_PUBLIC_SITE_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "VERCEL_URL",
  "VERCEL",
];
const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
try {
  for (const key of keys) delete process.env[key];
  process.env.NODE_ENV = "production";
  assert.equal(getSiteOrigin(), undefined);
  process.env.VERCEL_URL = "preview.example.test";
  assert.equal(getSiteOrigin(), "https://preview.example.test");
  process.env.VERCEL_PROJECT_PRODUCTION_URL = "production.example.test";
  assert.equal(getSiteOrigin(), "https://production.example.test");
  process.env.NEXT_PUBLIC_SITE_URL = "https://custom.example.test/";
  assert.equal(getSiteOrigin(), "https://custom.example.test");
  process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
  process.env.VERCEL = "1";
  assert.throws(getSiteOrigin, /public site URL/);
  for (const key of keys) delete process.env[key];
  process.env.NODE_ENV = "development";
  assert.equal(getSiteOrigin(), "http://localhost:3000");
} finally {
  for (const key of keys) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
}

for (const route of [
  "/",
  "/projects",
  ...records.map((project) => `/projects/${project.slug}`),
]) {
  const response = await fetch(new URL(route, base));
  assert.equal(response.status, 200, `${route} responds successfully`);
  const html = await response.text();
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${route} has unique ids`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${route} has one h1`);
  assert(html.includes('id="main-content"'));
  assert(
    !html.includes('style="opacity:0'),
    "Server content is readable without JavaScript",
  );
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g))
    assert(ids.includes(id), `${route} anchor ${id} exists`);
  if (route === "/") {
    for (const id of [
      "top",
      "about",
      "experience",
      "projects",
      "skills",
      "education",
      "contact",
    ])
      assert(ids.includes(id));
    const slugs = [...html.matchAll(/data-project="([^"]+)"/g)].map(
      (match) => match[1],
    );
    assert.deepEqual(
      slugs,
      records
        .filter((project) => project.featured)
        .map((project) => project.slug),
    );
    assert(html.includes("mailto:qurrotulaini0325@gmail.com"));
    assert(!html.includes('class="hero-kicker"'));
  }
  if (route.startsWith("/projects/")) {
    const project = records.find((item) => route.endsWith(`/${item.slug}`));
    assert(
      html.includes(
        project.title.replaceAll("&", "&amp;").replaceAll("'", "&#x27;"),
      ),
    );
    assert(html.includes('name="description"'));
    assert(html.includes('aria-label="Adjacent projects"'));
    assert(html.includes("Project image coming soon"));
    assert(!html.includes("TODO"));
  }
}
assert.equal(
  (await fetch(new URL("/projects/unknown-project", base))).status,
  404,
);
for (const asset of [
  "/icon.svg",
  "/images/portrait-placeholder.svg",
  "/robots.txt",
  "/sitemap.xml",
  "/opengraph-image",
]) {
  const response = await fetch(new URL(asset, base));
  assert.equal(response.status, 200, `${asset} loads`);
  if (asset === "/opengraph-image")
    assert(response.headers.get("content-type")?.startsWith("image/png"));
}
console.log(
  "PASS: 13 pages, 11 unique projects, six featured projects in order, section anchors, metadata, media placeholders, navigation, static assets, SEO routes, and unknown-project 404.",
);
