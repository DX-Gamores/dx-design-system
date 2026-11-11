import { Badge, Icon } from "@/components/ui";
import { figmaPage } from "@/site/content";
import { DocHeader, FigmaOutline, Panel, PrevNext, Section } from "@/site/blocks";

export const metadata = { title: "Governance" };

// Mirrors the Figma Governance page.
const glance: [string, string][] = [
  ["3", "Ownership tiers"], ["6", "Steps from request to release"], ["0", "Raw values in components"],
  ["80 / 80", "WCAG 2.2 checks pass"], ["324 / 324", "Contrast checks"], ["10 / 10", "Release health checks green"],
];
const rings = [
  { who: "DS team", tier: "Core", note: "Tokens, primitives, app shell, templates, guidelines." },
  { who: "Product teams + review", tier: "Extended", note: "Product patterns built only from Core. Good ones get promoted to Core." },
  { who: "Product teams", tier: "Local", note: "One-off compositions inside a product. No review; Core parts only." },
];
const dod: [string, string[]][] = [
  ["Figma", ["All states as variants", "100% token-bound — health check 0", "Description: WHEN · PROPERTIES · A11Y · TOKENS + CODE", "Visual docs frame", "Light/Dark × brands × densities", "Contrast AA"]],
  ["Code", ["Props mirror Figma", "APG keyboard behaviour, tested", "Every state shown on its docs page", "WCAG 2.2 A/AA checks pass"]],
  ["Docs & release", ["Spec regenerated (npm run build:all)", "Changelog entry", "Version bumped per policy", "Library published"]],
];
const versions = [
  { tone: "danger" as const, label: "Major", v: "x.0.0", note: "Remove or rename a component, prop, value or token · change keyboard behaviour. The changelog starts with BREAKING + migration." },
  { tone: "brand" as const, label: "Minor", v: "3.x.0", note: "New component, variant, prop, token, mode or icon · deprecations · value changes that keep meaning." },
  { tone: "success" as const, label: "Patch", v: "3.0.x", note: "Fixes and docs · visual tweaks inside existing tokens." },
];
const lifecycle = [
  ["Request", "Issue form: problem, evidence, API, accessibility."],
  ["Triage", "Accept, reuse, or decline with a reason."],
  ["Research", "Findings + sources on the Research page."],
  ["Design", "All states, tokens only, docs frame."],
  ["Build", "React mirrors Figma props; tests."],
  ["Release", "Done → semver → changelog → publish."],
];
const deprecation = [
  ["Mark", "Prefix “⚠ Deprecated/”, say what to use; console.warn in code; $deprecated on tokens."],
  ["Keep", "At least one minor release and 30 days."],
  ["Remove", "In the next major, with a migration note."],
];
const health: [string, string, string][] = [
  ["0", "Raw colour values", "in components and visual docs"],
  ["0", "Broken instances", "across 62 pages"],
  ["0", "Private parts shipped", "no _Doc or _Template inside published components"],
  ["0", "Garbled descriptions", "no &quot; escapes"],
  ["0", "Silent focus rings", "every ring renders (clip on)"],
  ["202 / 202", "Described components", "every set has usage notes"],
  ["0", "Text without a style", "typography tokens only"],
  ["48 / 48", "Screens at +40% text", "pseudo-locale, 0 overflow"],
  ["324 / 324", "Contrast checks", "27 pairs × 3 brands × 4 modes"],
  ["12 / 12", "Data-viz themes", "≥ 3:1, 4.5:1 in HC"],
];

const Steps = ({ items }: { items: string[][] }) => (
  <ol className={`grid gap-3 sm:grid-cols-2 ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
    {items.map(([t, d], i) => (
      <li key={t}>
        <Panel className="flex h-full flex-col gap-2">
          <span className="flex items-start gap-2 text-label-large">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-subtle text-label-small text-fg-brand">{i + 1}</span>{t}
          </span>
          <span className="text-body-small text-fg-secondary">{d}</span>
        </Panel>
      </li>
    ))}
  </ol>
);

export default function Governance() {
  const fig = figmaPage("Governance");
  return (
    <>
      <DocHeader eyebrow={fig.eyebrow} title="Governance" summary={fig.summary} figmaId={fig.id}>
        <Badge>Hybrid model</Badge>
      </DocHeader>

      <Section title="At a glance">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {glance.map(([n, l]) => (
            <Panel key={l} className="flex flex-col gap-1"><span className="text-heading-h2 tabular-nums">{n}</span><span className="text-body-small text-fg-secondary">{l}</span></Panel>
          ))}
        </div>
      </Section>

      <Section title="Three rings of ownership" description="Core is owned by the design-system team. Product teams extend it through review — and good extensions get promoted.">
        <div className="grid gap-3 md:grid-cols-3">
          {rings.map((r) => (
            <Panel key={r.tier} className="flex flex-col gap-2"><Badge tone={r.tier === "Core" ? "brand" : "neutral"}>{r.who}</Badge><span className="text-label-large">{r.tier}</span><span className="text-body-small text-fg-secondary">{r.note}</span></Panel>
          ))}
        </div>
      </Section>

      <Section title="Definition of done" description="Nothing ships until every box is ticked. Three checklists, one release.">
        <div className="grid gap-3 md:grid-cols-3">
          {dod.map(([t, items]) => (
            <Panel key={t} className="flex flex-col gap-3">
              <span className="text-label-large">{t}</span>
              <ul className="flex flex-col gap-2">
                {items.map((i) => <li key={i} className="flex gap-2 text-body-small"><Icon name="check" size={16} className="mt-0.5 shrink-0 text-icon-success" />{i}</li>)}
              </ul>
            </Panel>
          ))}
        </div>
      </Section>

      <Section title="One number for Figma, tokens and code" description="Read the version like a traffic light.">
        <div className="grid gap-3 md:grid-cols-3">
          {versions.map((v) => (
            <Panel key={v.label} className="flex flex-col gap-2"><span className="flex items-center gap-2"><Badge tone={v.tone}>{v.label}</Badge><code className="text-code-medium">{v.v}</code></span><span className="text-body-small text-fg-secondary">{v.note}</span></Panel>
          ))}
        </div>
      </Section>

      <Section title="From request to release" description="Weekly triage. Every step leaves a trace on the Research page or in the changelog. Requests go in as GitHub issues labelled design-system.">
        <Steps items={lifecycle} />
      </Section>

      <Section title="Deprecation: mark, keep, remove" description="Nothing disappears without warning.">
        <Steps items={deprecation} />
      </Section>

      <Section title="Release health" description="The gate before every publish. All checks green, or the release waits. Last run: Nov 11, 2026 — before the v3.2.0 publish.">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {health.map(([n, t, d]) => (
            <li key={t}>
              <Panel className="flex h-full flex-col gap-1">
                <Badge tone="success">Pass</Badge>
                <span className="pt-1 text-heading-h3 tabular-nums">{n}</span>
                <span className="text-label-medium">{t}</span>
                <span className="text-caption-default text-fg-secondary">{d}</span>
              </Panel>
            </li>
          ))}
        </ul>
        <Steps items={[["Ask Claude to run the release audit", "Covers all ten checks above."], ["Fix anything red", "In Figma, then re-run."], ["Update roadmap + changelog", "Figma and this site."], ["Publish the library", "Then re-export the code kit."]]} />
      </Section>

      <FigmaOutline sections={fig.sections} nodeId={fig.id} />
      <PrevNext href="/start/governance/" />
    </>
  );
}
