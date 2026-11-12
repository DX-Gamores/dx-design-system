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

export const extras: Record<string, ComponentType> = {
  "Foundations": Foundations,
  "Themes & Brands": ThemesBrands,
  "Data Visualization": DataViz,
  "Content Guidelines": ContentGuidelines,
  "Localization & RTL": Localization,
  "Icons": Icons,
  "Templates": () => (
    <Section title="In code" description="The starter app is the code version of the templates: the app shell, page header and empty states, already wired to the tokens.">
      <div><StarterLink label="Open the starter app" /></div>
    </Section>
  ),
  "Starter & Empty States": () => (
    <Section title="In code" description="Start every new screen from the starter shell. For empty screens, use the Empty State component with the writing formula: what's empty, why, and what to do next.">
      <div className="flex flex-wrap gap-2">
        <StarterLink label="Open the starter app" />
        <Link href="/feedback/empty-state/" className={buttonClass({ variant: "ghost" })}>Empty State spec</Link>
      </div>
    </Section>
  ),
  "Examples": () => (
    <Section title="In code" description="The starter app is a working example built only from the library: dashboard, empty sections and the app shell.">
      <div><StarterLink label="Open the starter app" /></div>
    </Section>
  ),
};
