import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(process.env.PLAYWRIGHT_CHANNEL
          ? { channel: process.env.PLAYWRIGHT_CHANNEL }
          : {}),
      },
    },
  ],
  webServer: [
    {
      command: "npm run start -- --port 3000",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: "npx next dev tests/gallery-app --port 3101",
      url: "http://localhost:3101",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
