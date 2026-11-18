#!/usr/bin/env node
// Builds React Native (and any non-CSS runtime) tokens from the Figma export in /figma.
//   node scripts/build-native.mjs
// Output (committed): dist/tokens.native.ts
//   Every alias resolved to a literal value: colors as hex strings, sizes as numbers (dp).
//   No React Native import, so it works in bare RN, Expo, or plain TypeScript.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const vars = read("figma/variables.raw.json");
const { textStyles, effectStyles } = read("figma/styles-components.raw.json");

const BRANDS = ["default", "violet", "amber"];
const THEMES = ["light", "dark", "light-hc", "dark-hc"];
const DENSITIES = ["comfortable", "compact"];
const TYPE_MODES = { desktop: 0, tablet: 1, mobile: 2 };
const LAYOUT_MODES = { desktop: 0, tablet: 1, mobile: 2, wide: 3 };

// ---------- index: variable name → { collection, values[] }
const byName = new Map();
for (const c of vars) for (const [n, t, vals] of c.v) byName.set(n, { c: c.n, t, vals });

// Which mode of each collection a context uses
const modeIndex = (collection, ctx) =>
  ({
    Brand: BRANDS.indexOf(ctx.brand),
    Color: THEMES.indexOf(ctx.theme),
    Dimension: DENSITIES.indexOf(ctx.density),
    Typography: TYPE_MODES[ctx.typography ?? "mobile"],
    Motion: ctx.reducedMotion ? 1 : 0,
    Layout: LAYOUT_MODES[ctx.layout ?? "mobile"],
  })[collection] ?? 0;

const resolve = (name, ctx, seen = new Set()) => {
  const v = byName.get(name);
  if (!v) throw new Error(`Unknown variable ${name}`);
  if (seen.has(name)) throw new Error(`Alias cycle at ${name}`);
  seen.add(name);
  const raw = v.vals[Math.max(0, modeIndex(v.c, ctx))] ?? v.vals[0];
  return typeof raw === "string" && raw.startsWith("@") ? resolve(raw.slice(1), ctx, seen) : raw;
};

// ---------- helpers
const camel = (s) => s.replace(/-([a-z0-9])/g, (_, ch) => ch.toUpperCase());
const key = (s) => (/^\d+-5$/.test(s) ? s.replace("-5", ".5") : camel(s)); // spacing/0-5 → "0.5"
const setPath = (obj, parts, val) => {
  let o = obj;
  for (const p of parts.slice(0, -1)) o = o[p] ??= {};
  o[parts[parts.length - 1]] = val;
};
const names = (collection, prefix = "") => vars.find((c) => c.n === collection).v.map(([n]) => n).filter((n) => n.startsWith(prefix));
const tree = (list, strip, ctx, map = (v) => v) => {
  const out = {};
  for (const n of list) setPath(out, n.slice(strip.length).split("/").map(key), map(resolve(n, ctx), n));
  return out;
};
const hex = (v) => (typeof v === "string" ? v.toLowerCase() : v);
const weightOf = { Regular: "400", Medium: "500", "Semi Bold": "600", SemiBold: "600", Bold: "700" };
const round = (n) => Math.round(n * 100) / 100;
const parseHex = (h) => {
  const m = h.replace("#", "");
  const a = m.length === 8 ? parseInt(m.slice(6, 8), 16) / 255 : 1;
  return { rgb: `#${m.slice(0, 6)}`, alpha: round(a) };
};

// ---------- colors: brand × theme
const colorNames = names("Color");
const colors = {};
for (const brand of BRANDS) {
  colors[brand] = {};
  for (const theme of THEMES) colors[brand][theme] = tree(colorNames, "color/", { brand, theme }, hex);
}

// ---------- brand palette (ramps, roles, fonts, shape) — independent of theme
const palette = {};
for (const brand of BRANDS) {
  const ctx = { brand, theme: "light", density: "comfortable" };
  palette[brand] = {
    primary: tree(names("Brand", "brand/primary/"), "brand/primary/", ctx, hex),
    accent: tree(names("Brand", "brand/accent/"), "brand/accent/", ctx, hex),
    neutral: tree(names("Brand", "brand/neutral/"), "brand/neutral/", ctx, hex),
    role: tree(names("Brand", "brand/role/"), "brand/role/", ctx, hex),
  };
}

// ---------- fonts per brand (family names as published; load them with expo-font or react-native-asset)
const fonts = {};
for (const brand of BRANDS) {
  const ctx = { brand };
  fonts[brand] = {
    heading: resolve("font-family/heading", ctx),
    body: resolve("font-family/body", ctx),
    mono: resolve("font-family/mono", ctx),
  };
}

// ---------- density: spacing, radius, sizes (numbers, dp)
const dims = {};
for (const density of DENSITIES) {
  const ctx = { brand: "default", density };
  const t = tree(names("Dimension"), "", ctx);
  const { radius, spacing, size, padding, gap, borderWidth } = t;
  radius.full = 9999;
  dims[density] = { spacing, radius, borderWidth, size, padding, gap };
}
// shape radius depends on brand (amber is pill-shaped) and density
const shape = {};
for (const brand of BRANDS) {
  shape[brand] = {};
  for (const density of DENSITIES) {
    const ctx = { brand, density };
    shape[brand][density] = { control: resolve("shape/radius-control", ctx), container: resolve("shape/radius-container", ctx) };
  }
}

// ---------- typography: text styles per brand, mobile and tablet sizes
const textStyleKey = (n) => n.split("/").map((p, i) => (i === 0 ? camel(p.toLowerCase()) : camel(p.toLowerCase().replace(/\s+/g, "-")))).join(".");
const typography = {};
for (const brand of BRANDS) {
  typography[brand] = {};
  for (const size of ["mobile", "tablet"]) {
    const ctx = { brand, typography: size };
    const out = {};
    for (const t of textStyles) {
      const b = t.bv;
      const style = {
        fontFamily: b.fontFamily ? resolve(b.fontFamily, ctx) : t.f,
        fontWeight: b.fontStyle ? weightOf[resolve(b.fontStyle, ctx)] ?? "400" : weightOf[t.w] ?? "400",
        fontSize: b.fontSize ? resolve(b.fontSize, ctx) : t.s,
        lineHeight: b.lineHeight ? resolve(b.lineHeight, ctx) : t.lh,
      };
      const ls = b.letterSpacing ? resolve(b.letterSpacing, ctx) : t.ls;
      if (ls) style.letterSpacing = round(ls);
      setPath(out, textStyleKey(t.n).split("."), style);
    }
    typography[brand][size] = out;
  }
}

// ---------- elevation per brand × theme: RN 0.76+ boxShadow string, plus legacy iOS/Android props
const elevation = {};
for (const brand of BRANDS) {
  elevation[brand] = {};
  for (const theme of THEMES) {
    const ctx = { brand, theme };
    const out = {};
    effectStyles.forEach((e, i) => {
      const layers = e.e.map((s) => ({ ...s, color: hex(resolve(s.c, ctx)) }));
      const boxShadow = [...layers].reverse().map((s) => `${s.x || 0}px ${s.y || 0}px ${s.r || 0}px ${s.sp || 0}px ${s.color}`).join(", ");
      const strongest = layers.reduce((a, s) => ((s.r || 0) > (a.r || 0) ? s : a), layers[0]);
      const { rgb, alpha } = parseHex(strongest.color);
      out[key(e.n.split("/").pop().toLowerCase().replace(/\s+/g, "-"))] = {
        boxShadow,
        shadowColor: rgb,
        shadowOpacity: alpha,
        shadowOffset: { width: strongest.x || 0, height: strongest.y || 0 },
        shadowRadius: round((strongest.r || 0) / 2),
        elevation: Math.min(24, Math.round((strongest.r || 0) / 2) + i),
      };
    });
    elevation[brand][theme] = out;
  }
}

// ---------- component tokens per brand × theme × density
const component = {};
for (const brand of BRANDS) {
  component[brand] = {};
  for (const theme of THEMES) {
    component[brand][theme] = {};
    for (const density of DENSITIES) component[brand][theme][density] = tree(names("Component"), "", { brand, theme, density }, hex);
  }
}

// ---------- motion: durations in ms, easings as cubic-bezier control points, springs for Reanimated
const bezier = (s) => {
  const m = String(s).match(/cubic-bezier\(([^)]+)\)/);
  return m ? m[1].split(",").map((x) => Number(x.trim())) : [0, 0, 1, 1];
};
const motion = {};
for (const [mode, reducedMotion] of [["default", false], ["reduced", true]]) {
  const ctx = { reducedMotion };
  motion[mode] = {
    duration: tree(names("Motion", "duration/"), "duration/", ctx),
    easing: Object.fromEntries(["standard", "enter", "exit"].map((k) => [k, bezier(resolve(`easing/${k}`, ctx))])),
    spring: Object.fromEntries(
      ["snappy", "gentle", "bouncy"].map((k) => [
        k,
        { stiffness: resolve(`spring/${k}/stiffness`, ctx), damping: resolve(`spring/${k}/damping`, ctx), duration: resolve(`spring/${k}/duration`, ctx) },
      ]),
    ),
  };
}

// ---------- effects and layout
const opacity = Object.fromEntries(names("Effects", "opacity/").map((n) => [key(n.split("/")[1]), resolve(n, {}) / 100]));
const zIndex = Object.fromEntries(names("Effects", "z/").map((n) => [key(n.split("/")[1]), resolve(n, {})]));
const layout = {};
for (const l of ["mobile", "tablet"]) layout[l] = tree(names("Layout"), "layout/", { layout: l });

// ---------- write
const json = (v) => JSON.stringify(v, null, 2);
const ts = `// DX Design System — React Native tokens. Generated by scripts/build-native.mjs from the Figma export. Do not edit by hand.
// Every alias is resolved: colors are hex strings (#rrggbb or #rrggbbaa), sizes are numbers in dp.
// Usage:
//   import { createTheme } from "./tokens.native";
//   const theme = createTheme({ brand: "default", mode: useColorScheme() === "dark" ? "dark" : "light" });
//   <View style={{ backgroundColor: theme.colors.bg.surface, padding: theme.spacing[4], borderRadius: theme.radius.container }} />

export const brands = ${json(BRANDS)} as const;
export const modes = ${json(THEMES)} as const;
export const densities = ${json(DENSITIES)} as const;
export type Brand = (typeof brands)[number];
export type Mode = (typeof modes)[number];
export type Density = (typeof densities)[number];

/** Semantic colors, resolved for every brand × color mode. */
export const colors = ${json(colors)} as const;

/** Brand ramps (50–950) and roles — the Brand tier. */
export const palette = ${json(palette)} as const;

/** Font family names per brand. Load the font files in your app (expo-font / @expo-google-fonts or react-native-asset). */
export const fonts = ${json(fonts)} as const;

/** Spacing, radius, sizes and padding per density (dp). */
export const dimensions = ${json(dims)} as const;

/** Control and container radius per brand × density. */
export const shape = ${json(shape)} as const;

/** Text styles per brand, at phone (mobile) and tablet sizes. Same names as Figma (Heading/H1 → heading.h1). */
export const typography = ${json(typography)} as const;

/** Elevation per brand × mode: boxShadow for RN 0.76+ (New Architecture), shadow* / elevation for older versions. */
export const elevation = ${json(elevation)} as const;

/** Component tokens (Button, Field, Card) per brand × mode × density. */
export const component = ${json(component)} as const;

/** Durations (ms), easings (cubic-bezier control points, e.g. Easing.bezier(...easing.standard)) and springs (Reanimated withSpring). */
export const motion = ${json(motion)} as const;

export const opacity = ${json(opacity)} as const;
export const zIndex = ${json(zIndex)} as const;

/** Layout grid for phones and tablets. */
export const layout = ${json(layout)} as const;

export type ThemeOptions = { brand?: Brand; mode?: Mode; density?: Density; size?: "mobile" | "tablet"; reducedMotion?: boolean };

/** One flat theme object for the chosen brand, color mode and density. */
export function createTheme({ brand = "default", mode = "light", density = "comfortable", size = "mobile", reducedMotion = false }: ThemeOptions = {}) {
  const d = dimensions[density];
  return {
    brand,
    mode,
    density,
    isDark: mode === "dark" || mode === "dark-hc",
    colors: colors[brand][mode],
    palette: palette[brand],
    fonts: fonts[brand],
    spacing: d.spacing,
    radius: { ...d.radius, ...shape[brand][density] },
    borderWidth: d.borderWidth,
    size: d.size,
    padding: d.padding,
    gap: d.gap,
    typography: typography[brand][size],
    elevation: elevation[brand][mode],
    component: component[brand][mode][density],
    motion: motion[reducedMotion ? "reduced" : "default"],
    opacity,
    zIndex,
    layout: layout[size],
  };
}

export type DXTheme = ReturnType<typeof createTheme>;
`;
fs.writeFileSync(path.join(root, "dist/tokens.native.ts"), ts);
console.log(`✓ React Native tokens: ${BRANDS.length} brands × ${THEMES.length} modes × ${DENSITIES.length} densities → dist/tokens.native.ts`);
