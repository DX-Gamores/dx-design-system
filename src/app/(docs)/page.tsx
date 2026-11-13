import Link from "next/link";
import { Badge, Button, Icon, buttonClass, type IconName } from "@/components/ui";
import { figmaPage, nav, stats, VERSION } from "@/site/content";
import { FigmaOutline, Panel, PrevNext, Section } from "@/site/blocks";

// Mirrors the Figma "Getting Started" page: at a glance, how it's built, principles, paths, file map, naming.
export default function Overview() {
  const s = stats();
  const fig = figmaPage("Getting Started");
  const tiles: [string | number, string][] = [
    [s.pages, "Figma pages mirrored here"],
    [s.specs, "Component specs"],
    [s.coded, "Coded in React"],
    [s.icons, "Icons in code · 24px grid"],
    [s.variables, `Variables in ${s.collections} collections`],
    [s.brands * s.modes, `Themes · ${s.brands} brands × ${s.modes} colour modes`],
  ];
  const layers = [
    ["Layer 1", "Primitive", "color/blue/600", "Raw palette value. Hidden from pickers."],
    ["Layer 2", "Brand", "brand/primary/600", "Default = blue · Violet = violet · Amber = amber."],
    ["Layer 3", "Semantic", "color/bg/brand", "Named by purpose. Has Light, Dark and HC values."],
    ["Layer 4", "Component", "button/primary/bg", "What ships. Re-skins when any layer changes."],
  ];
  const principles: [IconName, string, string][] = [
    ["check-circle", "Tokens before pixels", "Used twice? It becomes a token. No hex or px in components."],
    ["star", "Semantic over raw", "Name by purpose, not appearance. Meaning survives rebrands."],
    ["eye", "Accessible by default", "Text ≥ 4.5:1, UI ≥ 3:1, visible focus everywhere."],
    ["chart", "Start small, grow deliberately", "Ship the minimum, learn, then add — through the changelog."],
  ];
  const paths: { icon: IconName; who: string; steps: string[]; links: [string, string][] }[] = [
    { icon: "edit", who: "Designer", steps: ["Pick semantic tokens only", "Insert components from Assets", "Switch modes on the frame, not colours"], links: [["Foundations", "/foundations/overview/"], ["Button", "/actions/button/"]] },
    { icon: "settings", who: "Developer", steps: ["Install the kit from GitHub", "Import tokens.css + tailwind.css once", "Read the spec, use or copy the component"], links: [["Getting started", "/start/getting-started/"], ["Gallery", "/start/gallery/"]] },
    { icon: "chart", who: "Client / stakeholder", steps: ["See one screen in 12 themes", "Scan the roadmap", "Check release health"], links: [["Themes", "/foundations/themes-and-brands/"], ["Governance", "/start/governance/"]] },
    { icon: "home", who: "New hire", steps: ["Read this page (5 min)", "Open one component page", "Build a screen from the starter app"], links: [["Starter app", "/starter/"], ["Changelog", "/start/changelog/"]] },
  ];

  return (
    <>
      <header className="flex flex-col gap-4 border-b border-line-default pb-10">
        <p className="text-label-small tracking-wide text-fg-brand uppercase">Design system · v{VERSION} · November 2026</p>
        <h1 className="text-display-large">DX Design System</h1>
        <p className="max-w-[60ch] text-body-large text-fg-secondary">
          Tokens first, components second. One system — any brand, light or dark. This site mirrors the Figma library page for page, so nobody needs a Figma seat to build with it.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link href="/start/getting-started/" className={buttonClass()}>Get started</Link>
          <Link href="/start/gallery/" className={buttonClass({ variant: "secondary" })}>Component gallery</Link>
          <Link href="/starter/" className={buttonClass({ variant: "ghost" })}>Starter app <Icon name="arrow-right" /></Link>
        </div>
      </header>

      <Section title="At a glance" description="Counted from the Figma export at build time.">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {tiles.map(([n, label]) => (
            <Panel key={label} className="flex flex-col gap-1">
              <span className="text-heading-h1 tabular-nums">{n}</span>
              <span className="text-body-small text-fg-secondary">{label}</span>
            </Panel>
          ))}
        </div>
      </Section>

      <Section title="How it's built" description="Follow one colour from raw value to button. Each layer only points at the layer before it. Designers and components use layer 3 — never raw values.">
        <ol className="grid gap-3 md:grid-cols-4">
          {layers.map(([n, name, token, note], i) => (
            <li key={n} className="flex flex-col gap-2 rounded-container border border-line-default bg-surface p-4">
              <span className="text-caption-default text-fg-secondary">{n}{i < 3 && <span aria-hidden> →</span>}</span>
              <span className="text-label-large">{name}</span>
              <code className="w-fit rounded-sm bg-surface-subtle px-1.5 py-0.5 text-code-small">{token}</code>
              <span className="text-body-small text-fg-secondary">{note}</span>
              {i === 3 && <div><Button size="sm">Save</Button></div>}
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Four rules">
        <div className="grid gap-3 md:grid-cols-2">
          {principles.map(([icon, t, d]) => (
            <Panel key={t} className="flex gap-3">
              <Icon name={icon} size={24} className="mt-0.5 shrink-0 text-icon-brand" />
              <div className="flex flex-col gap-1"><span className="text-label-large">{t}</span><span className="text-body-small text-fg-secondary">{d}</span></div>
            </Panel>
          ))}
        </div>
      </Section>

      <Section title="Start where your job starts" description="Three steps each. Follow the links to the right page.">
        <div className="grid gap-3 md:grid-cols-2">
          {paths.map((p) => (
            <Panel key={p.who} className="flex flex-col gap-3">
              <span className="flex items-center gap-2 text-label-large"><Icon name={p.icon} className="text-icon-brand" />{p.who}</span>
              <ol className="flex flex-col gap-2">
                {p.steps.map((st, i) => (
                  <li key={st} className="flex gap-3 text-body-small">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-subtle text-label-small text-fg-brand">{i + 1}</span>
                    <span className="pt-0.5">{st}</span>
                  </li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-2">
                {p.links.map(([l, h]) => <Link key={h} href={h} className="text-label-small text-fg-brand underline underline-offset-2 focus-visible:focus-ring">{l} →</Link>)}
              </div>
            </Panel>
          ))}
        </div>
      </Section>

      <Section title="Where everything lives" description="Same groups and order as the Figma file. Every component page has the same layout: live example, the Figma outline, then the spec.">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {nav.map((g) => (
            <Panel key={g.slug} className="flex flex-col gap-2">
              <span className="flex items-center justify-between gap-2"><span className="text-label-large">{g.title}</span><Badge>{String(g.items.length)}</Badge></span>
              <ul className="flex flex-wrap gap-x-2 gap-y-1 text-body-small">
                {g.items.map((i) => <li key={i.href}><Link href={i.href} className="text-fg-secondary hover:text-fg-brand hover:underline focus-visible:focus-ring">{i.title}</Link></li>)}
              </ul>
            </Panel>
          ))}
        </div>
      </Section>

      <Section title="Read a name like a sentence">
        <div className="grid gap-3 md:grid-cols-2">
          <Panel className="flex flex-col gap-2">
            <span className="text-caption-default text-fg-secondary">Variable</span>
            <code className="text-code-medium">color / bg / brand-hover</code>
            <span className="text-body-small text-fg-secondary">category / role / variant → <code className="text-code-small">--ds-color-bg-brand-hover</code> → <code className="text-code-small">bg-brand-hover</code></span>
          </Panel>
          <Panel className="flex flex-col gap-2">
            <span className="text-caption-default text-fg-secondary">Component variant</span>
            <code className="text-code-medium">Variant=Primary, State=Hover, Size=Medium</code>
            <span className="text-body-small text-fg-secondary">property = value → <code className="text-code-small">{`<Button variant="primary" size="md">`}</code> (state comes from the browser)</span>
          </Panel>
        </div>
      </Section>

      <FigmaOutline sections={fig.sections} nodeId={fig.id} />
      <PrevNext href="/" />
    </>
  );
}
