import fs from "node:fs";
import path from "node:path";
import type { ThemeInput, Vars } from "@/lib/theme/engine";
import galleryJson from "../../dist/brands/gallery.json";
import { palette, fonts } from "../../dist/tokens.native";

/* Server-side data for the theme builder and the brand gallery. */
export type GalleryBrand = { slug: string; name: string; input: ThemeInput; ramps: { primary: string[]; accent: string[]; neutral: string[] }; roles: { solid: number; onSolid: string; solidHc: number; focus: number }; notes: string[]; passed: number; total: number; fonts: string[]; comment: string };
export const gallery = galleryJson as GalleryBrand[];

/** The built-in brands, described as builder settings (the builder regenerates them, so values are close, not identical). */
export const builtInPresets: { label: string; input: ThemeInput }[] = [
  { label: "Default", input: { name: "Default", primary: "#2563eb", accent: "teal", neutral: "gray", headingFont: "Inter", bodyFont: "Inter", radiusControl: "md", radiusContainer: "lg", density: "comfortable" } },
  { label: "Violet", input: { name: "Violet", primary: "#7c3aed", accent: "pink", neutral: "gray", headingFont: "Manrope", bodyFont: "Manrope", radiusControl: "md", radiusContainer: "lg", density: "comfortable" } },
  { label: "Amber", input: { name: "Amber", primary: "#fbbf24", accent: "indigo", neutral: "stone", headingFont: "Poppins", bodyFont: "Poppins", radiusControl: "full", radiusContainer: "xl", density: "comfortable" } },
];
export const presets = () => [...gallery.map((g) => ({ label: `${g.name} (gallery)`, input: g.input })), ...builtInPresets];

/** Only the collections the engine reads (primitives and the four colour modes), to keep the page small. */
export function engineVars(): Vars {
  const all = JSON.parse(fs.readFileSync(path.join(process.cwd(), "figma/variables.raw.json"), "utf8")) as Vars;
  return all.filter((c) => c.n === "Primitives" || c.n === "Color");
}

/** The three built-in brands as they ship (exact ramps from the tokens). */
export const builtInBrands = (["default", "violet", "amber"] as const).map((slug) => ({
  slug,
  name: slug[0].toUpperCase() + slug.slice(1),
  font: fonts[slug].heading,
  ramps: { primary: Object.values(palette[slug].primary) as string[], accent: Object.values(palette[slug].accent) as string[], neutral: Object.values(palette[slug].neutral) as string[] },
}));
