import { codeToHtml } from "shiki";

/** Build-time syntax highlighting (Shiki). High-contrast GitHub themes so token colors pass WCAG AA in light and dark. */
export function highlight(code: string, lang: "tsx" | "bash" | "css" | "json" | "ts" = "tsx") {
  return codeToHtml(code.trimEnd(), { lang, themes: { light: "github-light-high-contrast", dark: "github-dark-high-contrast" }, defaultColor: false });
}
