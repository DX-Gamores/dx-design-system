// How a DX token is spelled on each platform. Shared by component pages and the token explorer.
const camel = (s: string) => s.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());

/** DX token (CSS variable, or text-style:<name>) → how a React Native app reads it from createTheme(). */
export function rnPath(token: string): string | null {
  let m;
  if ((m = token.match(/^text-style:([a-z0-9]+)-([\w-]+)$/))) return `theme.typography.${m[1]}.${camel(m[2])}`;
  if ((m = token.match(/^--ds-color-(bg|text|border|icon|category|shadow|dataviz)-(.+)$/))) return `theme.colors.${m[1]}.${m[2].split("-").length > 1 && m[1] === "category" ? m[2].replace(/-(\w+)$/, ".$1") : camel(m[2])}`;
  if ((m = token.match(/^--ds-brand-(primary|accent|neutral)-(\d+)$/))) return `theme.palette.${m[1]}[${m[2]}]`;
  if ((m = token.match(/^--ds-brand-role-(.+)$/))) return `theme.palette.role.${camel(m[1])}`;
  if ((m = token.match(/^--ds-font-family-(\w+)$/))) return `theme.fonts.${m[1]}`;
  if ((m = token.match(/^--ds-shape-radius-(\w+)$/))) return `theme.radius.${m[1]}`;
  if ((m = token.match(/^--ds-radius-(\w+)$/))) return `theme.radius.${m[1]}`;
  if ((m = token.match(/^--ds-(size|padding|gap)-(.+)$/))) return `theme.${m[1]}.${camel(m[2])}`;
  if ((m = token.match(/^--ds-border-width-(\w+)$/))) return `theme.borderWidth.${m[1]}`;
  if ((m = token.match(/^--ds-spacing-(.+)$/))) return `theme.spacing["${m[1].replace("-", ".")}"]`;
  if ((m = token.match(/^--ds-shadow-elevation-(\d)$/))) return `theme.elevation[${m[1]}]`;
  if (token === "--ds-shadow-focus-ring") return "theme.elevation.ring";
  if ((m = token.match(/^--ds-layout-(.+)$/))) return `theme.layout.${camel(m[1])}`;
  if ((m = token.match(/^--ds-duration-(.+)$/))) return `theme.motion.duration.${m[1]}`;
  if ((m = token.match(/^--ds-opacity-(.+)$/))) return `theme.opacity.${camel(m[1])}`;
  if ((m = token.match(/^--ds-z-(.+)$/))) return `theme.zIndex.${m[1]}`;
  if ((m = token.match(/^--ds-(button|field|card)-(.+)$/))) return `theme.component.${m[1]}.${m[2].split("-").length > 1 && /^(primary|secondary|ghost|danger)-/.test(m[2]) ? m[2].replace(/^(\w+)-(.+)$/, (_, a: string, b: string) => `${a}.${camel(b)}`) : camel(m[2])}`;
  return null;
}
