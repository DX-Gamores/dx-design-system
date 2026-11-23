// AI-readable docs: llms.txt (index), llms-full.txt (everything in one file) and a Markdown twin of every page.
// Built from the same sources as the HTML pages (docs/*.md, docs/components/*.md, src/examples, figma/pages.content.json).
import fs from "node:fs";
import path from "node:path";
import { blockCategories, blocks } from "@/blocks";
import { FONTS } from "@/lib/theme/engine";
import gallery from "../../dist/brands/gallery.json";
import { coded, componentPage, docPages, figmaPage, figmaUrl, flatNav, nav, specs, specSummary, VERSION } from "./content";
import { releases } from "./changelog";
import componentData from "./component-data.json";
import { downloads, downloadUrl } from "./downloads";
import { a11y } from "./a11y";

const root = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(root, p), "utf8");
export const HOST = "https://dx-design-system.vercel.app";
const REGISTRY = `${HOST}/r/v4`;
const data = componentData as Record<string, { export: string; importPath: string; props: { name: string; type: string; required: boolean; default?: string }[] }>;

/** /components/button/ → components/button ; /docs/ → docs */
export const mdPath = (href: string) => href.replace(/^\/|\/$/g, "") || "index";
export const mdUrl = (href: string) => `${HOST}/md/${mdPath(href)}.md`;

const mdDocs: Record<string, [file: string, summary: string]> = {
  "/docs/installation/": ["docs/INSTALL.md", "Add DX tokens and components to any React or Next.js project with one shadcn command."],
  "/docs/react-native/": ["docs/REACT-NATIVE.md", "One dependency-free theme file with every token resolved per brand, color mode and density."],
  "/docs/figma-to-code/": ["docs/GETTING-STARTED.md", "Map Figma names to code and build a component the way the spec describes."],
  "/docs/ai/": ["docs/AI.md", "Point AI assistants at the DX docs and rules so the code they write uses DX components and tokens."],
  "/contribute/workflow/": ["docs/WORKFLOW.md", "Only the design lead edits Figma; everyone else builds from the site, the repo and view-only links."],
  "/contribute/cleanup/": ["docs/CLEANUP.md", "The last step of every process: credentials, branches, build output and hosting."],
  "/themes/adding-a-brand/": ["docs/NEW-BRAND.md", "Add a client brand: Brand-tier tokens only, contrast-checked in all four color modes."],
};

const other: Record<string, string> = {
  "/docs/": figmaPage("Getting Started")?.summary ?? "",
  "/docs/changelog/": "Releases and what's next.",
  "/docs/downloads/": "Tokens in every format, icons, the starter app, and docs for AI assistants as files.",
  "/components/": "All components, A–Z, with their category.",
  "/tokens/": "Every design token: tiers, names and values per brand and color mode.",
  "/icons/": "The DX icon set (Lucide): names and how to use any Lucide icon.",
  "/themes/": figmaPage("Themes & Brands")?.summary ?? "",
  "/themes/builder/": "Make a client brand in the browser: primary colour, accent, neutrals, fonts and corners → colour ramps, a 27-pair × 4-mode contrast check, and exports (CSS, DTCG/Figma, React Native, registry).",
  "/themes/gallery/": "Brands made with the theme builder, installable as @dx/theme-<brand>, plus the three built-in brands.",
  "/contribute/governance/": figmaPage("Governance")?.summary ?? "",
};

const summaryOf = (href: string) => {
  if (mdDocs[href]) return mdDocs[href][1];
  if (other[href] !== undefined) return other[href];
  if (href === "/blocks/") return `${blocks.length} ready-made screens and sections (sidebars, dashboards, auth, settings, data tables, empty states), installable with the shadcn CLI.`;
  const bc = href.startsWith("/blocks/") ? blockCategories.find((c) => href === `/blocks/${c.id}/`) : undefined;
  if (bc) return bc.description;
  const c = componentPage(href.split("/")[2] ?? "");
  if (c && href.startsWith("/components/")) return specSummary(c.spec);
  return docPages().find((p) => p.item.href === href)?.figma?.summary ?? "";
};

const exampleSource = (slug: string) => {
  const dir = path.join(root, "src/examples", slug);
  const f = fs.existsSync(dir) ? fs.readdirSync(dir).filter((x) => /^\d\d-/.test(x)).sort()[0] : undefined;
  return f ? fs.readFileSync(path.join(dir, f), "utf8").replace(/^\/\*\*[\s\S]*?\*\/\s*/, "").replace(/^"use client";\s*/m, "").trim() : "";
};

function componentMarkdown(slug: string, href: string) {
  const c = componentPage(slug)!;
  const d = data[slug];
  const acc = a11y[slug];
  let md = `# ${c.spec.n}\n\n> ${specSummary(c.spec)}\n\nHTML: ${HOST}${href} · Category: ${c.category.title} · Figma page: ${c.figmaPage}\n\n`;
  if (d) {
    md += `## Install\n\n\`\`\`bash\nnpx shadcn@latest add ${REGISTRY}/${slug}.json\n\`\`\`\n\n\`\`\`tsx\nimport { ${d.export} } from "${d.importPath}";\n\`\`\`\n\n`;
    const ex = exampleSource(slug);
    if (ex) md += `## Example\n\n\`\`\`tsx\n${ex}\n\`\`\`\n\n`;
    if (d.props.length) md += `## Props\n\n| Prop | Type | Default |\n| --- | --- | --- |\n${d.props.map((p) => `| ${p.name}${p.required ? " (required)" : ""} | \`${p.type.replace(/\|/g, "\\|")}\` | ${p.default ? `\`${p.default}\`` : "—"} |`).join("\n")}\n\n`;
  }
  if (acc) md += `## Accessibility\n\n${acc.keyboard.map(([k, v]) => `- **${k}**: ${v}`).join("\n")}\n${[...acc.aria, ...(acc.notes ?? [])].map((a) => `- ${a}`).join("\n")}\n\n`;
  md += `## Figma spec\n\n${read(`docs/components/${slug}.md`).replace(/\n---\n_Generated[\s\S]*$/, "").replace(/^# .*\n+/, "").replace(/^## /gm, "### ")}\n`;
  return md;
}

/** Markdown twin of one docs-site page. */
export function pageMarkdown(href: string): string {
  const item = flatNav.find((n) => n.href === href);
  if (!item) throw new Error(`No page ${href}`);
  if (href.startsWith("/components/") && href !== "/components/") return componentMarkdown(href.split("/")[2], href);
  const head = (summary: string, extra = "") => `# ${item.title}\n\n> ${summary}\n\nHTML: ${HOST}${href}${extra}\n\n`;

  if (mdDocs[href]) return head(mdDocs[href][1]) + read(mdDocs[href][0]).replace(/^# .*\n+/, "");
  if (href === "/docs/") {
    return (
      head(summaryOf(href)) +
      `DXFORM's design system, v${VERSION}. Tokens first, components second: one system, any brand, light or dark.\n\n` +
      `- Install: \`npx shadcn@latest add ${REGISTRY}/init.json ${REGISTRY}/button.json\` (see ${mdUrl("/docs/installation/")})\n` +
      `- Theme: \`<html data-brand="default|violet|amber" data-theme="light|dark|light-hc|dark-hc" data-density="comfortable|compact">\`\n` +
      `- ${specs.length} components, ${coded.size} coded in React. Figma (view-only): ${figmaUrl()}\n\n` +
      nav.map((g) => `## ${g.title}\n\n${g.items.filter((i) => !i.href.startsWith("/starter")).map((i) => `- [${i.title}](${mdUrl(i.href)})`).join("\n")}`).join("\n\n") +
      "\n"
    );
  }
  if (href === "/docs/changelog/") return head(summaryOf(href)) + releases.map((r) => `## ${r.v} · ${r.title} (${r.kind})\n\n${r.notes}`).join("\n\n") + "\n";
  if (href === "/docs/downloads/") return head(summaryOf(href)) + downloads.map((d) => `- [${d.file}](${HOST}${downloadUrl(d.file)}) — ${d.title}: ${d.description}`).join("\n") + `\n- [llms-full.txt](${HOST}/llms-full.txt) — every page in one Markdown file\n`;
  if (href === "/components/") return head(summaryOf(href)) + flatNav.filter((i) => i.href.startsWith("/components/") && i.href !== "/components/").map((i) => `- [${i.title}](${mdUrl(i.href)}): ${summaryOf(i.href)}`).join("\n") + "\n";
  if (href === "/blocks/") {
    return head(summaryOf(href)) + `Add the registry to components.json once: \`{ "registries": { "@dx": "${REGISTRY}/{name}.json" } }\`, then \`npx shadcn@latest add @dx/<block>\`. The page goes to app/<route>/page.tsx, its parts to components/.\n\n` +
      blockCategories.map((c) => `- [${c.title}](${mdUrl(`/blocks/${c.id}/`)}): ${c.description}`).join("\n") + "\n";
  }
  if (href.startsWith("/blocks/")) {
    const cat = blockCategories.find((c) => href === `/blocks/${c.id}/`)!;
    return head(summaryOf(href)) + blocks.filter((b) => b.category === cat.id).map((b) => {
      const item = JSON.parse(read(`public/r/v4/${b.name}.json`)) as { files: { target: string }[] };
      return `## ${b.name} · ${b.title}\n\n${b.description}\n\n\`\`\`bash\nnpx shadcn@latest add @dx/${b.name}\n\`\`\`\n\nPreview: ${HOST}/view/${b.name}/ · Files: ${item.files.map((f) => f.target).join(", ")}`;
    }).join("\n\n") + "\n";
  }
  if (href === "/themes/builder/") {
    return head(summaryOf(href)) + `Open ${HOST}/themes/builder/ in a browser. Settings: name, primary (hex), accent (a primitive ramp or hex), neutrals (gray, slate, zinc, stone, neutral, tinted), heading and body font (${FONTS.map((f) => f.family).join(", ")}), control and card corners, density. Share links keep the settings in the URL.\n\nRules: buttons use the seed's step with white text if that reaches 4.5:1, otherwise dark text (like Amber); high contrast needs 7:1; the focus ring needs 3:1 on white and the page background. Text pairs need 4.5:1 (7:1 in high contrast), UI parts 3:1 (4.5:1).\n`;
  }
  if (href === "/themes/gallery/") {
    return head(summaryOf(href)) + gallery.map((g) => `- **${g.name}** (\`data-brand="${g.slug}"\`): \`npx shadcn@latest add ${REGISTRY}/theme-${g.slug}.json\` — ${g.input.headingFont}, primary ${g.input.primary}, ${g.passed}/${g.total} contrast checks`).join("\n") + "\n- Built in: default (Inter), violet (Manrope), amber (Poppins)\n";
  }
  if (href === "/tokens/") {
    return head(summaryOf(href)) + `Tiers: Primitive (color/blue/600) → Brand (brand/primary/600) → Semantic (color/bg/brand) → Component (button/primary/bg). Components read Semantic and Component tokens only.\n\nCSS: \`var(--ds-color-bg-surface)\` · Tailwind: \`bg-surface\`, \`text-fg-secondary\`, \`border-line-default\`, \`rounded-control\` · React Native: \`theme.colors.bg.surface\`.\n\nAll tokens as DTCG JSON: ${HOST}/downloads/dx-tokens.json\n`;
  }
  if (href === "/icons/") {
    const names = Object.keys(JSON.parse(read("src/site/lucide-names.json")));
    return head(summaryOf(href)) + `Use \`<Icon name="check" />\` with a DX name, or any Lucide icon: \`<Icon name={Rocket} />\`.\n\nDX names: ${names.join(", ")}\n`;
  }

  const page = docPages().find((p) => p.item.href === href);
  const fp = page?.figma ?? (item.figmaName ? figmaPage(item.figmaName) : undefined);
  let md = head(fp?.summary ?? summaryOf(href), fp ? ` · Figma: ${figmaUrl(fp.id)}` : "");
  if (fp?.sections?.length) md += `## On the Figma page\n\n${fp.sections.map((s) => `- ${s}`).join("\n")}\n\n`;
  if (page?.specs.length) md += `## Components\n\n${page.specs.map((s) => `- [${s.n}](${mdUrl(`/components/${s.slug}/`)}): ${specSummary(s)}`).join("\n")}\n`;
  return md;
}

export const mdPages = () => flatNav.map((n) => n.href).filter((h) => !h.startsWith("/starter"));

export function llmsTxt() {
  const groups = nav
    .map((g) => `## ${g.title}\n\n${g.items.filter((i) => !i.href.startsWith("/starter")).map((i) => `- [${i.title}](${mdUrl(i.href)})${summaryOf(i.href) ? `: ${summaryOf(i.href)}` : ""}`).join("\n")}`)
    .join("\n\n");
  return `# DX Design System

> DXFORM's design system (v${VERSION}): design tokens for 3 brands × 4 color modes × 2 densities, ${coded.size} React components (Next.js, Tailwind CSS v4), a shadcn registry, and React Native tokens. Figma is the source; this site is what developers use.

Key facts:

- Install tokens and components as owned source: \`npx shadcn@latest add ${REGISTRY}/init.json ${REGISTRY}/<component>.json\` (registry index: ${REGISTRY}/registry.json). Component names match the page URLs (/components/<name>/).
- Theme with attributes on <html>: data-brand (default, violet, amber), data-theme (light, dark, light-hc, dark-hc), data-density (comfortable, compact).
- Use DX semantic tokens, never raw colors: CSS \`var(--ds-color-bg-surface)\`, Tailwind \`bg-surface\`, \`text-fg-secondary\`, \`border-line-default\`, \`rounded-control\`, \`text-heading-h1\`. shadcn aliases (\`bg-primary\`, \`text-muted-foreground\`) map to DX tokens.
- Icons: \`<Icon name="check" />\` (DX names on Lucide) or any Lucide icon \`<Icon name={Rocket} />\`.
- React Native: \`createTheme({ brand, mode, density })\` from tokens.native.ts.

${groups}

## Optional

- [Everything in one file](${HOST}/llms-full.txt)
- [Registry index (JSON)](${REGISTRY}/registry.json)
- [Design tokens, DTCG JSON](${HOST}/downloads/dx-tokens.json)
- [Source on GitHub](https://github.com/DX-Gamores/dx-design-system)
`;
}

export function llmsFullTxt() {
  return [`# DX Design System — full documentation (v${VERSION})\n\nEvery page of ${HOST} as Markdown, in sidebar order.\n`, ...mdPages().map((h) => pageMarkdown(h).trimEnd())].join("\n\n---\n\n") + "\n";
}
