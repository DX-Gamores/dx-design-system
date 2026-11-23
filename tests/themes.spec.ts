import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { MODES, buildBrand, contrast, decodeInput, encodeInput, ramp, rgbToOklch, hexToRgb, type ThemeInput, type Vars } from "../src/lib/theme/engine";

// Phase 3b: theme builder, brand gallery and gate G3 (the pilot brand passes contrast in 4 modes and installs as @dx/theme-<brand>).
const vars = JSON.parse(fs.readFileSync(path.join(process.cwd(), "figma/variables.raw.json"), "utf8")) as Vars;
const galleryFiles = fs.readdirSync(path.join(process.cwd(), "themes")).filter((f) => f.endsWith(".json"));
const base: ThemeInput = { name: "Test", primary: "#2563eb", accent: "teal", neutral: "gray", headingFont: "Inter", bodyFont: "Inter", radiusControl: "md", radiusContainer: "lg", density: "comfortable" };

test("engine: a ramp holds the seed exactly and gets darker step by step", () => {
  for (const seed of ["#2f7d4f", "#facc15", "#0b1f4d", "#e11d48", "#a5d8ff"]) {
    const { steps, seedIndex } = ramp(seed);
    expect(steps[seedIndex]).toBe(seed);
    const L = steps.map((s) => rgbToOklch(hexToRgb(s))[0]);
    for (let i = 1; i < L.length; i++) expect(L[i], `${seed} step ${i}`).toBeLessThan(L[i - 1]);
  }
});

test("engine: light brand colours get dark text; every sample brand passes 27 pairs × 4 modes", () => {
  const lemon = buildBrand(vars, { ...base, primary: "#facc15" });
  expect(lemon.roles.onSolid).toBe("dark");
  expect(lemon.values["brand/role/solid"]).toBe("#facc15");
  for (const primary of ["#2563eb", "#7c3aed", "#fbbf24", "#2f7d4f", "#facc15", "#0b1f4d", "#e11d48", "#a5d8ff", "#0d9488"])
    for (const neutral of ["gray", "stone", "tinted"] as const) {
      const b = buildBrand(vars, { ...base, primary, neutral });
      const fails = MODES.flatMap((m) => b.audit[m].filter((r) => !r.pass).map((r) => `${m} ${r.fg}/${r.bg} ${r.ratio}`));
      expect(fails, `${primary} ${neutral}`).toEqual([]);
    }
});

test("engine: share links round-trip", () => {
  const i: ThemeInput = { ...base, name: "Kite & Co", primary: "#0d9488", accent: "#d97706", neutral: "tinted", headingFont: "Figtree", radiusControl: "full" };
  expect(decodeInput(encodeInput(i), base)).toEqual(i);
});

test("G3: every gallery brand passes the audit in all four colour modes", () => {
  expect(galleryFiles.length).toBeGreaterThan(0);
  for (const f of galleryFiles) {
    const { $comment, ...input } = JSON.parse(fs.readFileSync(path.join(process.cwd(), "themes", f), "utf8"));
    const b = buildBrand(vars, input);
    expect(`${b.passed}/${b.total}`, f).toBe("108/108");
    expect(contrast(String(b.values["brand/role/on-solid"]), String(b.values["brand/role/solid"]))).toBeGreaterThanOrEqual(4.5);
  }
});

test("G3: the pilot brand installs as @dx/theme-mangrove", async ({ request }) => {
  const index = (await (await request.get("r/v4/registry.json")).json()) as { items: { name: string }[] };
  expect(index.items.map((i) => i.name)).toContain("theme-mangrove");
  const item = (await (await request.get("r/v4/theme-mangrove.json")).json()) as { files: { target: string; content: string }[]; css: Record<string, unknown>; dependencies: string[]; registryDependencies: string[] };
  expect(item.registryDependencies.some((d) => d.endsWith("/init.json"))).toBe(true);
  expect(item.dependencies).toContain("@fontsource/plus-jakarta-sans");
  const css = item.files.find((f) => f.target === "styles/dx-brand-mangrove.css");
  expect(css?.content).toContain(':root[data-brand="mangrove"]');
  expect(Object.keys(item.css)).toContain('@import "../styles/dx-brand-mangrove.css"');
  expect(item.files.map((f) => f.target)).toEqual(expect.arrayContaining(["lib/dx-brand-mangrove.ts", "tokens/dx-brand-mangrove.tokens.json"]));
});

for (const theme of MODES) {
  test(`G3: a block in the pilot brand passes axe · ${theme}`, async ({ page }) => {
    await page.goto(`view/dashboard-01/?brand=mangrove&theme=${theme}`);
    await expect(page.locator("html")).toHaveAttribute("data-brand", "mangrove");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const solid = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--ds-brand-role-solid").trim());
    expect(solid).toBe("#2f7d4f");
    const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(res.violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
  });
}

test("builder: a light primary flips button text to dark, and the share link keeps the settings", async ({ page }) => {
  await page.goto("themes/builder/");
  await expect(page.getByText(/108\/108 checks pass/)).toBeVisible();
  const field = page.getByRole("textbox", { name: "Primary colour", exact: true });
  await field.fill("#facc15");
  await expect(page.getByText(/text on the brand colour is dark/)).toBeVisible();
  await expect(page.getByText(/108\/108 checks pass/)).toBeVisible();
  await expect(page).toHaveURL(/p=facc15/);
  const url = page.url();
  await page.goto(url);
  await expect(page.getByRole("textbox", { name: "Primary colour", exact: true })).toHaveValue("#facc15");
  await page.getByRole("tab", { name: "CSS" }).click();
  await expect(page.getByRole("tabpanel").locator("pre")).toContainText("--ds-brand-role-on-solid: #");
});

test("builder: a brand that isn't in the gallery offers a pre-filled pull request", async ({ page }) => {
  await page.goto("themes/builder/");
  await page.getByRole("textbox", { name: "Brand name" }).fill("Kite and Co");
  const link = page.getByRole("link", { name: /Add to the gallery on GitHub/ });
  await expect(link).toHaveAttribute("href", /\/new\/main\?filename=themes%2Fkite-and-co\.json&value=/);
});

test("brand gallery lists the pilot brand with its install command", async ({ page }) => {
  await page.goto("themes/gallery/");
  await expect(page.getByRole("heading", { name: "Mangrove" })).toBeVisible();
  await expect(page.getByText("npx shadcn@latest add @dx/theme-mangrove", { exact: true })).toBeVisible();
});
