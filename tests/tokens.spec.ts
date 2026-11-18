import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { brands, colors, createTheme, modes } from "../dist/tokens.native";

// React Native tokens resolve to exactly what the browser computes from dist/tokens.css,
// for every semantic color in every brand × color mode.
const raw = JSON.parse(fs.readFileSync(path.join(__dirname, "../figma/variables.raw.json"), "utf8")) as { n: string; v: [string, string, unknown[]][] }[];
const colorNames = raw.find((c) => c.n === "Color")!.v.map(([n]) => n);
const camel = (s: string) => s.replace(/-([a-z0-9])/g, (_, ch: string) => ch.toUpperCase());
// "#fff" → "#ffffff", "#0003" → "#00000033"
const full = (h: string) => (/^#[0-9a-f]{3,4}$/i.test(h) ? "#" + [...h.slice(1)].map((c) => c + c).join("") : h).toLowerCase();
const nativeValue = (obj: unknown, name: string) =>
  name
    .replace(/^color\//, "")
    .split("/")
    .map(camel)
    .reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], obj);

test("native colors match the CSS tokens in every brand and mode", async ({ page }) => {
  await page.goto("start/getting-started/");
  for (const brand of brands) {
    for (const mode of modes) {
      const css = await page.evaluate(
        ({ brand, mode, names }) => {
          const el = document.createElement("div");
          el.dataset.brand = brand;
          el.dataset.theme = mode;
          document.body.append(el);
          const cs = getComputedStyle(el);
          const out = Object.fromEntries(names.map((n) => [n, cs.getPropertyValue("--ds-" + n.replace(/\//g, "-")).trim().toLowerCase()]));
          el.remove();
          return out;
        },
        { brand, mode, names: colorNames },
      );
      for (const n of colorNames) expect(full(nativeValue(colors[brand][mode], n) as string), `${brand}/${mode}/${n}`).toBe(full(css[n]));
    }
  }
});

test("createTheme picks brand, mode and density", () => {
  const t = createTheme();
  expect(t.colors.bg.brand).toBe(t.palette.role.solid);
  expect(t.radius.control).toBe(8);
  expect(t.size.controlMd).toBe(40);
  const a = createTheme({ brand: "amber", mode: "dark", density: "compact" });
  expect(a.isDark).toBe(true);
  expect(a.radius.control).toBe(9999); // Amber controls are pills
  expect(a.size.controlMd).toBe(32); // Compact
  expect(a.fonts.heading).toBe("Poppins");
  expect(createTheme({ reducedMotion: true }).motion.duration.fast).toBe(0);
});
