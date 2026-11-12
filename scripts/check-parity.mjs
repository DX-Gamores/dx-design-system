#!/usr/bin/env node
// Figma ↔ code ↔ docs-site parity. Fails (exit 1) when something drifts:
//  1. package.json version = figma/meta.json version
//  2. every Figma page is in the site sidebar (src/site/ia.json), and nothing extra is
//  3. every Figma page has its exported header/outline (figma/pages.content.json)
//  4. every Figma component spec has a Markdown spec and lives on a sidebar page
//  5. every published Figma component has a spec, and every spec maps to a Figma component
//  6. every spec is coded — its code symbol exists and is exported
//  7. every page with coded components has a live example on the site
// Writes src/site/parity.json (counts only, so the file only changes when parity does).
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const j = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const fails = [];
const ok = [];
const check = (label, problems) => (problems.length ? fails.push([label, problems]) : ok.push(label));

const pkg = j("package.json");
const meta = j("figma/meta.json");
const pages = j("figma/pages.content.json").pages;
const ia = j("src/site/ia.json");
const specs = j("docs/components.json");
const figma = j("figma/components.figma.json");
const coded = j("src/site/coded.json").coded;
const uiIndex = read("src/components/ui/index.ts");
const demoNames = [...read("src/site/demo-names.ts").matchAll(/"([^"]+)"/g)].map((m) => m[1]);

// 1
check(`Version ${pkg.version} matches the Figma export`, pkg.version === meta.version ? [] : [`package.json ${pkg.version} ≠ figma/meta.json ${meta.version}`]);

// 2 + 3
const iaPages = ia.groups.flatMap(([, , list]) => list);
const sitePages = new Set([...ia.startPages, ...iaPages]);
const figmaPages = Object.keys(pages);
check(`${figmaPages.length} Figma pages are all in the site sidebar`, figmaPages.filter((p) => !sitePages.has(p)).map((p) => `Figma page “${p}” has no site page — add it to src/site/ia.json`));
check("No site page without a Figma page", [...sitePages].filter((p) => !pages[p]).map((p) => `“${p}” is in the sidebar but not in figma/pages.content.json`));
check("Every page has its Figma header and outline", figmaPages.filter((p) => !pages[p].summary || !pages[p].sections?.length).map((p) => `“${p}” is missing summary or sections`));

// 4
check(`${specs.length} specs have Markdown files`, specs.filter((s) => !fs.existsSync(path.join(root, `docs/components/${s.slug}.md`))).map((s) => `docs/components/${s.slug}.md missing — run npm run specs`));
check("Every spec lives on a sidebar page", specs.filter((s) => !sitePages.has(s.page)).map((s) => `${s.n} is on Figma page “${s.page}”, which isn't in the sidebar`));

// 5
const published = Object.keys(figma.components).filter((n) => !figma.deprecated.includes(n));
const specNames = new Set(specs.map((s) => s.n));
check(`${published.length} published Figma components have specs`, published.filter((n) => !specNames.has(n)).map((n) => `Figma component “${n}” has no spec — add a description in Figma and re-export`));
check("Every spec maps to a published Figma component", specs.filter((s) => !figma.components[s.n]).map((s) => `${s.n} isn't in figma/components.figma.json`));

// 6
const exported = new Set([...uiIndex.matchAll(/\b([A-Z][A-Za-z0-9]+)\b/g)].map((m) => m[1]));
const symbolOk = (sym) => {
  if (!sym) return false;
  if (sym.includes(":")) {
    const [file, name] = sym.split(":");
    const src = path.join(root, `src/components/${file}.tsx`);
    return fs.existsSync(src) && new RegExp(`export (function|const) ${name}\\b`).test(read(path.relative(root, src)));
  }
  return exported.has(sym);
};
check(`${specs.length} specs are coded`, specs.filter((s) => !symbolOk(coded[s.slug])).map((s) => (coded[s.slug] ? `${s.n}: “${coded[s.slug]}” isn't exported` : `${s.n} has no code — build it, then add "${s.slug}" to src/site/coded.json`)));
check("No code mapping for a spec that doesn't exist", Object.keys(coded).filter((k) => !specs.some((s) => s.slug === k)).map((k) => `src/site/coded.json lists “${k}”, which has no spec`));

// 7
const pagesWithCode = [...new Set(specs.filter((s) => coded[s.slug]).map((s) => s.page))];
check("Every page with coded components has a live example", pagesWithCode.filter((p) => !demoNames.includes(p)).map((p) => `“${p}” has coded components but no demo in src/site/demos*.tsx`));

const summary = {
  version: pkg.version,
  figmaPages: figmaPages.length,
  specs: specs.length,
  coded: specs.filter((s) => symbolOk(coded[s.slug])).length,
  publishedComponents: published.length,
  checks: ok.length + fails.length,
  passing: ok.length,
};
fs.writeFileSync(path.join(root, "src/site/parity.json"), JSON.stringify(summary, null, 1) + "\n");

for (const l of ok) console.log(`✓ ${l}`);
for (const [l, problems] of fails) { console.log(`✗ ${l}`); for (const p of problems) console.log(`    · ${p}`); }
console.log(`\nParity ${summary.coded}/${summary.specs} coded · ${ok.length}/${ok.length + fails.length} checks pass`);
process.exit(fails.length ? 1 : 0);
