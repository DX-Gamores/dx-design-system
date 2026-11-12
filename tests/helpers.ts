import fs from "node:fs";
import path from "node:path";
import { expect, type Page } from "@playwright/test";

/** Fail the test on any console error or page error (Figma embeds are ignored — they need a Figma login). */
export function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => { if (m.type() === "error" && !/figma/i.test(m.text())) errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(e.message));
  return { expectNone: () => expect(errors, errors.join("\n")).toEqual([]) };
}
export const focusedText = (page: Page) =>
  page.evaluate(() => { const a = document.activeElement as HTMLElement; return (a.getAttribute("aria-label") || a.textContent || a.tagName).trim(); });

/** Every page in the static export (docs, starter, templates), as routes relative to the base URL. */
export function builtRoutes(): string[] {
  const out = path.join(process.cwd(), "out");
  const routes: string[] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith("_") || e.name === "404") continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === "index.html") routes.push(path.relative(out, dir).split(path.sep).join("/"));
    }
  };
  if (fs.existsSync(out)) walk(out);
  return routes.map((r) => (r ? `${r}/` : "./")).sort();
}
