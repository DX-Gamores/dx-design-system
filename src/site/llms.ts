// AI-readable docs: llms.txt (index), llms-full.txt (everything in one file) and a Markdown twin of every page.
// Built from the same sources as the HTML pages (docs/*.md, docs/components/*.md, figma/pages.content.json).
import fs from "node:fs";
import path from "node:path";
import { codeSymbol, coded, docPages, figmaPage, figmaUrl, flatNav, nav, specSummary, specs, VERSION } from "./content";
import { releases } from "./changelog";
import { downloads, downloadUrl } from "./downloads";

const root = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(root, p), "utf8");
export const HOST = "https://dx-design-system.vercel.app";
const REGISTRY = `${HOST}/r/v4`;

/** /actions/button/ → actions/button ; / → index */
export const mdPath = (href: string) => href.replace(/^\/|\/$/g, "") || "index";
export const mdUrl = (href: string) => `${HOST}/md/${mdPath(href)}.md`;

const startDocs: Record<string, [file: string, summary: string]> = {
  "/start/getting-started/": ["docs/GETTING-STARTED.md", "Install the tokens, map Figma names to code, and build a component the way the spec describes."],
  "/start/cli/": ["docs/INSTALL.md", "Add DX tokens and components to any React or Next.js project with one shadcn command."],
  "/start/react-native/": ["docs/REACT-NATIVE.md", "One dependency-free theme file with every token resolved per brand, color mode and density."],
  "/start/workflow/": ["docs/WORKFLOW.md", "Only the design lead edits Figma; everyone else builds from the site, the repo and view-only links."],
  "/start/new-brand/": ["docs/NEW-BRAND.md", "Add a client brand: Brand-tier tokens only, contrast-checked in all four color modes."],
};

const specMarkdown = (slug: string) =>
  read(`docs/components/${slug}.md`)
    .replace(/\n---\n_Generated[\s\S]*$/, "")
    .replace(/^# /, "### ")
    .replace(/^## /gm, "#### ");

function install(slug: string) {
  if (!coded.has(slug)) return "";
  const sym = codeSymbol(slug);
  const file = sym.includes(":") ? `@/components/${sym.split(":")[0]}` : "@/components/ui";
  return `\nInstall: \`npx shadcn@latest add ${REGISTRY}/${slug}.json\` · Import: \`import { ${sym.split(":").pop()} } from "${file}"\`\n`;
}

const summaryOf = (href: string) => {
  if (startDocs[href]) return startDocs[href][1];
  const page = docPages().find((p) => p.item.href === href);
  if (page) return page.figma?.summary ?? "";
  if (href === "/") return figmaPage("Getting Started")?.summary ?? "";
  if (href === "/start/governance/") return figmaPage("Governance")?.summary ?? "";
  if (href === "/start/changelog/") return "Releases and what's next.";
  if (href === "/start/gallery/") return "Every coded component on one page.";
  if (href === "/start/downloads/") return "Tokens in every format, icons, the starter app, and docs for AI assistants as files.";
  return "";
};

/** Markdown twin of one docs-site page. */
export function pageMarkdown(href: string): string {
  const item = flatNav.find((n) => n.href === href);
  if (!item) throw new Error(`No page ${href}`);
  const head = (title: string, summary: string, extra = "") => `# ${title}\n\n> ${summary}\n\nHTML: ${HOST}${href}${extra}\n\n`;

  if (startDocs[href]) return head(item.title, startDocs[href][1]) + read(startDocs[href][0]).replace(/^# .*\n+/, "");

  if (href === "/") {
    return (
      head("DX Design System", summaryOf("/")) +
      `DXFORM's design system, v${VERSION}. Tokens first, components second: one system, any brand, light or dark.\n\n` +
      `- Install: \`npx shadcn@latest add ${REGISTRY}/init.json ${REGISTRY}/button.json\` (see ${mdUrl("/start/cli/")})\n` +
      `- Theme: \`<html data-brand="default|violet|amber" data-theme="light|dark|light-hc|dark-hc" data-density="comfortable|compact">\`\n` +
      `- ${specs.length} components, ${coded.size} coded in React. Figma (view-only): ${figmaUrl()}\n\n` +
      nav.map((g) => `## ${g.title}\n\n${g.items.map((i) => `- [${i.title}](${mdUrl(i.href)})`).join("\n")}`).join("\n\n") +
      "\n"
    );
  }
  if (href === "/start/changelog/") {
    return head(item.title, summaryOf(href)) + releases.map((r) => `## ${r.v} · ${r.title} (${r.kind})\n\n${r.notes}`).join("\n\n") + "\n";
  }
  if (href === "/start/downloads/") {
    return head(item.title, summaryOf(href)) + downloads.map((d) => `- [${d.file}](${HOST}${downloadUrl(d.file)}) — ${d.title}: ${d.description}`).join("\n") + `\n- [llms-full.txt](${HOST}/llms-full.txt) — every page in one Markdown file\n`;
  }
  if (href === "/start/gallery/") {
    return head(item.title, summaryOf(href)) + specs.filter((s) => coded.has(s.slug)).map((s) => `- **${s.n}** — ${specSummary(s)}${install(s.slug).replace(/\n/g, " ")}`).join("\n") + "\n";
  }

  const page = docPages().find((p) => p.item.href === href);
  const fp = page?.figma ?? (item.figmaName ? figmaPage(item.figmaName) : undefined);
  let md = head(item.title, fp?.summary ?? "", fp ? ` · Figma: ${figmaUrl(fp.id)}` : "");
  if (fp?.sections?.length) md += `## On the Figma page\n\n${fp.sections.map((s) => `- ${s}`).join("\n")}\n\n`;
  if (page?.specs.length) {
    md += `## Components\n\n`;
    for (const s of page.specs) md += specMarkdown(s.slug).trimEnd() + "\n" + install(s.slug) + "\n";
  }
  return md;
}

export const mdPages = () => flatNav.map((n) => n.href);

export function llmsTxt() {
  const groups = nav
    .map((g) => `## ${g.title}\n\n${g.items.map((i) => `- [${i.title}](${mdUrl(i.href)})${summaryOf(i.href) ? `: ${summaryOf(i.href)}` : ""}`).join("\n")}`)
    .join("\n\n");
  return `# DX Design System

> DXFORM's design system (v${VERSION}): design tokens for 3 brands × 4 color modes × 2 densities, ${coded.size} React components (Next.js, Tailwind CSS v4), a shadcn registry, and React Native tokens. Figma is the source; this site is what developers use.

Key facts:

- Install tokens and components as owned source: \`npx shadcn@latest add ${REGISTRY}/init.json ${REGISTRY}/<component>.json\` (registry index: ${REGISTRY}/registry.json).
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
  return [`# DX Design System — full documentation (v${VERSION})\n\nEvery page of ${HOST} as Markdown, in sidebar order.\n`, ...mdPages().map((h) => pageMarkdown(h).replace(/^# /, "# ").trimEnd())].join("\n\n---\n\n") + "\n";
}
