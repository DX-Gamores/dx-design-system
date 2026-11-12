// Foundations data for the docs site, parsed from the Figma exports at build time.
// figma/variables.raw.json = [{ n: collection, m: modes[], v: [name, type, values[]][] }]
import fs from "node:fs";
import path from "node:path";

type Raw = { n: string; m: string[]; v: [string, string, unknown[]][] };
const raw: Raw[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), "figma/variables.raw.json"), "utf8"));
const styles = JSON.parse(fs.readFileSync(path.join(process.cwd(), "figma/styles-components.raw.json"), "utf8"));
const col = (n: string) => raw.find((c) => c.n === n)!;

export const cssVar = (name: string) => `--ds-${name.replace(/\//g, "-")}`;

/** Tailwind class for a semantic colour token (same mapping as dist/tailwind.css). */
export function twClass(name: string) {
  const [, cat, ...rest] = name.split("/");
  const r = rest.join("-");
  if (cat === "bg") return `bg-${r}`;
  if (cat === "text") return `text-fg-${r}`;
  if (cat === "border") return `border-line-${r}`;
  if (cat === "icon") return `text-icon-${r}`;
  if (cat === "dataviz") return `bg-viz-${r}`;
  if (cat === "category") return `bg-cat-${r}`;
  return "";
}

export type ColorToken = { name: string; css: string; tw: string; modes: string[] };
const aliasName = (v: unknown) => (typeof v === "string" && v.startsWith("@") ? v.slice(1) : String(v));

export function colorGroups() {
  const c = col("Color");
  const groups: Record<string, ColorToken[]> = {};
  for (const [name, , values] of c.v) {
    const cat = name.split("/")[1];
    (groups[cat] ??= []).push({ name, css: cssVar(name), tw: twClass(name), modes: values.map(aliasName) });
  }
  return { modes: c.m, groups };
}

/** 22 colour ramps (11 steps each) plus white/black, with hex values. */
export function palette() {
  const ramps: Record<string, { step: string; hex: string; css: string }[]> = {};
  for (const [name, type, values] of col("Primitives").v) {
    if (type !== "C") continue;
    const [, ramp, step] = name.split("/");
    if (!step || ramp.endsWith("-alpha")) continue;
    (ramps[ramp] ??= []).push({ step, hex: String(values[0]), css: cssVar(name) });
  }
  const order = ["slate", "gray", "zinc", "neutral", "stone", "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"];
  return order.filter((r) => ramps[r]).map((r) => ({ ramp: r, steps: ramps[r] }));
}

/** Which ramp each brand uses for primary (from the Brand collection). */
export function brandRamps() {
  const b = col("Brand");
  const primary = b.v.find(([n]) => n === "brand/primary/600");
  const neutral = b.v.find(([n]) => n === "brand/neutral/600");
  return b.m.map((mode, i) => ({
    mode,
    primary: aliasName(primary?.[2][i]).split("/")[1],
    neutral: aliasName(neutral?.[2][i]).split("/")[1],
  }));
}

export type TextStyle = { name: string; cls: string; size: number; lh: number; weight: string; family: string };
export function textStyles(): TextStyle[] {
  const order = ["Display/2XLarge", "Display/XLarge", "Display/Large", "Heading/H1", "Heading/H2", "Heading/H3", "Heading/H4", "Body/Large", "Body/Medium", "Label/Large", "Body/Small", "Code/Medium", "Label/Medium", "Caption/Default", "Code/Small", "Label/Small"];
  const list: { n: string; s: number; lh: number; w: string; f: string }[] = styles.textStyles;
  return order
    .map((n) => list.find((s) => s.n === n))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .map((s) => ({ name: s.n, cls: "text-" + s.n.toLowerCase().replace("/", "-"), size: s.s, lh: s.lh, weight: s.w, family: s.f }));
}

const dims = () => col("Dimension");
export function spacing() {
  return dims().v.filter(([n]) => n.startsWith("spacing/") && n !== "spacing/0").map(([n, , v]) => ({ name: n, css: cssVar(n), comfortable: Number(v[0]), compact: Number(v[1]) }));
}
export function radii() {
  return dims().v.filter(([n]) => n.startsWith("radius/")).map(([n, , v]) => ({ name: n, css: cssVar(n), px: Number(v[0]) }));
}
export function sizes() {
  return dims().v.filter(([n]) => /^(size|padding|gap)\//.test(n)).map(([n, , v]) => ({ name: n, css: cssVar(n), comfortable: Number(v[0]), compact: Number(v[1]) }));
}
export function effects() {
  const e: { n: string; e: { x: number; y: number; r: number; sp: number; c: string }[] }[] = styles.effectStyles;
  const z = col("Effects").v.filter(([n]) => n.startsWith("z/")).map(([n, , v]) => ({ name: n, css: cssVar(n), value: Number(v[0]) }));
  return { shadows: e.filter((s) => s.n.startsWith("Elevation")), z };
}
export function motion() {
  const m = col("Motion");
  const get = (n: string) => m.v.find(([x]) => x === n)?.[2] ?? [];
  const durations = m.v.filter(([n]) => n.startsWith("duration/")).map(([n, , v]) => ({ name: n, css: cssVar(n), ms: Number(v[0]) }));
  const easings = m.v.filter(([n]) => /^easing\/(standard|enter|exit)$/.test(n)).map(([n, , v]) => ({ name: n, css: cssVar(n), value: String(v[0]) }));
  const springs = ["snappy", "gentle", "bouncy"].map((s) => ({
    name: `easing/spring-${s}`,
    css: cssVar(`easing/spring-${s}`),
    stiffness: Number(get(`spring/${s}/stiffness`)[0]),
    damping: Number(get(`spring/${s}/damping`)[0]),
    ms: Number(get(`spring/${s}/duration`)[0]),
    value: String(get(`easing/spring-${s}`)[0]),
  }));
  return { durations, easings, springs };
}
export function layouts() {
  const l = col("Layout");
  return l.m.map((mode, i) => {
    const o: Record<string, number> = {};
    for (const [n, , v] of l.v) o[n.split("/")[1]] = Number(v[i]);
    return { mode, ...o } as { mode: string } & Record<string, number>;
  });
}
export const collectionsSummary = () => raw.map((c) => ({ name: c.n, count: c.v.length, modes: c.m }));
