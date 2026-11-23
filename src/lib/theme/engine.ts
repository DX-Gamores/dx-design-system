/* DX theme engine — turns a few brand choices (primary colour, accent, neutral, fonts, radius) into the 51 values of the
   Figma Brand collection, checks contrast in all four colour modes, and writes the brand out as CSS, DTCG JSON and React Native.
   Pure TypeScript with no imports, so the docs site (theme builder) and the build scripts (brand gallery, registry) share it.

   Colour model: OKLCH. A ramp keeps the seed's hue, puts the seed exactly on the step whose lightness is closest, and follows
   the lightness/chroma curve of the DX primitives for the other steps, reducing chroma until each step fits in sRGB. */

// ---------------------------------------------------------------- types
export type RawCollection = { n: string; m: string[]; v: [string, "C" | "F" | "S", (string | number)[]][] };
export type Neutral = "gray" | "slate" | "zinc" | "stone" | "neutral" | "tinted";
export type ThemeInput = {
  /** Display name, e.g. "Mangrove". The slug (data-brand value) is derived from it. */
  name: string;
  primary: string;
  /** A primitive ramp name (teal, indigo …) or a hex colour. */
  accent: string;
  neutral: Neutral;
  headingFont: string;
  bodyFont: string;
  radiusControl: RadiusName;
  radiusContainer: RadiusName;
  density: "comfortable" | "compact";
};
export type RadiusName = "none" | "sm" | "md" | "lg" | "xl" | "full";
export type Mode = "light" | "dark" | "light-hc" | "dark-hc";
export type PairKind = "text" | "ui";
export type AuditRow = { fg: string; bg: string; kind: PairKind; ratio: number; min: number; pass: boolean };
export type BrandResult = {
  slug: string;
  input: ThemeInput;
  /** Brand collection values: colours as hex, fonts as family names, radius in px. */
  values: Record<string, string | number>;
  ramps: { primary: string[]; accent: string[]; neutral: string[] };
  /** Which ramp step each role uses, and what the engine adjusted. */
  roles: { solid: number; onSolid: "white" | "dark"; solidHc: number; focus: number };
  notes: string[];
  audit: Record<Mode, AuditRow[]>;
  passed: number;
  total: number;
};

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export const MODES: Mode[] = ["light", "dark", "light-hc", "dark-hc"];
export const RADII: Record<RadiusName, number> = { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: 9999 };
/** Open-source families the builder offers (self-hosted with Fontsource). Package name = @fontsource/<id>. */
export const FONTS: { family: string; id: string }[] = [
  { family: "Inter", id: "inter" }, { family: "Manrope", id: "manrope" }, { family: "Poppins", id: "poppins" },
  { family: "DM Sans", id: "dm-sans" }, { family: "Figtree", id: "figtree" }, { family: "IBM Plex Sans", id: "ibm-plex-sans" },
  { family: "Nunito Sans", id: "nunito-sans" }, { family: "Plus Jakarta Sans", id: "plus-jakarta-sans" },
  { family: "Source Sans 3", id: "source-sans-3" }, { family: "Work Sans", id: "work-sans" },
];
export const ACCENTS = ["teal", "cyan", "sky", "indigo", "violet", "purple", "fuchsia", "pink", "rose", "orange", "amber", "lime", "emerald"];
export const NEUTRALS: Neutral[] = ["gray", "slate", "zinc", "stone", "neutral", "tinted"];

/** The 27 pairs the DX contrast audit checks (Foundations → Contrast): what people read and what they need to see to operate. */
export const PAIRS: [string, string, PairKind][] = [
  ["text/primary", "bg/surface", "text"], ["text/secondary", "bg/surface", "text"], ["text/secondary", "bg/canvas", "text"],
  ["text/secondary", "bg/surface-subtle", "text"], ["text/placeholder", "bg/surface", "text"], ["text/brand", "bg/surface", "text"],
  ["text/brand", "bg/brand-subtle", "text"], ["text/on-brand", "bg/brand", "text"], ["text/on-brand", "bg/brand-hover", "text"],
  ["text/danger", "bg/surface", "text"], ["text/danger", "bg/danger-subtle", "text"], ["text/success", "bg/surface", "text"],
  ["text/success", "bg/success-subtle", "text"], ["text/warning", "bg/surface", "text"], ["text/warning", "bg/warning-subtle", "text"],
  ["text/info", "bg/info-subtle", "text"], ["text/on-color", "bg/danger", "text"], ["text/on-warning", "bg/warning", "text"],
  ["text/inverse", "bg/inverse", "text"],
  ["border/strong", "bg/surface", "ui"], ["border/focus", "bg/surface", "ui"], ["border/focus", "bg/canvas", "ui"],
  ["icon/secondary", "bg/surface", "ui"], ["icon/brand", "bg/surface", "ui"], ["border/danger", "bg/surface", "ui"],
  ["bg/control-off", "bg/surface", "ui"], ["border/selected", "bg/surface", "ui"],
];
/** Text ≥ 4.5:1 and UI ≥ 3:1; in the high-contrast modes text ≥ 7:1 and UI ≥ 4.5:1. */
export const minContrast = (kind: PairKind, mode: Mode) => (mode.endsWith("hc") ? (kind === "text" ? 7 : 4.5) : kind === "text" ? 4.5 : 3);

// ---------------------------------------------------------------- colour math
type RGB = [number, number, number];
type OKLCH = [number, number, number];
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export function hexToRgb(hex: string): RGB {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h.slice(0, 6), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
export const rgbToHex = (rgb: RGB) => "#" + rgb.map((c) => Math.round(clamp01(c) * 255).toString(16).padStart(2, "0")).join("");
export const isHex = (s: string) => /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s.trim());
const toLin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGam = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function rgbToOklch([R, G, B]: RGB): OKLCH {
  const r = toLin(R), g = toLin(G), b = toLin(B);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(a, bb);
  const H = ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
  return [L, C, H];
}
function oklchToRgbRaw([L, C, H]: OKLCH): RGB {
  const a = C * Math.cos((H * Math.PI) / 180), b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    toGam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toGam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toGam(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}
const inGamut = (rgb: RGB) => rgb.every((c) => c >= -0.0005 && c <= 1.0005);
/** OKLCH → hex, lowering chroma (keeping lightness and hue) until it fits in sRGB. */
export function oklchToHex([L, C, H]: OKLCH): string {
  if (inGamut(oklchToRgbRaw([L, C, H]))) return rgbToHex(oklchToRgbRaw([L, C, H]));
  let lo = 0, hi = C;
  for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (inGamut(oklchToRgbRaw([L, mid, H]))) lo = mid; else hi = mid; }
  return rgbToHex(oklchToRgbRaw([L, lo, H]));
}

const lum = (rgb: RGB) => { const [r, g, b] = rgb.map(toLin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
/** WCAG 2.x contrast ratio of two opaque colours. */
export function contrast(a: string, b: string) {
  const [x, y] = [lum(hexToRgb(a)), lum(hexToRgb(b))].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
/** A colour with alpha (#rrggbbaa) composited on an opaque background. */
function over(fg: string, bg: string) {
  const h = fg.replace("#", "");
  if (h.length !== 8) return fg;
  const a = parseInt(h.slice(6), 16) / 255, f = hexToRgb(h.slice(0, 6)), g = hexToRgb(bg);
  return rgbToHex(f.map((c, i) => c * a + g[i] * (1 - a)) as RGB);
}

// ---------------------------------------------------------------- ramps
// Lightness and relative chroma of a DX colour ramp (OKLCH), 50 → 950.
const RAMP_L = [0.97, 0.932, 0.882, 0.809, 0.707, 0.623, 0.546, 0.488, 0.424, 0.379, 0.282];
const RAMP_C = [0.06, 0.13, 0.24, 0.43, 0.67, 0.87, 1, 0.99, 0.81, 0.6, 0.37];
const NEUTRAL_L = [0.985, 0.967, 0.928, 0.872, 0.707, 0.551, 0.446, 0.373, 0.278, 0.21, 0.13];

/** An 11-step ramp (50 … 950) that contains the seed colour exactly, on the step with the closest lightness
 *  (or on `at`). The other steps keep the DX lightness curve, so contrast pairs behave like the built-in brands. */
export function ramp(seed: string, at?: number): { steps: string[]; seedIndex: number } {
  const [L0, C0, H0] = rgbToOklch(hexToRgb(seed));
  let k = 0;
  RAMP_L.forEach((l, i) => { if (Math.abs(l - L0) < Math.abs(RAMP_L[k] - L0)) k = i; });
  if (at !== undefined) k = at;
  const steps = RAMP_L.map((l, i) => {
    if (i === k) return rgbToHex(hexToRgb(seed));
    // keep the ramp in order around the seed
    const L = i < k ? Math.max(l, L0 + 0.02 * (k - i)) : Math.min(l, L0 - 0.02 * (i - k));
    const C = C0 < 0.02 ? C0 : (C0 * RAMP_C[i]) / Math.max(RAMP_C[k], 0.5);
    return oklchToHex([Math.min(0.985, Math.max(0.15, L)), C, H0]);
  });
  return { steps, seedIndex: k };
}
/** The two steps whose lightness is closest to the seed's, nearest first. */
export function seedCandidates(seed: string): number[] {
  const L0 = rgbToOklch(hexToRgb(seed))[0];
  return RAMP_L.map((l, i) => [Math.abs(l - L0), i]).sort((a, b) => a[0] - b[0]).slice(0, 2).map(([, i]) => i);
}
/** A near-grey ramp tinted with a hue (for "tinted" neutrals). */
export function tintedNeutral(hue: number): string[] {
  return NEUTRAL_L.map((L, i) => oklchToHex([L, 0.012 * Math.min(1, RAMP_C[i] + 0.3), hue]));
}

// ---------------------------------------------------------------- variables
export type Vars = RawCollection[];
const col = (vars: Vars, name: string) => vars.find((c) => c.n === name)!;
const primitive = (vars: Vars, name: string) => String(col(vars, "Primitives").v.find(([n]) => n === name)?.[2][0] ?? "");
const primitiveRamp = (vars: Vars, family: string) => STEPS.map((s) => primitive(vars, `color/${family}/${s}`).slice(0, 7));
export const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "brand";

const fontStack = (family: string, mono = false) =>
  `"${family}", ${mono ? "ui-monospace, SFMono-Regular, Menlo, monospace" : "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"}`;

/** Build a brand: ramps, roles (with automatic contrast fixes), Brand-collection values and the 27 × 4 contrast audit. */
export function buildBrand(vars: Vars, input: ThemeInput): BrandResult {
  // Try the seed on its nearest step and on the next nearest; keep whichever passes more of the audit (nearest wins a tie).
  const seed = isHex(input.primary) ? input.primary : "#2563eb";
  const tries = seedCandidates(seed).map((at) => buildBrandAt(vars, input, seed, at));
  return tries.reduce((best, t) => (t.passed > best.passed ? t : best));
}

function buildBrandAt(vars: Vars, input: ThemeInput, seed: string, at: number): BrandResult {
  const notes: string[] = [];
  const primary = ramp(seed, at);
  const accent = isHex(input.accent) ? ramp(input.accent).steps : primitiveRamp(vars, ACCENTS.includes(input.accent) ? input.accent : "teal");
  const neutral = input.neutral === "tinted" ? tintedNeutral(rgbToOklch(hexToRgb(primary.steps[6]))[2]) : primitiveRamp(vars, input.neutral);
  const P = primary.steps, N = neutral;
  const white = "#ffffff", dark = N[10];

  // Solid fill (buttons, selected): the seed's step if it reads with white or dark text, otherwise the nearest step that does.
  let solid = Math.min(Math.max(primary.seedIndex, 2), 10);
  let onSolid: "white" | "dark";
  if (contrast(white, P[solid]) >= 4.5) onSolid = "white";
  else if (contrast(dark, P[solid]) >= 4.5 && contrast(dark, P[Math.min(solid + 1, 10)]) >= 4.5) {
    onSolid = "dark";
    notes.push(`White text on ${STEPS[solid]} is ${contrast(white, P[solid]).toFixed(1)}:1, so text on the brand colour is dark (like the Amber brand).`);
  } else {
    while (solid < 9 && contrast(white, P[solid]) < 4.5) solid++;
    onSolid = "white";
    notes.push(`The seed colour is too light for white text and too dark for dark text, so buttons use step ${STEPS[solid]}.`);
  }
  const on = onSolid === "white" ? white : dark;
  // Hover/pressed one and two steps darker; if that breaks contrast for dark text, stay on the lighter side.
  // Hover/pressed one and two steps darker (lighter for a very dark brand colour).
  const dir = solid >= 9 ? -1 : 1;
  const hover = solid + dir, pressed = solid + 2 * dir;
  // High contrast: ≥ 7:1 with the same text colour.
  let solidHc = solid;
  if (onSolid === "white") { while (solidHc < 10 && contrast(white, P[solidHc]) < 7) solidHc++; }
  else { while (solidHc > 0 && contrast(dark, P[solidHc]) < 7) solidHc--; }
  if (contrast(on, P[solidHc]) < 7) notes.push(`No step of this colour reaches 7:1 with ${onSolid} text in the high-contrast modes.`);
  const hcHover = onSolid === "white" ? (solidHc >= 10 ? solidHc - 1 : solidHc + 1) : Math.max(solidHc - 1, 0);
  // Focus ring: ≥ 3:1 on white (light mode); darker steps until it is.
  let focus = solid;
  while (focus < 10 && Math.min(contrast(P[focus], white), contrast(P[focus], N[0])) < 3) focus++;
  if (focus !== solid) notes.push(`The focus ring uses step ${STEPS[focus]} so it stands out 3:1 on white and on the page background.`);

  const values: Record<string, string | number> = {};
  STEPS.forEach((s, i) => {
    values[`brand/primary/${s}`] = P[i];
    values[`brand/accent/${s}`] = accent[i];
    values[`brand/neutral/${s}`] = N[i];
  });
  Object.assign(values, {
    "brand/role/solid": P[solid], "brand/role/solid-hover": P[hover], "brand/role/solid-pressed": P[pressed], "brand/role/on-solid": on,
    "brand/role/solid-hc": P[solidHc], "brand/role/solid-hc-hover": P[hcHover], "brand/role/on-solid-hc": on, "brand/role/focus": P[focus],
    "font-family/heading": input.headingFont, "font-family/body": input.bodyFont, "font-family/mono": "Roboto Mono",
    "font-style/heading-semibold": 600, "font-style/heading-bold": 700, "font-style/body-regular": 400, "font-style/body-medium": 500, "font-style/mono-regular": 400,
    "shape/radius-control": RADII[input.radiusControl], "shape/radius-container": RADII[input.radiusContainer],
  });

  const audit = {} as Record<Mode, AuditRow[]>;
  let passed = 0, total = 0;
  MODES.forEach((mode) => {
    const c = semanticColors(vars, values, mode);
    audit[mode] = PAIRS.map(([fg, bg, kind]) => {
      const b = c[bg], f = over(c[fg], b);
      const ratio = Math.round(contrast(f, b) * 100) / 100, min = minContrast(kind, mode);
      total++; if (ratio >= min) passed++;
      return { fg, bg, kind, ratio, min, pass: ratio >= min };
    });
  });
  return { slug: slugify(input.name), input, values, ramps: { primary: P, accent, neutral: N }, roles: { solid: STEPS[solid], onSolid, solidHc: STEPS[solidHc], focus: STEPS[focus] }, notes, audit, passed, total };
}

/** Every semantic colour (color/… without the prefix) resolved to hex for one mode, using this brand. */
export function semanticColors(vars: Vars, brand: Record<string, string | number>, mode: Mode): Record<string, string> {
  const color = col(vars, "Color"), mi = MODES.indexOf(mode);
  const colorVals = new Map(color.v.map(([n, , vals]) => [n, vals[mi] ?? vals[0]]));
  const resolve = (name: string, depth = 0): string => {
    if (depth > 8) throw new Error(`Alias loop at ${name}`);
    const v = name in brand ? brand[name] : colorVals.has(name) ? colorVals.get(name)! : primitive(vars, name);
    return typeof v === "string" && v.startsWith("@") ? resolve(v.slice(1), depth + 1) : String(v).toLowerCase();
  };
  const out: Record<string, string> = {};
  for (const [n] of color.v) out[n.replace(/^color\//, "")] = resolve(n);
  return out;
}

// ---------------------------------------------------------------- outputs
const cssName = (n: string) => `--ds-${n.replace(/^font-style\//, "font-weight/").replace(/\//g, "-").toLowerCase()}`;
const cssValue = (n: string, v: string | number) =>
  n.startsWith("font-family/") ? fontStack(String(v), n.endsWith("mono")) : n.startsWith("shape/") ? (v === 9999 ? "9999px" : `${v}px`) : String(v);

/** The brand as a CSS block: <html data-brand="slug"> switches every DX token to it. */
export function toCss(b: BrandResult) {
  const lines = Object.entries(b.values).map(([n, v]) => `  ${cssName(n)}: ${cssValue(n, v)};`);
  // :root[data-brand] outranks the default brand's :root block wherever this file is imported.
  return `/* DX brand “${b.input.name}” — made with the DX theme builder. Use: <html data-brand="${b.slug}" data-density="${b.input.density}"> */\n:root[data-brand="${b.slug}"], [data-brand="${b.slug}"] {\n${lines.join("\n")}\n}\n`;
}
/** Inline style object for a live preview (same variables as toCss). */
export function toStyle(b: BrandResult): Record<string, string> {
  return Object.fromEntries(Object.entries(b.values).map(([n, v]) => [cssName(n), cssValue(n, v)]));
}

/** DTCG (W3C Design Tokens) JSON with the Figma Brand-collection names, so it also imports into Figma with a variables plugin. */
export function toDtcg(b: BrandResult) {
  const root: Record<string, unknown> = {};
  for (const [n, v] of Object.entries(b.values)) {
    const parts = n.split("/");
    let o = root as Record<string, Record<string, unknown>>;
    for (const p of parts.slice(0, -1)) o = (o[p] ??= {}) as Record<string, Record<string, unknown>>;
    const type = n.startsWith("font-family/") ? "fontFamily" : n.startsWith("font-style/") ? "fontWeight" : n.startsWith("shape/") ? "dimension" : "color";
    o[parts[parts.length - 1]] = { $type: type, $value: type === "dimension" ? `${v}px` : v };
  }
  return JSON.stringify({ $description: `DX brand “${b.input.name}” (data-brand="${b.slug}") — Figma collection: Brand, mode: ${b.input.name}`, ...root, $extensions: { "ph.dxform.theme-builder": { input: b.input } } }, null, 2) + "\n";
}

/** React Native: palette, fonts, shape and the semantic colours for each mode, all resolved. Merge into createTheme(). */
export function toNative(vars: Vars, b: BrandResult) {
  const pick = (prefix: string) => Object.fromEntries(STEPS.map((s) => [s, b.values[`brand/${prefix}/${s}`]]));
  const tree = (flat: Record<string, string>) => {
    const out: Record<string, Record<string, string>> = {};
    for (const [k, v] of Object.entries(flat)) { const [g, ...rest] = k.split("/"); (out[g] ??= {})[rest.join("/").replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())] = v; }
    return out;
  };
  const data = {
    name: b.input.name,
    slug: b.slug,
    palette: { primary: pick("primary"), accent: pick("accent"), neutral: pick("neutral") },
    fonts: { heading: b.input.headingFont, body: b.input.bodyFont, mono: "Roboto Mono" },
    shape: { control: RADII[b.input.radiusControl], container: RADII[b.input.radiusContainer] },
    colors: Object.fromEntries(MODES.map((m) => [m, tree(semanticColors(vars, b.values, m))])),
  };
  const id = b.slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  return `// DX brand “${b.input.name}” for React Native — made with the DX theme builder.
//   import { createTheme } from "<path to>/tokens.native";   (the DX React Native tokens)
//   import { ${id} } from "<path to>/dx-brand-${b.slug}";
//   const base = createTheme({ mode });
//   const theme = { ...base, colors: ${id}.colors[mode], palette: ${id}.palette, fonts: ${id}.fonts, radius: { ...base.radius, ...${id}.shape } };
export const ${id} = ${JSON.stringify(data, null, 2)} as const;
`;
}

/** Fontsource packages a brand needs (heading + body, deduplicated). */
export const fontPackages = (input: ThemeInput) =>
  [...new Set([input.headingFont, input.bodyFont])].map((f) => FONTS.find((x) => x.family === f)?.id).filter((x): x is string => !!x);

// ---------------------------------------------------------------- share links
const KEYS: [keyof ThemeInput, string][] = [["name", "n"], ["primary", "p"], ["accent", "a"], ["neutral", "u"], ["headingFont", "h"], ["bodyFont", "b"], ["radiusControl", "rc"], ["radiusContainer", "rk"], ["density", "d"]];
export const encodeInput = (i: ThemeInput) => new URLSearchParams(KEYS.map(([k, s]) => [s, String(i[k]).replace(/^#/, "")])).toString();
export function decodeInput(q: string, fallback: ThemeInput): ThemeInput {
  const p = new URLSearchParams(q.replace(/^[#?]/, ""));
  const out = { ...fallback } as Record<string, string>;
  for (const [k, s] of KEYS) { const v = p.get(s); if (v) out[k] = (k === "primary" || (k === "accent" && isHex(v))) && !v.startsWith("#") ? `#${v}` : v; }
  const r = out as unknown as ThemeInput;
  if (!isHex(r.primary)) r.primary = fallback.primary;
  if (!NEUTRALS.includes(r.neutral)) r.neutral = fallback.neutral;
  if (!(r.radiusControl in RADII)) r.radiusControl = fallback.radiusControl;
  if (!(r.radiusContainer in RADII)) r.radiusContainer = fallback.radiusContainer;
  if (!FONTS.some((f) => f.family === r.headingFont)) r.headingFont = fallback.headingFont;
  if (!FONTS.some((f) => f.family === r.bodyFont)) r.bodyFont = fallback.bodyFont;
  if (r.density !== "compact") r.density = "comfortable";
  return r;
}
