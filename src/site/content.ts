// Docs-site content, read at build time from the same files the rest of the kit is generated from:
//   figma/pages.content.json  page headers + section outline (exported from Figma)
//   docs/components.json      component descriptions + properties (exported from Figma)
//   docs/components/*.md      specs (npm run specs)
// Nothing here is written by hand per page, so a re-export keeps the site in step with Figma.
import { blockCategories } from "@/blocks";
import fs from "node:fs";
import path from "node:path";
import { Marked } from "marked";
import codedJson from "./coded.json";
import iaJson from "./ia.json";
import figmaComponents from "../../figma/components.figma.json";
import figmaMeta from "../../figma/meta.json";
import docFramesJson from "../../figma/doc-frames.json";
import redirectsJson from "./redirects.json";

const root = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(root, p), "utf8");

export const FIGMA_FILE = "https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System";
export const REPO = "https://github.com/DX-Gamores/dx-design-system";
export const VERSION: string = JSON.parse(read("package.json")).version;

export const figmaEmbedUrl = (nodeId: string) =>
  `https://embed.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=${nodeId.replace(":", "-")}&embed-host=dx-design-system&footer=false&page-selector=false`;
export const figmaUrl = (nodeId?: string) => (nodeId ? `${FIGMA_FILE}?node-id=${nodeId.replace(":", "-")}` : FIGMA_FILE);
export const slugify = (s: string) => s.toLowerCase().replace(/^kit · /, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type FigmaPage = { id: string; eyebrow: string; summary: string; sections: string[]; doDont?: { id: string; w: number; h: number } };
const figmaPages: Record<string, FigmaPage> = JSON.parse(read("figma/pages.content.json")).pages;

export type Spec = { n: string; slug: string; page: string; pageId: string | null; d: string; vc: number; props: [string, string, unknown][] };
export const specs: Spec[] = JSON.parse(read("docs/components.json"));

/** Specs that have a React component (spec slug → code symbol). Source: src/site/coded.json, checked by npm run check. */
export const coded = new Set(Object.keys(codedJson.coded));
export const codeSymbol = (slug: string) => (codedJson.coded as Record<string, string>)[slug];
export const figmaComponent = (name: string) => (figmaComponents.components as Record<string, { id: string; w: number; h: number }>)[name];
export const meta = figmaMeta;

// ── Information architecture (v4): task-based groups; one page per component ─────────────
export type NavItem = { title: string; href: string; figmaName?: string; status?: "stable" | "planned" };
export type NavGroup = { title: string; slug: string; items: NavItem[] };
export type Category = { title: string; slug: string };

type IA = { groups: [string, string, string[]][]; routes: Record<string, string>; primary: Record<string, string> };
const ia = iaJson as unknown as IA;
const figmaTitle = (n: string) => (n === "Foundations" ? "Color, type & space" : n.replace(/^Kit · /, ""));

/** Component categories, in Figma order (Actions, Inputs, Feedback …). Patterns and the product kit hold components too. */
export const categories: Category[] = ia.groups.filter(([, slug]) => slug !== "foundations").map(([title, slug]) => ({ title, slug }));
const categoryOfPage = (page: string): Category => {
  const g = ia.groups.find(([, , pages]) => pages.includes(page));
  return g ? { title: g[0], slug: g[1] } : { title: "Other", slug: "other" };
};

export type ComponentPage = { slug: string; href: string; spec: Spec; category: Category; figmaPage: string; siblings: Spec[] };
/** Every Figma component spec gets its own page at /components/<slug>/, A–Z. */
export const componentPages: ComponentPage[] = specs
  .map((spec) => ({
    slug: spec.slug,
    href: `/components/${spec.slug}/`,
    spec,
    category: categoryOfPage(spec.page),
    figmaPage: spec.page,
    siblings: specs.filter((x) => x.page === spec.page && x.slug !== spec.slug),
  }))
  .sort((x, y) => x.spec.n.localeCompare(y.spec.n));
export const componentPage = (slug: string) => componentPages.find((c) => c.slug === slug);

/** Where a Figma page lives on the site: its route, or the page of its main component. */
export function figmaPageHref(page: string) {
  if (ia.routes[page]) return ia.routes[page];
  const slug = ia.primary[page] ?? specs.find((s) => s.page === page)?.slug;
  return slug ? `/components/${slug}/` : undefined;
}

const figmaItem = (page: string): NavItem => ({ title: figmaTitle(page), href: ia.routes[page], figmaName: page });

export const nav: NavGroup[] = [
  {
    title: "Get started",
    slug: "docs",
    items: [
      { title: "Introduction", href: "/docs/", figmaName: "Getting Started" },
      { title: "Installation", href: "/docs/installation/" },
      { title: "React Native", href: "/docs/react-native/" },
      { title: "Figma to code", href: "/docs/figma-to-code/" },
      { title: "Build with AI", href: "/docs/ai/" },
      { title: "Downloads", href: "/docs/downloads/" },
      { title: "Changelog", href: "/docs/changelog/" },
    ],
  },
  {
    title: "Foundations",
    slug: "foundations",
    items: [...["Foundations", "Data Visualization", "Content Guidelines", "Localization & RTL"].map(figmaItem), { title: "Icons", href: "/icons/", figmaName: "Icons" }],
  },
  { title: "Tokens", slug: "tokens", items: [{ title: "Token explorer", href: "/tokens/" }] },
  {
    title: "Components",
    slug: "components",
    items: [
      { title: "All components", href: "/components/" },
      ...componentPages.map((c) => ({ title: c.spec.n, href: c.href, figmaName: c.figmaPage, status: coded.has(c.slug) ? ("stable" as const) : ("planned" as const) })),
    ],
  },
  {
    title: "Blocks",
    slug: "blocks",
    items: [{ title: "All blocks", href: "/blocks/" }, ...blockCategories.map((c) => ({ title: c.title, href: `/blocks/${c.id}/` }))],
  },
  { title: "Patterns", slug: "patterns", items: ["Form Patterns", "AI Patterns"].map(figmaItem) },
  { title: "Templates", slug: "product-kit", items: [...["Templates", "Starter & Empty States", "Examples"].map(figmaItem), { title: "Starter app", href: "/starter/" }] },
  { title: "Themes", slug: "themes", items: [{ title: "Themes & brands", href: "/themes/", figmaName: "Themes & Brands" }, { title: "Adding a brand", href: "/themes/adding-a-brand/" }] },
  {
    title: "Contribute",
    slug: "contribute",
    items: [
      { title: "Governance", href: "/contribute/governance/", figmaName: "Governance" },
      { title: "Working with one seat", href: "/contribute/workflow/" },
      { title: "Cleanup checklist", href: "/contribute/cleanup/" },
    ],
  },
];

export const flatNav = nav.flatMap((g) => g.items.filter((i) => !i.href.startsWith("/starter")).map((i) => ({ ...i, group: g.title })));
export function neighbours(href: string) {
  const i = flatNav.findIndex((n) => n.href === href);
  return { prev: i > 0 ? flatNav[i - 1] : null, next: i >= 0 && i < flatNav.length - 1 ? flatNav[i + 1] : null };
}

export type DocPage = { group: NavGroup; item: NavItem; figma: FigmaPage; specs: Spec[] };
/** Figma pages rendered by the generic /[group]/[page]/ route (foundations, patterns, templates). */
export function docPages(): DocPage[] {
  return nav.flatMap((group) =>
    group.items
      .filter((item) => item.figmaName && /^\/(foundations|patterns|product-kit)\/[^/]+\/$/.test(item.href))
      .map((item) => ({ group, item, figma: figmaPages[item.figmaName!], specs: specs.filter((s) => s.page === item.figmaName) })),
  );
}
export const figmaPage = (name: string) => figmaPages[name];
type Frame = { id: string; w: number; h: number };
/** Numbered documentation frames on a Figma page (Anatomy, States, Do & don't, Accessibility). */
export const docFrames = (page: string) => ((docFramesJson.pages as Record<string, Partial<Record<"anatomy" | "states" | "doDont" | "accessibility", Frame>>>)[page] ?? {});

/** v3 URL → v4 URL, generated by scripts/build-docs-data.mjs (every v3 route still exists or redirects; see tests/redirects.spec.ts). */
export const redirects = (): [string, string][] => redirectsJson as [string, string][];

// ── Markdown ───────────────────────────────────────────────────────────────────────────
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Renders Markdown. `shift` demotes headings (## → ### with shift 1). Internal .md links point at the site.
 *  Raw HTML is always shown as text: in these docs it is a JSX example, never markup. */
export function renderMarkdown(source: string, { shift = 0 }: { shift?: number } = {}) {
  const local = new Marked({ gfm: true, renderer: { html: ({ text }) => esc(text) } });
  local.use({
    walkTokens(t) {
      if (t.type === "heading") t.depth = Math.min(6, t.depth + shift);
      if (t.type === "link") t.href = mapLink(t.href);
    },
  });
  // Wrap tables so they scroll sideways on small screens while still filling the width.
  return (local.parse(source, { async: false }) as string)
    // GFM task lists: show the box as text (an unlabelled disabled checkbox fails WCAG 4.1.2)
    .replace(/<input (?:checked="" )?disabled="" type="checkbox">/g, (m) => `<span aria-hidden="true">${m.includes("checked") ? "☑" : "☐"}</span>`)
    .replace(/<table>/g, '<div class="ds-table"><table>').replace(/<\/table>/g, "</table></div>");
}

function mapLink(href: string) {
  const doc: Record<string, string> = {
    "WORKFLOW.md": "/contribute/workflow/", "docs/WORKFLOW.md": "/contribute/workflow/",
    "NEW-BRAND.md": "/themes/adding-a-brand/", "docs/NEW-BRAND.md": "/themes/adding-a-brand/",
    "GETTING-STARTED.md": "/docs/figma-to-code/", "docs/GETTING-STARTED.md": "/docs/figma-to-code/",
    "INSTALL.md": "/docs/installation/", "docs/INSTALL.md": "/docs/installation/",
    "REACT-NATIVE.md": "/docs/react-native/", "docs/REACT-NATIVE.md": "/docs/react-native/",
  };
  const base = process.env.PAGES_BASE_PATH ?? ""; // Markdown links aren't next/link, so add the Pages base path here
  if (doc[href]) return base + doc[href];
  if (href.startsWith("/")) return base + href;
  if (/^(https?:|#|mailto:)/.test(href)) return href;
  // Paths in docs/*.md are relative to docs/: "CLEANUP.md" → docs/CLEANUP.md, "../src/x" → src/x.
  const path = href.startsWith("../") ? href.slice(3) : `docs/${href.replace(/^\.\//, "")}`;
  return `${REPO}/blob/main/${path}`;
}

/** A spec without the parts the page already shows (title, summary, Figma link, footer). */
export function specBody(slug: string) {
  const raw = read(`docs/components/${slug}.md`);
  const body = raw
    .replace(/^# .*\n+/, "")
    .replace(/^> .*\n+/, "")
    .replace(/^\*\*Figma:\*\*.*\n+/, "")
    .replace(/\n---\n_Generated[\s\S]*$/, "");
  return renderMarkdown(body, { shift: 1 });
}
export const specSummary = (s: Spec) => {
  const t = (s.d || "").split("\n")[0].replace(/^.*?—\s*/, "");
  return t.charAt(0).toUpperCase() + t.slice(1);
};

export const docFile = (p: string) => read(p);

// ── Numbers for the overview, counted from the exports (never typed by hand) ───────────
export function stats() {
  const vars: { n: string; v: unknown[]; m: string[] }[] = JSON.parse(read("figma/variables.raw.json"));
  const icons: unknown[] = JSON.parse(read("figma/icons.json"));
  const brand = vars.find((c) => c.n === "Brand");
  const color = vars.find((c) => c.n === "Color");
  return {
    pages: Object.keys(figmaPages).length,
    specs: specs.length,
    coded: specs.filter((s) => coded.has(s.slug)).length,
    variables: vars.reduce((n, c) => n + c.v.length, 0),
    collections: vars.length,
    icons: Array.isArray(icons) ? icons.length : Object.keys(icons).length,
    brands: brand?.m.length ?? 3,
    modes: color?.m.length ?? 4,
  };
}
