import Link from "next/link";
import type { ComponentType } from "react";
import { Badge, Icon, buttonClass } from "@/components/ui";
import { renderMarkdown } from "./content";
import { Markdown, Panel, Section } from "./blocks";
import * as T from "./tokens-data";
import { ColorRoles, Palette, SemanticColors, StatusColors } from "./foundations/color";
import { ShapeDepth, Spacing, Typography } from "./foundations/type-space";
import { LayoutGrid, MotionDemo } from "./foundations/motion-layout";
import { ContrastAudit } from "./foundations/themes";
import { Categorical, ChartAnatomy, ColorBlindCheck, DatavizTokens, PickPalette, SeqDiv } from "./foundations/dataviz";
import { ContentDoDont, ContentGlance, Glossary, Voice } from "./foundations/content";
import { ScreenPreview } from "./screen-preview";
import { scenarios } from "@/templates/empty-data";
import { ExamplesGallery, InComponentEmptiesDemo } from "./kit-demos";
import { Checklist, Formats, IconMirroring, L10nDoDont, L10nGlance, RightToLeft, TextExpansion } from "./foundations/l10n";

/* Page bodies for the Figma pages that are mostly visual. Foundations are generated from the
   token export (figma/variables.raw.json) and rendered with the live CSS variables. */

const md = (s: string) => <Markdown html={renderMarkdown(s.trim())} />;
const StarterLink = ({ label }: { label: string }) => (
  <Link href="/starter/" className={buttonClass({ variant: "secondary" })}>{label} <Icon name="arrow-right" /></Link>
);
const Glance = ({ tiles }: { tiles: [string | number, string][] }) => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
    {tiles.map(([n, l]) => <Panel key={l} className="flex flex-col gap-1"><span className="text-heading-h2 tabular-nums">{n}</span><span className="text-body-small text-fg-secondary">{l}</span></Panel>)}
  </div>
);

function Foundations() {
  const { groups } = T.colorGroups();
  const fx = T.effects();
  const cols = T.collectionsSummary();
  return (
    <>
      <Section title="Collections" description={`${cols.reduce((n, c) => n + c.count, 0)} variables in ${cols.length} collections. Modes switch brand, colour, density, type size, layout and motion.`}>
        <div className="flex flex-wrap gap-2">
          {cols.map((c) => <Badge key={c.name} tone={["Color", "Brand"].includes(c.name) ? "brand" : "neutral"}>{`${c.name} · ${c.count}${c.modes.length > 1 ? ` · ${c.modes.length} modes` : ""}`}</Badge>)}
        </div>
      </Section>
      <Section id="color-roles" title="Color roles" description="Where each colour goes on a real screen. Same mock, two modes — the numbers never move, only the values behind them.">
        <ColorRoles />
      </Section>
      <Section id="status-colors" title="Status colors" description="Four meanings, three strengths each. Solid for emphasis, subtle for backgrounds, text for words. Never use status colours for decoration.">
        <StatusColors />
      </Section>
      <Section id="semantic-tokens" title="All semantic colour tokens" description="What designers and code use. Copy the Tailwind class or the CSS variable.">
        <SemanticColors groups={groups} />
      </Section>
      <Section id="palette" title="Palette" description="22 ramps × 11 steps. Tagged rows feed a brand mode.">
        <Palette ramps={T.palette()} brands={T.brandRamps()} />
      </Section>
      <Section id="typography" title="Typography" description="16 styles, 12 → 72, all on a 4-px baseline. Specs read size / line-height · weight.">
        <Typography styles={T.textStyles()} />
      </Section>
      <Section id="spacing" title="Spacing & density" description="A 4-px ruler, two densities.">
        <Spacing steps={T.spacing()} />
      </Section>
      <Section id="shape" title="Shape & depth" description="Corners, shadows and what sits on top.">
        <ShapeDepth radii={T.radii()} shadows={fx.shadows} z={fx.z} />
      </Section>
      <Section id="motion" title="Motion" description="Fast, purposeful, and off when asked. Reduced mode sets every duration to 0 and easing to linear — no extra work per component.">
        <MotionDemo m={T.motion()} />
      </Section>
      <Section id="layout" title="Layout" description="Four breakpoints, one grid style.">
        <LayoutGrid layouts={T.layouts()} />
      </Section>
      <Section title="Figma → code" description="The full mapping is in Getting started.">
        {md(`
| Figma | CSS | Tailwind |
|---|---|---|
| \`color/bg/surface\` | \`var(--ds-color-bg-surface)\` | \`bg-surface\` |
| \`color/text/secondary\` | \`var(--ds-color-text-secondary)\` | \`text-fg-secondary\` |
| \`shape/radius-control\` | \`var(--ds-shape-radius-control)\` | \`rounded-control\` |
| \`spacing/4\` (16px) | \`var(--ds-spacing-4)\` | \`p-4\` |
| Text style \`Heading/H1\` | \`.ds-heading-h1\` | \`text-heading-h1\` |
| Effect \`Elevation/2\` | \`var(--ds-shadow-elevation-2)\` | \`shadow-elevation-2\` |
| \`duration/fast\` · \`easing/standard\` | \`var(--ds-duration-fast)\` | \`duration-150 ease-standard\` |`)}
      </Section>
    </>
  );
}

function ThemesBrands() {
  const b = T.brandRamps();
  return (
    <>
      <Section title="At a glance">
        <Glance tiles={[[b.length, "Brands, as modes"], [4, "Colour modes incl. 2 high-contrast"], [2, "Densities"], [b.length * 4, "Looks, every one audited"]]} />
      </Section>
      <Section id="contrast" title="Contrast audit" description="Every pair clears the bar — measured live from the variables, not copied from a spreadsheet.">
        <ContrastAudit />
      </Section>
      <Section title="Switch with attributes" description="Brand, colour mode, density and motion are attributes, so a client brand is a new token mode, not a fork.">
        {md(`
\`\`\`html
<html data-brand="default" data-theme="light" data-density="comfortable">
\`\`\`

| Attribute | Values |
|---|---|
| \`data-brand\` | \`default\` (blue, Inter) · \`violet\` (Manrope) · \`amber\` (Poppins, pill controls) |
| \`data-theme\` | \`light\` · \`dark\` · \`light-hc\` · \`dark-hc\`. Unset follows the system, including “increase contrast”. |
| \`data-density\` | \`comfortable\` (40px controls) · \`compact\` (32px) |
| \`data-motion\` | \`default\` · \`reduced\`. Unset follows “reduce motion”. |

Put \`data-brand\` and \`data-theme\` on the same element.`)}
      </Section>
      <Section id="add-brand" title="Add a client brand in four steps" description="Brands are modes — no component is touched.">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[["Add a mode", "Variables → Brand → new mode, e.g. “Client · Acme”."], ["Set its values", "Primary, accent and neutral ramps, fonts, corner shape."], ["Check the matrix", "All four colour modes, then the contrast audit above."], ["Ship it", "Publish, re-export the code kit, set data-brand."]].map(([t, d], i) => (
            <li key={t}><Panel className="flex h-full flex-col gap-2"><span className="flex items-center gap-2 text-label-large"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-subtle text-label-small text-fg-brand">{i + 1}</span>{t}</span><span className="text-body-small text-fg-secondary">{d}</span></Panel></li>
          ))}
        </ol>
        <Link href="/start/new-brand/" className="w-fit text-label-medium text-fg-brand underline underline-offset-2">Full guide: Adding a brand →</Link>
      </Section>
    </>
  );
}

function DataViz() {
  return (
    <>
      <Section title="At a glance"><Glance tiles={[[8, "Categorical series, in order"], [5, "Sequential steps"], [5, "Diverging steps"], ["12 / 12", "Themes pass ≥ 3:1 (4.5:1 in HC)"]]} /></Section>
      <Section id="categorical" title="Categorical" description="Eight series, always in this order."><Categorical /></Section>
      <Section id="cvd" title="Colour-blind check" description="What people with colour-vision deficiency see."><ColorBlindCheck /></Section>
      <Section id="seq-div" title="Sequential & diverging" description="Order and direction, not categories."><SeqDiv /></Section>
      <Section id="pick" title="Pick the palette" description="What does the data look like?"><PickPalette /></Section>
      <Section id="anatomy" title="Chart anatomy" description="The quiet parts have tokens too."><ChartAnatomy /></Section>
      <Section id="tokens" title="Tokens" description="21 tokens in the Color collection, all aliasing Primitives per mode. Values below are for the current theme."><DatavizTokens /></Section>
      <Section title="In code">
        {md(`
\`\`\`ts
import { dataviz } from "@dxform/design-system/tokens";
dataviz.series;      // 8 categorical colours as CSS variables, use in order
\`\`\`

In Tailwind: \`bg-viz-series-1\`, \`fill-viz-series-1\`, \`stroke-viz-axis\`. For canvas charts, read the current value with \`readToken("--ds-color-dataviz-series-1")\`.`)}
      </Section>
    </>
  );
}

function ContentGuidelines() {
  return (
    <>
      <Section title="At a glance"><ContentGlance /></Section>
      <Section id="voice" title="Clear → concise → human" description="In that order. A capable colleague: direct, calm, never cute at the user’s expense."><Voice /></Section>
      <Section id="glossary" title="Same word, same thing — everywhere"><Glossary /></Section>
      <Section id="do-dont" title="Do & don’t" description="Right and wrong, next to each other — built with the real components."><ContentDoDont /></Section>
    </>
  );
}

function Localization() {
  return (
    <>
      <Section title="At a glance"><L10nGlance /></Section>
      <Section id="expansion" title="Plan for 40% longer — and taller" description="German and Finnish run long; the pseudo-locale shows the worst case. Components grow or wrap; nothing is clipped."><TextExpansion /></Section>
      <Section id="rtl" title="Mirror the layout, not the content" description="Arabic, Hebrew, Persian and Urdu read right to left. Layout flips; emails, numbers and brand names stay left to right."><RightToLeft /></Section>
      <Section id="icons" title="Mirror the ones that point" description="Direction icons flip in RTL. Icons that show real-world objects or time don’t."><IconMirroring /></Section>
      <Section id="formats" title="Let the locale format it" description="Never build dates, numbers or prices by hand — use Intl.* with the user’s locale."><Formats /></Section>
      <Section id="do-dont" title="Do & don’t"><L10nDoDont /></Section>
      <Section id="checklist" title="Before a screen ships"><Checklist /></Section>
    </>
  );
}

function Icons() {
  return (
    <>
      <Section id="size-color" title="Three sizes, colour from context" description="Stroke stays 2px at every size. Colour comes from the surface it sits on — never a primitive.">
        <div className="grid gap-4 md:grid-cols-2">
          <Panel className="flex items-end gap-6">
            {([16, 20, 24] as const).map((s) => <span key={s} className="flex flex-col items-center gap-2"><Icon name="bell" size={s} /><span className="text-caption-default text-fg-secondary">{s}px · {s === 16 ? "small" : s === 20 ? "default" : "large"}</span></span>)}
          </Panel>
          <Panel className="flex flex-wrap items-center gap-4">
            {[["text-icon-primary", "primary"], ["text-icon-secondary", "secondary"], ["text-icon-brand", "brand"], ["text-icon-success", "success"], ["text-icon-danger", "danger"]].map(([c, l]) => <span key={c} className="flex flex-col items-center gap-2"><Icon name="check-circle" size={24} className={c} /><code className="text-[11px]">{l}</code></span>)}
            <span className="flex flex-col items-center gap-2 rounded-md bg-brand p-2 text-icon-on-brand"><Icon name="check-circle" size={24} /><code className="text-[11px]">on-brand</code></span>
          </Panel>
        </div>
      </Section>
      <Section id="a11y" title="Accessibility">
        <Panel>{md(`
- **Decorative by default.** An icon next to a text label is hidden from screen readers (\`aria-hidden\`) — the label says it.
- **Icon-only buttons need a name:** \`<IconButton icon="edit" label="Edit Jane Cooper" />\`. Pair with a Tooltip for sighted users.
- **Meaningful standalone icons** (a status with no text) get \`<Icon name="alert-triangle" label="Warning" />\`.
- **Contrast:** icons that carry meaning need 3:1 against their background — the \`icon/*\` tokens already meet it.
- **Right-to-left:** direction icons flip automatically inside \`dir="rtl"\` — see [Localization & RTL](/foundations/localization-and-rtl/).`)}</Panel>
      </Section>
      <Section title="In code">
        {md(`
\`\`\`tsx
import { Icon } from "@/components/ui";
<Icon name="search" />            // 20px default · 16 small · 24 large
<Icon name="check" size={16} className="text-icon-success" />
\`\`\``)}
      </Section>
    </>
  );
}

const base = process.env.PAGES_BASE_PATH ?? "";
const repoFile = (f: string) => `https://github.com/DX-Gamores/dx-design-system/blob/main/${f}`;
const FileLink = ({ f }: { f: string }) => <a href={repoFile(f)} className="font-mono text-code-small text-fg-brand underline underline-offset-2">{f}</a>;

function TemplatesPage() {
  return (
    <>
      <Section title="At a glance"><Glance tiles={[[5, "Ready screens"], [3, "Breakpoints: 1440 · 834 · 390"], [4, "Hard moments: empty, loading, error"], [2, "Starter shells to begin from"]]} /></Section>
      <Section id="gallery" title="Every template, live" description="These are the real screens, built only from the library. Pick a screen and a breakpoint — the sidebar collapses to a rail on tablet and a drawer on mobile, exactly like Figma.">
        <ScreenPreview base={base} screens={[
          { label: "Dashboard", path: "/templates/dashboard" }, { label: "Members", path: "/templates/members" }, { label: "Settings", path: "/templates/settings" },
          { label: "Sign in", path: "/templates/sign-in" }, { label: "Sign up", path: "/templates/sign-up" },
        ]} />
      </Section>
      <Section id="states" title="Templates show the hard moments too" description="Empty, loading and error — built from Empty State, Skeleton, Spinner and Error Summary.">
        <ScreenPreview base={base} screens={[
          { label: "Members · no results", path: "/templates/members/empty" }, { label: "Members · loading", path: "/templates/members/loading" },
          { label: "Members · couldn’t load", path: "/templates/members/error" }, { label: "Settings · form error", path: "/templates/settings/error" },
        ]} />
      </Section>
      <Section id="how" title="Start from a template">
        <Panel>{md(`
1. Copy [\`src/templates/shell.tsx\`](${repoFile("src/templates/shell.tsx")}) and the screen you need (e.g. [\`members.tsx\`](${repoFile("src/templates/members.tsx")})) into your app, with \`src/components\`.
2. Add a route that renders it: \`<AcmeShell><MembersTemplate /></AcmeShell>\`.
3. Replace “Acme”, the nav items and the sample data. Keep the components — don’t restyle them.
4. Wire the real states: pass \`state="loading" | "error"\` while fetching, and let an empty result show the empty state.

In Figma the templates are hidden from publishing — they live in the file as starting points. In code they’re ordinary components you own.`)}</Panel>
      </Section>
    </>
  );
}

function StarterEmptyPage() {
  return (
    <>
      <Section title="At a glance"><Glance tiles={[[2, "Starter shells: app and auth"], [scenarios.length, "Full-screen empty scenarios"], [5, "Empties inside components"], [3, "Parts in the writing formula"]]} /></Section>
      <Section id="shells" title="Start every new screen here" description="Header, sidebar, spacing and modes are already right. Replace the dashed slot with your page.">
        <ScreenPreview base={base} screens={[{ label: "App shell", path: "/templates/app-shell" }, { label: "Auth shell", path: "/templates/auth-shell" }]} />
      </Section>
      <Section id="pick" title="Name the situation, then follow the row" description="Every page needs at least “first use” and “couldn’t load”. Lists with search or filters need those two as well.">
        <div className="overflow-x-auto rounded-container border border-line-default bg-surface">
          <table className="w-full text-body-small">
            <thead className="bg-surface-subtle text-left text-label-small"><tr><th className="px-3 py-2">Situation</th><th className="px-3 py-2">When</th><th className="px-3 py-2">Title</th><th className="px-3 py-2">Way forward</th><th className="px-3 py-2"><span className="sr-only">Open</span></th></tr></thead>
            <tbody>
              {scenarios.map((s) => (
                <tr key={s.slug} className="border-t border-line-default">
                  <td className="px-3 py-2 text-label-medium"><span className="flex items-center gap-2"><Icon name={s.icon} size={16} className="text-icon-secondary" />{s.name}</span></td>
                  <td className="px-3 py-2 text-fg-secondary">{s.when}</td>
                  <td className="px-3 py-2">{s.title}</td>
                  <td className="px-3 py-2 text-fg-secondary">{s.actions.map((a) => a.label).join(" · ") || "None — it’s good news"}</td>
                  <td className="px-3 py-2"><a href={`${base}/templates/empty/${s.slug}/`} className="text-label-small text-fg-brand underline underline-offset-2">Open<span className="sr-only"> {s.name}</span></a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section id="scenarios" title="Nine scenarios, every breakpoint" description="Same shell, same page header — only the content area changes. Titles wrap instead of truncating on mobile.">
        <ScreenPreview base={base} screens={scenarios.map((s) => ({ label: s.name, path: `/templates/empty/${s.slug}` }))} />
      </Section>
      <Section id="in-components" title="Small empties keep their container" description="Keep the card title, the table header, the panel chrome. Dropdowns get a sentence, not an illustration.">
        <InComponentEmptiesDemo />
      </Section>
      <Section id="formula" title="Three parts, one job each">
        <div className="grid gap-3 md:grid-cols-3">
          {[["Title", "What’s empty, in plain words.", "No projects yet"], ["Description", "Why, or what happens next. One sentence.", "Create a project to start organizing your team’s work."], ["Action", "One way forward — or none when empty is good news.", "Create project"]].map(([t, d, e], i) => (
            <Panel key={t} className="flex flex-col gap-2"><span className="flex items-center gap-2 text-label-large"><span className="grid size-6 place-items-center rounded-full bg-brand-subtle text-label-small text-fg-brand">{i + 1}</span>{t}</span><span className="text-body-small text-fg-secondary">{d}</span><span className="text-body-small">e.g. “{e}”</span></Panel>
          ))}
        </div>
      </Section>
      <Section id="how" title="From starter to shipped screen">
        <Panel>{md(`
- **Shells:** [\`src/templates/shell.tsx\`](${repoFile("src/templates/shell.tsx")}) — \`AcmeShell\` (app) and \`AuthShell\` (sign-in, sign-up, invites).
- **Scenarios:** [\`src/templates/empty.tsx\`](${repoFile("src/templates/empty.tsx")}) — the nine scenarios as data plus \`EmptyScreen\`; copy the words, swap the nouns.
- **In components:** use \`<EmptyState>\` for full areas; for small containers keep the chrome and write one sentence.`)}</Panel>
      </Section>
    </>
  );
}

function ExamplesPage() {
  return (
    <>
      <Section id="examples" title="Five examples, built only from the library" description="Each one is a single component in src/templates/examples.tsx — copy it and change the words.">
        <ExamplesGallery />
      </Section>
      <Section title="Full screens">
        <p className="text-body-medium text-fg-secondary">For whole pages — dashboard, members, settings, sign in and sign up — see <Link href="/product-kit/templates/" className="text-fg-brand underline underline-offset-2">Templates</Link>, or open the <Link href="/templates/dashboard/" className="text-fg-brand underline underline-offset-2">clickable prototype</Link>.</p>
        <p className="text-caption-default text-fg-secondary">Source: <FileLink f="src/templates/examples.tsx" /></p>
      </Section>
    </>
  );
}

export const extras: Record<string, ComponentType> = {
  "Foundations": Foundations,
  "Themes & Brands": ThemesBrands,
  "Data Visualization": DataViz,
  "Content Guidelines": ContentGuidelines,
  "Localization & RTL": Localization,
  "Icons": Icons,
  "Templates": TemplatesPage,
  "Starter & Empty States": StarterEmptyPage,
  "Examples": ExamplesPage,
};
