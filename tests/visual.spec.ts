import { expect, test } from "@playwright/test";

// Visual regression: every live example and every template at the three Figma breakpoints.
// Baselines live in tests/visual.spec.ts-snapshots/. After an intended change: npm run test:update.
const FIXED = new Date("2026-11-12T10:00:00");
test.beforeEach(async ({ page }) => { await page.clock.setFixedTime(FIXED); });

const components = [
  "button", "link", "text-field", "select", "combobox", "date-field", "textarea", "search-field", "checkbox", "radio", "toggle", "slider", "chip",
  "file-upload", "alert", "toast", "progress-bar", "empty-state", "tooltip", "badge", "dialog", "popover", "menu", "breadcrumbs", "tabs",
  "segmented-control", "stepper", "accordion-item", "avatar", "card", "divider", "list-item", "table-cell", "form-section", "ai-response", "stat-card",
];
for (const c of components) {
  test(`example · ${c}`, async ({ page }) => {
    await page.goto(`components/${c}/`);
    const preview = page.locator("main [role=tabpanel]").first();
    await expect(preview).toHaveScreenshot(`component--${c}.png`);
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
