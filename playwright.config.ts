import { defineConfig, devices } from "@playwright/test";

// Runs against the static export (npm run build:pages), served under the GitHub Pages path.
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: { baseURL: "http://localhost:4173/dx-design-system/", reducedMotion: "reduce", trace: "retain-on-failure" },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled", caret: "hide" } },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } }],
  webServer: { command: "node scripts/serve-out.mjs", url: "http://localhost:4173/dx-design-system/", reuseExistingServer: !process.env.CI, timeout: 30_000 },
});
