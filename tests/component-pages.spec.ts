import { expect, test } from "@playwright/test";
import specs from "../docs/components.json";
import coded from "../src/site/coded.json";

// Gate G2: all 63 component pages use the v4 template.
for (const s of specs as { n: string; slug: string }[]) {
  test(`component page · ${s.slug}`, async ({ page }) => {
    await page.goto(`components/${s.slug}/`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(s.n);
    await expect(page.getByRole("tab", { name: "Preview" }).first()).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tab", { name: "Code" }).first()).toBeVisible();
    for (const section of ["Accessibility", "Figma spec"]) await expect(page.getByRole("heading", { level: 2, name: section })).toBeVisible();
    if ((coded.coded as Record<string, string>)[s.slug]) {
      await expect(page.getByRole("heading", { level: 2, name: "Installation" })).toBeVisible();
      await expect(page.getByText(`npx shadcn@latest add @dx/${s.slug}`, { exact: true })).toBeVisible();
      await expect(page.getByRole("heading", { level: 2, name: "API" })).toBeVisible();
    }
  });
}

test("Code tab shows the example source with a copy button", async ({ page }) => {
  await page.goto("components/button/");
  await page.getByRole("tab", { name: "Code" }).first().click();
  const panel = page.getByRole("tabpanel").filter({ hasText: "export default function Example" }).first();
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('import { Button } from "@/components/ui/button"');
  await expect(page.getByRole("button", { name: "Copy code" }).first()).toBeVisible();
});

test("preview width and dark mode change only the preview", async ({ page }) => {
  await page.goto("components/button/");
  await page.getByRole("button", { name: "Phone · 390px" }).first().click();
  const stage = page.locator("[role=tabpanel] > div").first();
  await expect(stage).toHaveCSS("max-width", "390px");
  await page.getByRole("button", { name: "Dark mode for this preview" }).first().click();
  await expect(stage).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
});
