import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// Phase 3a: the Blocks gallery, the full-page previews and the @dx/<block> registry items.
const blockNames = fs.readdirSync(path.join(process.cwd(), "src/blocks")).filter((d) => /^[a-z-]+-\d\d$/.test(d)).sort();
type File = { path: string; type: string; target: string; content: string };
type Item = { name: string; type: string; registryDependencies: string[]; dependencies?: string[]; files: File[]; meta: { route: string } };

test("31 blocks: 16 sidebars, 4 dashboards, 3 auth, 2 settings, 2 data tables, 4 empty states", () => {
  const count = (c: string) => blockNames.filter((n) => n.replace(/-\d+$/, "") === c).length;
  expect([count("sidebar"), count("dashboard"), count("auth"), count("settings"), count("data-table"), count("empty-state")]).toEqual([16, 4, 3, 2, 2, 4]);
});

test("every block installs as one self-contained registry item", async ({ request }) => {
  for (const name of blockNames) {
    const item = (await (await request.get(`r/v4/${name}.json`)).json()) as Item;
    expect(item.type, name).toBe("registry:block");
    expect(item.registryDependencies.some((d) => d.endsWith("/init.json")), `${name} needs init`).toBe(true);
    const page = item.files.find((f) => f.type === "registry:page");
    expect(page?.target, name).toBe(`app${item.meta.route}/page.tsx`);
    const targets = new Set(item.files.map((f) => f.target));
    for (const f of item.files) {
      expect(f.content, `${name}: ${f.target} still has a repo-relative import`).not.toMatch(/from "\.\.?\//);
      for (const [, mod] of f.content.matchAll(/from "@\/components\/ui\/([\w-]+)"/g))
        expect(item.registryDependencies.some((d) => d.endsWith(`/ui-${mod}.json`)), `${name}: ${f.target} uses ui/${mod}`).toBe(true);
      for (const [, part] of f.content.matchAll(/from "@\/components\/(?!ui\/)([\w-]+)"/g))
        expect(targets.has(`components/${part}.tsx`) || targets.has(`components/${part}.ts`), `${name}: ${f.target} imports ${part}`).toBe(true);
    }
  }
});

test("Blocks index links every category; each category page shows its blocks with install commands", async ({ page }) => {
  await page.goto("blocks/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Blocks");
  for (const c of ["Sidebar", "Dashboard", "Authentication", "Settings", "Data table", "Empty states"]) await expect(page.getByRole("link", { name: new RegExp(`^${c}`) }).first()).toBeVisible();
  await page.goto("blocks/dashboard/");
  const frames = page.locator("main iframe");
  await expect(frames).toHaveCount(4);
  await expect(page.getByText("npx shadcn@latest add @dx/dashboard-01", { exact: true })).toBeVisible();
});

test("block viewer: Code lists the installed files; the moon button darkens only the preview", async ({ page }) => {
  await page.goto("blocks/dashboard/");
  const viewer = page.locator("#dashboard-01");
  await viewer.getByRole("tab", { name: "Code" }).click();
  await expect(viewer.getByRole("button", { name: "app/dashboard/page.tsx" })).toBeVisible();
  await viewer.getByRole("button", { name: "components/visitors-chart.tsx" }).click();
  await expect(viewer.locator(".ds-code")).toContainText("VisitorsChart");
  await viewer.getByRole("tab", { name: "Preview" }).click();
  const frame = viewer.locator("iframe");
  await frame.scrollIntoViewIfNeeded();
  await expect(frame.contentFrame().getByRole("heading", { level: 1 })).toHaveText("Dashboard");
  await viewer.getByRole("button", { name: "Dark mode for this preview" }).click();
  await expect.poll(() => frame.evaluate((f: HTMLIFrameElement) => f.contentDocument?.documentElement.dataset.theme)).toBe("dark");
  expect(await page.evaluate(() => document.documentElement.dataset.theme ?? "light")).not.toBe("dark");
});

test("sidebar: Ctrl+B and the trigger collapse it to the icon rail; labels stay readable", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("view/sidebar-07/");
  const trigger = page.getByRole("button", { name: "Toggle sidebar" });
  const sidebar = page.locator("[data-slot=sidebar]");
  await expect(sidebar).toHaveAttribute("data-state", "expanded");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Control+b");
  await expect(sidebar).toHaveAttribute("data-state", "collapsed");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("button", { name: "Models" })).toBeVisible(); // name still exposed in the rail
  await trigger.click();
  await expect(sidebar).toHaveAttribute("data-state", "expanded");
});

test("sidebar: a section opens and closes (disclosure)", async ({ page }) => {
  await page.goto("view/sidebar-07/");
  const models = page.getByRole("button", { name: "Models" });
  await expect(models).toHaveAttribute("aria-expanded", "false");
  await models.click();
  await expect(models).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: "Genesis" })).toBeVisible();
});

test("sidebar on a phone: a modal drawer that Esc closes, returning focus to the trigger", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("view/sidebar-07/");
  const trigger = page.getByRole("button", { name: "Toggle sidebar" });
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "Main navigation" });
  await expect(drawer).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("data table: search, filter, select and bulk actions", async ({ page }) => {
  await page.goto("view/data-table-01/");
  await page.getByRole("searchbox", { name: "Search tasks" }).fill("contrast");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("checkbox", { name: /^Select TASK-/ }).check();
  await expect(page.getByRole("region", { name: "Bulk actions" })).toContainText("1 selected");
});

test("auth: submitting empty shows an error summary that names each field", async ({ page }) => {
  await page.goto("view/auth-01/");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("link", { name: /Enter an email address/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Enter your password/ })).toBeVisible();
});
