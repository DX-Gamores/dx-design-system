// Generated. Theme-aware CSS variable references for runtime use (charts, canvas, inline styles).
export const dataviz = {
  series: ["var(--ds-color-dataviz-series-1)", "var(--ds-color-dataviz-series-2)", "var(--ds-color-dataviz-series-3)", "var(--ds-color-dataviz-series-4)", "var(--ds-color-dataviz-series-5)", "var(--ds-color-dataviz-series-6)", "var(--ds-color-dataviz-series-7)", "var(--ds-color-dataviz-series-8)"],
  sequential: ["var(--ds-color-dataviz-sequential-1)", "var(--ds-color-dataviz-sequential-2)", "var(--ds-color-dataviz-sequential-3)", "var(--ds-color-dataviz-sequential-4)", "var(--ds-color-dataviz-sequential-5)"],
  diverging: ["var(--ds-color-dataviz-diverging-neg-2)", "var(--ds-color-dataviz-diverging-neg-1)", "var(--ds-color-dataviz-diverging-mid)", "var(--ds-color-dataviz-diverging-pos-1)", "var(--ds-color-dataviz-diverging-pos-2)"],
  gridline: "var(--ds-color-dataviz-gridline)",
  axis: "var(--ds-color-dataviz-axis)",
  label: "var(--ds-color-dataviz-label)",
} as const;

export const brands = ["default", "violet", "amber"] as const;
export const themes = ["light", "dark", "light-hc", "dark-hc"] as const;
export const densities = ["comfortable", "compact"] as const;
export type Brand = (typeof brands)[number];
export type Theme = (typeof themes)[number];
export type Density = (typeof densities)[number];

/** Read a token's current value (after theme switching) — e.g. for canvas charts. */
export function readToken(name: string, el: Element = document.documentElement) {
  return getComputedStyle(el).getPropertyValue(name.startsWith("--") ? name : "--ds-" + name.replace(/\//g, "-")).trim();
}
