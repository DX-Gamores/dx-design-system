import { expect, test } from "@playwright/test";

// Visual regression: every live example and every template at the three Figma breakpoints.
// Baselines live in tests/visual.spec.ts-snapshots/. After an intended change: npm run test:update.
const FIXED = new Date("2026-11-12T10:00:00");
test.beforeEach(async ({ page }) => { await page.clock.setFixedTime(FIXED); });

const examplePages = [
  "actions/button", "actions/link", "inputs/text-field", "inputs/select", "inputs/combobox", "inputs/date-picker", "inputs/textarea", "inputs/search-field",
  "inputs/checkbox", "inputs/radio", "inputs/toggle", "inputs/slider", "inputs/chip", "inputs/file-upload", "feedback/alert", "feedback/toast", "feedback/progress",
  "feedback/empty-state", "feedback/tooltip", "feedback/badge", "overlays/dialog", "overlays/popover-and-drawer", "overlays/menu", "navigation/navigation",
  "navigation/tabs", "navigation/segmented-control", "navigation/stepper", "navigation/accordion", "data-display/avatar", "data-display/card", "data-display/divider",
  "data-display/lists-and-tables", "patterns/form-patterns", "patterns/ai-patterns", "product-kit/stat-card",
];
for (const p of examplePages) {
  test(`example · ${p}`, async ({ page }) => {
    await page.goto(`${p}/`);
    const section = page.locator("section").filter({ has: page.getByRole("heading", { name: "Live example", level: 2 }) });
    await expect(section).toHaveScreenshot(`${p.replace("/", "--")}.png`);
  });
}

const screens = ["dashboard", "members", "members/empty", "settings", "sign-in"];
const widths = { desktop: [1440, 900], tablet: [834, 1000], mobile: [390, 844] } as const;
for (const s of screens) for (const [bp, [w, h]] of Object.entries(widths)) {
  test(`template · ${s} · ${bp}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(`templates/${s}/`);
    await expect(page).toHaveScreenshot(`template--${s.replace("/", "-")}--${bp}.png`);
  });
}
