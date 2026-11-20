// Every Figma variable as a row for the token explorer, with its value resolved for each brand × color mode.
import fs from "node:fs";
import path from "node:path";
import { rnPath } from "./token-paths";

type RawCollection = { n: string; m: string[]; v: [string, "C" | "F" | "S", (string | number)[]][] };
const root = process.cwd();
const vars: RawCollection[] = JSON.parse(fs.readFileSync(path.join(root, "figma/variables.raw.json"), "utf8"));
const tw = fs.readFileSync(path.join(root, "dist/tailwind.css"), "utf8");

export const BRANDS = ["default", "violet", "amber"] as const;
export const MODES = ["light", "dark", "light-hc", "dark-hc"] as const;
const tierOf: Record<string, string> = { Primitives: "Primitive", Brand: "Brand", Color: "Semantic", Component: "Component" };

const byName = new Map<string, { c: string; vals: (string | number)[] }>();
for (const c of vars) for (const [n, , vals] of c.v) byName.set(n, { c: c.n, vals });
const cssVar = (n: string) => `--ds-${n.replace(/\//g, "-").replace(/\s+/g, "-").toLowerCase()}`.replace(/^--ds-font-style-/, "--ds-font-weight-");

function resolve(name: string, brand: number, mode: number, depth = 0): string | number {
  const v = byName.get(name);
  if (!v || depth > 8) return "";
  const idx = v.c === "Brand" ? brand : v.c === "Color" ? mode : 0;
  const raw = v.vals[idx] ?? v.vals[0];
  return typeof raw === "string" && raw.startsWith("@") ? resolve(raw.slice(1), brand, mode, depth + 1) : raw;
}

// Tailwind utility for a CSS variable, from the @theme block in dist/tailwind.css.
const themeMap = new Map([...tw.matchAll(/^\s+--([\w-]+):\s*var\((--ds-[\w-]+)\);/gm)].map((m) => [m[2], m[1]]));
function tailwindOf(v: string, name: string): string | null {
  const key = themeMap.get(v);
  if (key?.startsWith("color-")) {
    const k = key.slice(6);
    if (name.startsWith("color/text/") || name.startsWith("color/icon/")) return `text-${k}`;
    if (name.startsWith("color/border/")) return `border-${k}`;
    return `bg-${k}`;
  }
  if (key?.startsWith("radius-")) return `rounded-${key.slice(7)}`;
  if (key?.startsWith("shadow-")) return `shadow-${key.slice(7)}`;
  if (key?.startsWith("font-")) return `font-${key.slice(5)}`;
  if (key?.startsWith("text-") && !key.includes("--")) return `text-${key.slice(5)}`;
  if (key?.startsWith("ease-")) return `ease-${key.slice(5)}`;
  let m;
  if ((m = v.match(/^--ds-size-control-(sm|md|lg)$/))) return `h-control-${m[1]}`;
  if ((m = v.match(/^--ds-spacing-(.+)$/))) return `p-${m[1].replace("-", ".")}`;
  if ((m = v.match(/^--ds-duration-(instant|fast|moderate|slow)$/))) return `duration-${m[1]}`;
  return null;
}

export type TokenRow = {
  name: string;
  collection: string;
  tier: string;
  type: "color" | "number" | "string";
  modes: string[];
  /** raw value per mode: "→ color/blue/600" for aliases */
  raw: string[];
  /** resolved value per [brand][mode] for Brand/Semantic/Component colors, otherwise one value */
  values: (string | number)[][];
  css: string;
  tailwind: string | null;
  rn: string | null;
};

export function tokenRows(): TokenRow[] {
  const rows: TokenRow[] = [];
  for (const c of vars) {
    for (const [n, t, vals] of c.v) {
      const css = cssVar(n);
      const themed = ["Brand", "Color", "Component"].includes(c.n);
      const values = themed
        ? BRANDS.map((_, b) => MODES.map((__, m) => resolve(n, b, m)))
        : [vals.map((x) => (typeof x === "string" && x.startsWith("@") ? resolve(x.slice(1), 0, 0) : x))];
      rows.push({
        name: n,
        collection: c.n,
        tier: tierOf[c.n] ?? "Foundation",
        type: t === "C" ? "color" : t === "F" ? "number" : "string",
        modes: c.m,
        raw: vals.map((x) => (typeof x === "string" && x.startsWith("@") ? `→ ${x.slice(1)}` : String(x))),
        values,
        css,
        tailwind: tailwindOf(css, n),
        rn: rnPath(css),
      });
    }
  }
  return rows;
}
