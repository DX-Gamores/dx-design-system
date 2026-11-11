#!/usr/bin/env node
// Writes one Markdown spec per Figma component from the descriptions and properties in
// figma/styles-components.raw.json  →  docs/components/*.md + docs/components/README.md
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const { components } = JSON.parse(fs.readFileSync(path.join(root, "figma/styles-components.raw.json"), "utf8"));
const FILE = "https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System";
const pages = JSON.parse(fs.readFileSync(path.join(root, "figma/pages.json"), "utf8"));
const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const typeName = { V: "Variant", T: "Text", B: "Boolean", I: "Instance swap", S: "Slot" };
const codeProp = (n) => n.replace(/^Show /, "show ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/ (\w)/g, (_, c) => c.toUpperCase()).replace(/^\w/, (c) => c.toLowerCase());
const SECTION = /^(WHEN|PROPERTIES|RULES|A11Y[^:]*|TOKENS|CODE[^:]*|BEHAVIOUR|MOTION|STATES|LAYOUTS|VARIANTS|STRUCTURE|CONTENT|WRITING|FORMAT|GRID|SIZE|TEXT|LAYOUT|SELECTED|PRODUCT KIT[^:]*):\s*/;


// JSX in descriptions (<Button … />) would be swallowed as HTML by Markdown renderers (GitHub, the docs site).
// Code sections become fenced blocks; JSX elsewhere becomes inline code.
const cap = (t) => t.replace(/^[a-z]/, (c) => c.toUpperCase());
const fence = (body) => "```tsx\n" + body.trim() + "\n```";
const codeTags = (body) =>
  body.split(/(`[^`]*`)/).map((part, i) => (i % 2 ? part : part.replace(/<\/?[A-Za-z][^<>]*>/g, (m) => "`" + m + "`"))).join("");

const outDir = path.join(root, "docs/components");
fs.mkdirSync(outDir, { recursive: true });
const groups = {};
for (const c of components) {
  const lines = (c.d || "").split("\n").filter(Boolean);
  const [title, ...rest] = lines;
  const summary0 = title?.replace(/^.*?—\s*/, "") ?? "";
  const summary = summary0.charAt(0).toUpperCase() + summary0.slice(1);
  const sections = [];
  for (const l of rest) {
    const m = l.match(SECTION);
    if (m) sections.push([m[1].replace(/^A11Y.*/, "Accessibility").replace(/^CODE.*/, "Code"), l.replace(SECTION, "")]);
    else if (sections.length) sections[sections.length - 1][1] += "\n\n" + l;
    else sections.push(["Notes", l]);
  }
  const pageId = pages[c.page];
  let md = `# ${c.n}\n\n> ${summary}\n\n`;
  md += `**Figma:** [${c.page} page](${FILE}${pageId ? `?node-id=${pageId.replace(":", "-")}` : ""}) · ${c.vc} variant${c.vc > 1 ? "s" : ""} · open in view-only mode — no seat needed.\n\n`;
  if (c.props.length) {
    md += `## Properties\n\n| Figma property | Type | Options / default | Suggested React prop |\n|---|---|---|---|\n`;
    for (const [n, t, v] of c.props) {
      const opts = Array.isArray(v) ? v.join(" · ") : v === null || v === "" ? "—" : String(v).replace(/\|/g, "\\|");
      md += `| ${n} | ${typeName[t] ?? t} | ${opts} | \`${t === "V" && n === "State" ? "(pseudo-classes / disabled)" : codeProp(n)}\` |\n`;
    }
    md += "\n";
  }
  for (const [h, body] of sections) {
    const nice = h === "Notes" ? "Notes" : h === "PROPERTIES" ? "Property notes" : h[0] + h.slice(1).toLowerCase();
    md += `## ${nice}\n\n${h === "Code" ? fence(body) : codeTags(cap(body))}\n\n`;
  }
  md += `---\n_Generated from the Figma component description by \`npm run specs\`. Edit the description in Figma, re-export, regenerate._\n`;
  fs.writeFileSync(path.join(outDir, `${slug(c.n)}.md`), md);
  (groups[c.page] ??= []).push(c);
}
let index = `# Component specs\n\n${components.length} components, generated from the Figma file. Each page lists the Figma properties, when to use it, accessibility rules, tokens and the code API.\n\n`;
for (const [page, list] of Object.entries(groups)) {
  index += `### ${page}\n\n${list.map((c) => `- [${c.n}](./${slug(c.n)}.md) — ${(c.d || "").split("\n")[0].replace(/^.*?—\s*/, "")}`).join("\n")}\n\n`;
}
fs.writeFileSync(path.join(outDir, "README.md"), index);
fs.writeFileSync(path.join(root, "docs/components.json"), JSON.stringify(components.map((c) => ({ ...c, slug: slug(c.n), pageId: pages[c.page] || null })), null, 1));
console.log(`✓ ${components.length} component specs → docs/components/`);
