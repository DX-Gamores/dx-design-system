// Docs-site content, read at build time from the same files the rest of the kit is generated from:
//   figma/pages.content.json  page headers + section outline (exported from Figma)
//   docs/components.json      component descriptions + properties (exported from Figma)
//   docs/components/*.md      specs (npm run specs)
// Nothing here is written by hand per page, so a re-export keeps the site in step with Figma.
import fs from "node:fs";
import path from "node:path";
import { Marked } from "marked";

const root = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(root, p), "utf8");

export const FIGMA_FILE = "https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System";
export const REPO = "https://github.com/DX-Gamores/dx-design-system";
export const VERSION: string = JSON.parse(read("package.json")).version;

export const figmaUrl = (nodeId?: string) => (nodeId ? `${FIGMA_FILE}?node-id=${nodeId.replace(":", "-")}` : FIGMA_FILE);
export const slugify = (s: string) => s.toLowerCase().replace(/^kit · /, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type FigmaPage = { id: string; eyebrow: string; summary: string; sections: string[] };
const figmaPages: Record<string, FigmaPage> = JSON.parse(read("figma/pages.content.json")).pages;

export type Spec = { n: string; slug: string; page: string; pageId: string | null; d: string; vc: number; props: [string, string, unknown][] };
export const specs: Spec[] = JSON.parse(read("docs/components.json"));

/** Specs that have a React component in src/components/ui (or the app shell). Update when one is added. */
export const coded = new Set([
  "button", "icon-button", "text-field", "select", "textarea", "checkbox", "toggle",
  "badge", "alert", "spinner", "skeleton", "empty-state", "progress-bar",
  "tabs", "tab", "segmented-control", "segmented-control-item", "stepper", "step",
  "app-header", "sidebar", "nav-item", "page-header", "skip-link",
  "avatar", "card", "stat-card", "ai-label", "citation",
]);

// ── Information architecture: the same groups and order as the Figma file ──────────────
export type NavItem = { title: string; href: string; figmaName?: string };
export type NavGroup = { title: string; slug: string; items: NavItem[] };

const figmaGroups: [string, string, string[]][] = [
  ["Foundations", "foundations", ["Foundations", "Themes & Brands", "Data Visualization", "Content Guidelines", "Localization & RTL", "Icons"]],
  ["Actions", "actions", ["Button", "Link"]],
  ["Inputs", "inputs", ["Text Field", "Select", "Combobox", "Date Picker", "Textarea", "Search Field", "Checkbox", "Radio", "Toggle", "Slider", "Chip", "File Upload"]],
  ["Feedback", "feedback", ["Alert", "Toast", "Progress", "Loading", "Empty State", "Tooltip", "Badge"]],
  ["Overlays", "overlays", ["Dialog", "Popover & Drawer", "Menu"]],
  ["Navigation", "navigation", ["Navigation", "Tabs", "Segmented Control", "Stepper", "Accordion"]],
  ["Data display", "data-display", ["Avatar", "Card", "Divider", "Lists & Tables"]],
  ["Patterns", "patterns", ["Form Patterns", "AI Patterns"]],
  ["Product kit", "product-kit", ["Kit · Stat Card", "Templates", "Starter & Empty States", "Examples"]],
];
const displayName = (n: string) => (n === "Foundations" ? "Color, type & space" : n.replace(/^Kit · /, ""));
const pageSlug = (n: string) => (n === "Foundations" ? "overview" : slugify(n));

export const nav: NavGroup[] = [
  {
    title: "Start here",
    slug: "start",
    items: [
      { title: "Overview", href: "/", figmaName: "Getting Started" },
      { title: "Getting started", href: "/start/getting-started/" },
      { title: "Governance", href: "/start/governance/", figmaName: "Governance" },
      { title: "Changelog & roadmap", href: "/start/changelog/" },
      { title: "Working with one seat", href: "/start/workflow/" },
      { title: "Adding a brand", href: "/start/new-brand/" },
      { title: "Component gallery", href: "/start/gallery/" },
    ],
  },
  ...figmaGroups.map(([title, slug, pages]) => ({
    title,
    slug,
    items: pages.map((p) => ({ title: displayName(p), href: `/${slug}/${pageSlug(p)}/`, figmaName: p })),
  })),
];

export const flatNav = nav.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title })));
export function neighbours(href: string) {
  const i = flatNav.findIndex((n) => n.href === href);
  return { prev: i > 0 ? flatNav[i - 1] : null, next: i >= 0 && i < flatNav.length - 1 ? flatNav[i + 1] : null };
}

export type DocPage = {
  group: NavGroup;
  item: NavItem;
  figma: FigmaPage;
  specs: Spec[];
};
export function docPages(): DocPage[] {
  return nav.slice(1).flatMap((group) =>
    group.items.map((item) => ({
      group,
      item,
      figma: figmaPages[item.figmaName!],
      specs: specs.filter((s) => s.page === item.figmaName),
    })),
  );
}
export const figmaPage = (name: string) => figmaPages[name];

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
  return (local.parse(source, { async: false }) as string).replace(/<table>/g, '<div class="ds-table"><table>').replace(/<\/table>/g, "</table></div>");
}

function mapLink(href: string) {
  const doc: Record<string, string> = {
    "WORKFLOW.md": "/start/workflow/", "docs/WORKFLOW.md": "/start/workflow/",
    "NEW-BRAND.md": "/start/new-brand/", "docs/NEW-BRAND.md": "/start/new-brand/",
    "GETTING-STARTED.md": "/start/getting-started/", "docs/GETTING-STARTED.md": "/start/getting-started/",
  };
  const base = process.env.PAGES_BASE_PATH ?? ""; // Markdown links aren't next/link, so add the Pages base path here
  if (doc[href]) return base + doc[href];
  if (href.startsWith("/")) return base + href;
  if (/^(https?:|#|mailto:)/.test(href)) return href;
  return `${REPO}/blob/main/${href.replace(/^\.\.\//, "").replace(/^\.\//, "docs/")}`;
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
    pages: docPages().length,
    specs: specs.length,
    coded: specs.filter((s) => coded.has(s.slug)).length,
    variables: vars.reduce((n, c) => n + c.v.length, 0),
    collections: vars.length,
    icons: Array.isArray(icons) ? icons.length : Object.keys(icons).length,
    brands: brand?.m.length ?? 3,
    modes: color?.m.length ?? 4,
  };
}
