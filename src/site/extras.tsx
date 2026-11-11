import Link from "next/link";
import type { ComponentType } from "react";
import { Alert, Icon, buttonClass } from "@/components/ui";
import { renderMarkdown } from "./content";
import { Markdown, Panel, Section } from "./blocks";

/* Extra content for Figma pages that are mostly visual (foundations, product kit).
   Phase 2 replaces the "coming next" notes with full, token-generated pages. */

const md = (s: string) => <Markdown html={renderMarkdown(s.trim())} />;
const Later = ({ what }: { what: string }) => (
  <Alert tone="info" title="More of this page is on the way">
    {what} are coming to the site in Phase 2, generated from the tokens. Until then, the Figma page shows them.
  </Alert>
);
const StarterLink = ({ label }: { label: string }) => (
  <Link href="/starter/" className={buttonClass({ variant: "secondary" })}>{label} <Icon name="arrow-right" /></Link>
);

export const extras: Record<string, ComponentType> = {
  "Foundations": () => (
    <>
      <Section title="Use tokens, never values" description="Every colour, size, radius, shadow and duration comes from a variable. Components only touch the semantic layer.">
        {md(`
| Figma variable | CSS | Tailwind |
|---|---|---|
| \`color/bg/surface\` | \`var(--ds-color-bg-surface)\` | \`bg-surface\` |
| \`color/text/secondary\` | \`var(--ds-color-text-secondary)\` | \`text-fg-secondary\` |
| \`color/border/default\` | \`var(--ds-color-border-default)\` | \`border-line-default\` |
| \`shape/radius-control\` | \`var(--ds-shape-radius-control)\` | \`rounded-control\` |
| \`spacing/4\` (16px) | \`var(--ds-spacing-4)\` | \`p-4\` |
| Text style \`Heading/H1\` | \`.ds-heading-h1\` | \`text-heading-h1\` |
| Effect \`Elevation/2\` | \`var(--ds-shadow-elevation-2)\` | \`shadow-elevation-2\` |
| \`duration/fast\` · \`easing/standard\` | \`var(--ds-duration-fast)\` | \`duration-150 ease-standard\` |

The full mapping is in [Getting started](/start/getting-started/).`)}
      </Section>
      <Later what="The colour roles, palette, type scale, spacing, shape, motion and layout pages" />
    </>
  ),
  "Themes & Brands": () => (
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

Put \`data-brand\` and \`data-theme\` on the same element. To add a client brand, see [Adding a brand](/start/new-brand/).`)}
    </Section>
  ),
  "Data Visualization": () => (
    <Section title="In code">
      {md(`
\`\`\`ts
import { dataviz } from "@dxform/design-system/tokens";
dataviz.series;      // 8 categorical colours, use in order
\`\`\`

Or use the CSS variables directly: \`var(--ds-color-dataviz-series-1)\` … \`-8\`, \`sequential-1…5\`, \`diverging-*\`, \`gridline\`, \`axis\`, \`label\`. In Tailwind: \`bg-viz-series-1\`, \`fill-viz-series-1\`, \`stroke-viz-axis\`.

Series 1–4 stay apart for colour-blind readers. From series 5 on, label lines and bars directly.`)}
    </Section>
  ),
  "Content Guidelines": () => (
    <>
      <Section title="The rules that matter most">
        <Panel>{md(`
- **Clear, then concise, then human.** A capable colleague: direct, calm, never cute at the user's expense.
- **Plain words from the user's side:** “Notifications”, not “Webhook settings”.
- **Buttons are verbs** (“Save changes”, “Invite people”); **navigation is nouns**. Sentence case everywhere.
- **Errors say what happened and how to fix it:** “Company name is already taken — try another.” Never just “Invalid”.
- **Dates:** spell out the month once picked (“Nov 18, 2026”); accept typed input in the format shown in the helper.
- **Same word, same thing, everywhere.** Each product keeps its own noun list (glossary).`)}</Panel>
      </Section>
      <Later what="The voice examples, glossary and do & don't pairs" />
    </>
  ),
  "Localization & RTL": () => (
    <>
      <Section title="The rules that matter most">
        <Panel>{md(`
- **Plan for 40% longer text — and taller.** Components grow or wrap; nothing is clipped.
- **Right-to-left:** set \`dir="rtl"\` and use logical CSS (\`ms-*\`, \`me-*\`, \`ps-*\`, \`pe-*\`, \`start-*\`). Layout flips; emails, numbers and brand names stay left to right.
- **Icons:** direction icons flip (arrows, chevrons, undo, send). Real-world objects and time (clock, check, phone) don't.
- **Formats:** never build dates, numbers or prices by hand — use \`Intl.*\` with the user's locale.`)}</Panel>
      </Section>
      <Later what="The text-expansion examples, RTL screens and the pre-ship checklist" />
    </>
  ),
  "Icons": () => (
    <Section title="In code">
      {md(`
\`\`\`tsx
import { Icon } from "@/components/ui";
<Icon name="search" />            // 20px default · 16 small · 24 large
<Icon name="check" size={16} />
\`\`\`

Icons take the colour of their text (\`currentColor\`). Decorative icons are hidden from screen readers; an icon that is the only content of a button needs a label (\`<IconButton icon="edit" label="Edit" />\`).`)}
    </Section>
  ),
  "Templates": () => (
    <Section title="In code" description="The starter app is the code version of the templates: the app shell, page header and empty states, already wired to the tokens.">
      <div><StarterLink label="Open the starter app" /></div>
      <Later what="Screenshots of every template at every breakpoint" />
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
