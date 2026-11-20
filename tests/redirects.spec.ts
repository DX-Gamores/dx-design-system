import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import redirects from "../src/site/redirects.json";
import v3 from "./v3-routes.json";
import { builtRoutes } from "./helpers";

// Gate G2: every v3 URL still works. It either still exists in v4 or redirects (on Vercel, via next.config.mjs)
// to a page that exists. The static export has no server, so this checks the map against the built site.
const built = new Set(builtRoutes());
const out = path.join(process.cwd(), "out");
const exists = (url: string) => (url.endsWith(".md") ? fs.existsSync(path.join(out, url)) : built.has(url.replace(/^\//, "") || "./"));
const map = new Map(redirects as [string, string][]);

test("every v3 page exists or redirects to a page that exists", () => {
  const broken = v3.routes.map((r) => `/${r}`).filter((r) => !exists(r) && !(map.has(r) && exists(map.get(r)!)));
  expect(broken).toEqual([]);
});

test("every v3 Markdown twin exists or redirects to one that exists", () => {
  const broken = v3.markdown.map((r) => `/${r}`).filter((r) => !exists(r) && !(map.has(r) && exists(map.get(r)!)));
  expect(broken).toEqual([]);
});

test("no redirect hides a page that still exists, and every target exists", () => {
  for (const [from, to] of map) {
    expect(exists(from), `${from} is redirected but still exists`).toBe(false);
    expect(exists(to), `${from} → ${to}: target missing`).toBe(true);
  }
});
