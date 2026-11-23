"use client";
import { useEffect, useId, useMemo, useState, type CSSProperties } from "react";
import { Download, Link2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge, Button, Icon, Link, Select, SegmentedControl, Tabs, TextField, Toggle } from "@/components/ui";
import {
  ACCENTS, FONTS, MODES, NEUTRALS, STEPS, buildBrand, decodeInput, encodeInput, fontPackages, isHex, toCss, toDtcg, toNative, toStyle,
  type BrandResult, type Mode, type ThemeInput, type Vars,
} from "@/lib/theme/engine";
import { CopyButton } from "./preview";

/* Theme builder: a few choices → a whole DX brand. Ramps in OKLCH, roles that fix their own contrast,
   a live preview in all four colour modes, the 27-pair audit, and exports (CSS, DTCG / Figma, React Native, registry). */

export type Preset = { label: string; input: ThemeInput };
const REPO = "https://github.com/DX-Gamores/dx-design-system";
const modeLabel: Record<Mode, string> = { light: "Light", dark: "Dark", "light-hc": "Light · high contrast", "dark-hc": "Dark · high contrast" };
const radiusLabel = { none: "Square", sm: "Small", md: "Medium", lg: "Large", xl: "X-large", full: "Pill" } as const;
const neutralLabel: Record<string, string> = { gray: "Gray", slate: "Slate (cool)", zinc: "Zinc", stone: "Stone (warm)", neutral: "Neutral (pure)", tinted: "Tinted with the primary colour" };
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

function download(name: string, text: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (hex: string) => void }) {
  const id = useId();
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  const bad = !isHex(text);
  return (
    <div className="flex items-end gap-2">
      <input type="color" aria-label={`${label}: colour picker`} value={isHex(value) ? value : "#000000"} onChange={(e) => onChange(e.target.value)}
        className="h-control-md w-12 shrink-0 cursor-pointer rounded-control border border-line-strong bg-surface p-1 focus-visible:focus-ring" />
      <div className="min-w-0 flex-1">
        <TextField id={id} label={label} value={text} spellCheck={false} autoComplete="off"
          error={bad ? "Use a hex colour, like #2f7d4f" : undefined}
          onChange={(e) => { setText(e.target.value); const v = e.target.value.trim(); if (isHex(v)) onChange(v.startsWith("#") ? v.toLowerCase() : `#${v.toLowerCase()}`); }} />
      </div>
    </div>
  );
}

function Ramp({ label, steps, marks }: { label: string; steps: string[]; marks?: Record<number, string> }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-label-small text-fg-secondary">{label}</p>
      <ol className="grid grid-cols-11 gap-1" aria-label={`${label} ramp`}>
        {steps.map((hex, i) => (
          <li key={i} className="flex min-w-0 flex-col items-center gap-1">
            <span className={cn("h-9 w-full rounded-sm border border-black/5", marks?.[STEPS[i]] && "ring-2 ring-[var(--ds-color-border-focus)] ring-offset-1 ring-offset-[var(--ds-color-bg-surface)]")} style={{ background: hex }} title={`${STEPS[i]} · ${hex}`} />
            <span className="text-[10px] leading-3 text-fg-secondary tabular-nums">{STEPS[i]}</span>
            <span className="sr-only">{hex}{marks?.[STEPS[i]] ? ` (${marks[STEPS[i]]})` : ""}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** A small screen rendered with the brand in one colour mode. */
function PreviewPanel({ b, mode }: { b: BrandResult; mode: Mode }) {
  const rows = b.audit[mode], ok = rows.filter((r) => r.pass).length;
  const [on, setOn] = useState(true);
  return (
    <section aria-label={`${modeLabel[mode]} preview`} data-theme={mode} data-density={b.input.density}
      style={{ ...(toStyle(b) as CSSProperties), fontFamily: "var(--ds-font-family-body)" }}
      className="flex flex-col gap-3 rounded-container border border-line-default bg-canvas p-4 text-fg-primary">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-label-medium">{modeLabel[mode]}</h3>
        <Badge tone={ok === rows.length ? "success" : "danger"}>{ok}/{rows.length} pass</Badge>
      </div>
      <div className="flex flex-col gap-3 rounded-container border border-line-default bg-surface p-4">
        <div className="flex items-center gap-2">
          <span aria-hidden className="size-6 rounded-control bg-brand" />
          <span className="text-heading-h4">{b.input.name || "Brand"}</span>
          <Badge tone="brand" className="ms-auto">New</Badge>
        </div>
        <p className="text-body-small text-fg-secondary">Plan the season, assign crews and track every field in one place. <Link href="#preview" size="sm">Learn more</Link></p>
        <div className="flex flex-col gap-1 rounded-control bg-surface-subtle p-1" aria-hidden>
          <span className="rounded-control bg-selected px-3 py-1.5 text-label-small text-fg-brand">Dashboard</span>
          <span className="px-3 py-1.5 text-label-small text-fg-secondary">Fields</span>
        </div>
        <TextField label="Field name" placeholder="North block" size="sm" tabIndex={-1} />
        <Toggle label="Notify crew leads" checked={on} onChange={setOn} />
        <div className="flex flex-wrap gap-2">
          <Button size="sm" tabIndex={-1}>Save plan</Button>
          <Button size="sm" variant="secondary" tabIndex={-1}>Cancel</Button>
        </div>
        <p className="rounded-control border border-line-warning bg-warning-subtle px-3 py-2 text-caption-default">Irrigation check due tomorrow.</p>
      </div>
    </section>
  );
}

function Audit({ b }: { b: BrandResult }) {
  const [mode, setMode] = useState<Mode>("light");
  const rows = [...b.audit[mode]].sort((x, y) => Number(x.pass) - Number(y.pass));
  return (
    <div className="flex flex-col gap-3">
      <div className="[&_[role=radio]]:min-w-fit overflow-x-auto">
        <SegmentedControl label="Colour mode" size="sm" value={mode} onChange={setMode} options={MODES.map((m) => ({ value: m, label: modeLabel[m] }))} />
      </div>
      <div className="relative overflow-x-auto rounded-container border border-line-default bg-surface">
        <table className="w-full border-separate border-spacing-0 text-body-small">
          <caption className="sr-only">Contrast in {modeLabel[mode]}, failures first</caption>
          <thead><tr>{["Foreground", "Background", "Ratio", "Needs", "Result"].map((h) => <th key={h} scope="col" className="h-9 border-b border-line-default bg-surface-subtle px-3 text-start text-label-small text-fg-secondary">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.fg}${r.bg}`}>
                <td className="border-b border-line-default px-3 py-1.5 font-mono text-code-small">{r.fg}</td>
                <td className="border-b border-line-default px-3 py-1.5 font-mono text-code-small">{r.bg}</td>
                <td className="border-b border-line-default px-3 py-1.5 whitespace-nowrap tabular-nums">{r.ratio.toFixed(2)}:1</td>
                <td className="border-b border-line-default px-3 py-1.5 whitespace-nowrap tabular-nums">{r.min}:1 {r.kind}</td>
                <td className="border-b border-line-default px-3 py-1.5"><Badge tone={r.pass ? "success" : "danger"}>{r.pass ? "Pass" : "Fail"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CodePanel({ file, code, type, noDownload }: { file: string; code: string; type?: string; noDownload?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <code className="font-mono text-code-small text-fg-secondary">{file}</code>
        <div className="ms-auto flex gap-1">
          <CopyButton text={code} />
          {!noDownload && <Button size="sm" variant="ghost" onClick={() => download(file, code, type)}><Icon name={Download} size={16} />Download</Button>}
        </div>
      </div>
      <pre tabIndex={0} aria-label={file} className="ds-code max-h-80 overflow-auto rounded-container border border-line-default bg-surface-subtle p-4 font-mono text-code-small focus-visible:focus-ring"><code>{code}</code></pre>
    </div>
  );
}

function Exports({ b, vars, inGallery }: { b: BrandResult; vars: Vars; inGallery: boolean }) {
  const [tab, setTab] = useState("install");
  const css = useMemo(() => toCss(b), [b]);
  const dtcg = useMemo(() => toDtcg(b), [b]);
  const native = useMemo(() => toNative(vars, b), [vars, b]);
  const fonts = fontPackages(b.input);
  const inputJson = JSON.stringify({ name: b.input.name, primary: b.input.primary, accent: b.input.accent, neutral: b.input.neutral, headingFont: b.input.headingFont, bodyFont: b.input.bodyFont, radiusControl: b.input.radiusControl, radiusContainer: b.input.radiusContainer, density: b.input.density }, null, 2) + "\n";
  const ghNew = `${REPO}/new/main?filename=${encodeURIComponent(`themes/${b.slug}.json`)}&value=${encodeURIComponent(inputJson)}`;
  const install = `npx shadcn@latest add @dx/theme-${b.slug}`;
  return (
    <Tabs label="Export" value={tab} onChange={setTab} tabs={[
      {
        id: "install", label: "Install", panel: (
          <div className="flex flex-col gap-3 text-body-small">
            {inGallery ? (
              <>
                <p>This brand is in the gallery. Add it to a DX project (after <code className="font-mono">@dx/init</code>):</p>
                <CodePanel file="Terminal" code={install} noDownload />
              </>
            ) : (
              <>
                <p>To publish it as <code className="font-mono">@dx/theme-{b.slug}</code>, add it to the brand gallery. This opens a pre-filled <code className="font-mono">themes/{b.slug}.json</code> on GitHub; commit it to a new branch and open a pull request. The build checks contrast again before it can merge.</p>
                <div><a href={ghNew} target="_blank" rel="noreferrer" className="inline-flex h-control-md items-center gap-2 rounded-control bg-brand px-4 text-label-medium text-fg-on-brand hover:bg-brand-hover focus-visible:focus-ring">Add to the gallery on GitHub<Icon name="external-link" size={16} /></a></div>
                <p className="text-fg-secondary">Not ready to publish? Use the CSS tab in one project: save the file, import it after the DX tokens, and set <code className="font-mono">{`<html data-brand="${b.slug}">`}</code>.</p>
              </>
            )}
            {fonts.length > 0 && <p className="text-fg-secondary">Fonts: <code className="font-mono">{`npm i ${fonts.map((f) => `@fontsource/${f}`).join(" ")}`}</code>, then import weights 400–700.</p>}
            <p className="text-fg-secondary">Recommended: <code className="font-mono">{`<html data-brand="${b.slug}" data-density="${b.input.density}">`}</code></p>
          </div>
        ),
      },
      { id: "css", label: "CSS", panel: <CodePanel file={`dx-brand-${b.slug}.css`} code={css} type="text/css" /> },
      { id: "dtcg", label: "Tokens · Figma", panel: <div className="flex flex-col gap-2"><p className="text-body-small text-fg-secondary">DTCG JSON with the Figma Brand-collection names. Import it as a new mode of the Brand collection with a variables-import plugin, or hand it to the design lead.</p><CodePanel file={`dx-brand-${b.slug}.tokens.json`} code={dtcg} type="application/json" /></div> },
      { id: "rn", label: "React Native", panel: <CodePanel file={`dx-brand-${b.slug}.ts`} code={native} type="text/typescript" /> },
      { id: "settings", label: "Settings", panel: <div className="flex flex-col gap-2"><p className="text-body-small text-fg-secondary">The builder settings. Save as <code className="font-mono">themes/{b.slug}.json</code> to add the brand to the gallery.</p><CodePanel file={`${b.slug}.json`} code={inputJson} type="application/json" /></div> },
    ]} />
  );
}

export function ThemeBuilder({ vars, presets, gallery }: { vars: Vars; presets: Preset[]; gallery: string[] }) {
  const [input, setInput] = useState<ThemeInput>(presets[0].input);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  // Read a share link (?p=…) or a gallery brand (?brand=mangrove) once, then keep the URL in sync for sharing.
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const named = presets.find((p) => p.input.name.toLowerCase() === (q.get("brand") ?? "").toLowerCase());
    if (named) setInput(named.input);
    else if (q.get("p")) setInput(decodeInput(location.search, presets[0].input));
    setReady(true);
  }, [presets]);
  useEffect(() => { if (ready) history.replaceState(null, "", `?${encodeInput(input)}`); }, [input, ready]);

  const b = useMemo(() => buildBrand(vars, input), [vars, input]);
  const set = (patch: Partial<ThemeInput>) => setInput((i) => ({ ...i, ...patch }));
  const accentCustom = isHex(input.accent);
  const inGallery = gallery.includes(b.slug);

  return (
    <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
      <form aria-label="Brand settings" onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start">
        <Select label="Start from" value="" placeholder="Choose a brand…" onChange={(e) => { const p = presets.find((x) => x.label === e.target.value); if (p) setInput(p.input); }}
          options={presets.map((p) => ({ value: p.label, label: p.label }))} />
        <TextField label="Brand name" value={input.name} onChange={(e) => set({ name: e.target.value })} helperText={`data-brand="${b.slug}"`} />
        <ColorField label="Primary colour" value={input.primary} onChange={(primary) => set({ primary })} />
        <Select label="Accent" value={accentCustom ? "custom" : input.accent} onChange={(e) => set({ accent: e.target.value === "custom" ? "#d97706" : e.target.value })}
          options={[...ACCENTS.map((a) => ({ value: a, label: cap(a) })), { value: "custom", label: "Custom colour…" }]} />
        {accentCustom && <ColorField label="Accent colour" value={input.accent} onChange={(accent) => set({ accent })} />}
        <Select label="Neutrals" value={input.neutral} onChange={(e) => set({ neutral: e.target.value as ThemeInput["neutral"] })} options={NEUTRALS.map((n) => ({ value: n, label: neutralLabel[n] }))} />
        <Select label="Heading font" value={input.headingFont} onChange={(e) => set({ headingFont: e.target.value })} options={FONTS.map((f) => ({ value: f.family, label: f.family }))} />
        <Select label="Body font" value={input.bodyFont} onChange={(e) => set({ bodyFont: e.target.value })} options={FONTS.map((f) => ({ value: f.family, label: f.family }))} />
        <div className="[&_[role=radio]]:min-w-fit overflow-x-auto pb-1">
          <p aria-hidden className="mb-2 text-label-medium">Control corners</p>
          <SegmentedControl label="Control corners" size="sm" value={input.radiusControl} onChange={(v) => set({ radiusControl: v })}
            options={(["none", "sm", "md", "lg", "full"] as const).map((r) => ({ value: r, label: radiusLabel[r] }))} />
        </div>
        <div className="[&_[role=radio]]:min-w-fit overflow-x-auto pb-1">
          <p aria-hidden className="mb-2 text-label-medium">Card corners</p>
          <SegmentedControl label="Card corners" size="sm" value={input.radiusContainer} onChange={(v) => set({ radiusContainer: v })}
            options={(["sm", "md", "lg", "xl"] as const).map((r) => ({ value: r, label: radiusLabel[r] }))} />
        </div>
        <div className="[&_[role=radio]]:min-w-fit">
          <p aria-hidden className="mb-2 text-label-medium">Default density</p>
          <SegmentedControl label="Default density" size="sm" value={input.density} onChange={(v) => set({ density: v })} options={[{ value: "comfortable", label: "Comfortable" }, { value: "compact", label: "Compact" }]} />
        </div>
        <Button type="button" variant="secondary" onClick={() => { navigator.clipboard?.writeText(location.href).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
          <Icon name={copied ? "check" : Link2} size={16} /><span aria-live="polite">{copied ? "Link copied" : "Copy share link"}</span>
        </Button>
      </form>

      <div className="flex min-w-0 flex-col gap-8">
        <section aria-labelledby="tb-check" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="tb-check" data-toc="Contrast" className="text-heading-h3">Contrast</h2>
            <Badge tone={b.passed === b.total ? "success" : "danger"}>{b.passed}/{b.total} checks pass</Badge>
            <span className="text-body-small text-fg-secondary">27 pairs × 4 colour modes, measured as you change things.</span>
          </div>
          <p role="status" className="sr-only">{b.passed === b.total ? "All contrast checks pass." : `${b.total - b.passed} contrast checks fail.`}</p>
          {b.notes.length > 0 && (
            <ul className="flex flex-col gap-1 text-body-small text-fg-secondary">
              {b.notes.map((n) => <li key={n} className="flex gap-2"><Icon name="info" size={16} className="mt-0.5 text-icon-info" />{n}</li>)}
            </ul>
          )}
        </section>

        <section aria-labelledby="tb-ramps" className="flex flex-col gap-3">
          <h2 id="tb-ramps" data-toc="Colour ramps" className="text-heading-h3">Colour ramps</h2>
          <p className="text-body-small text-fg-secondary">
            Buttons use step {b.roles.solid} with {b.roles.onSolid === "white" ? "white" : "dark"} text, high contrast uses {b.roles.solidHc}, the focus ring {b.roles.focus}. Outlined steps are the ones the roles use.
          </p>
          <Ramp label="Primary" steps={b.ramps.primary} marks={{ [b.roles.solid]: "buttons", [b.roles.solidHc]: "high contrast", [b.roles.focus]: "focus" }} />
          <Ramp label="Accent" steps={b.ramps.accent} />
          <Ramp label="Neutral" steps={b.ramps.neutral} />
        </section>

        <section id="preview" aria-labelledby="tb-preview" className="flex flex-col gap-3">
          <h2 id="tb-preview" data-toc="Preview" className="text-heading-h3">Preview in all four modes</h2>
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">{MODES.map((m) => <PreviewPanel key={m} b={b} mode={m} />)}</div>
        </section>

        <section aria-labelledby="tb-audit" className="flex flex-col gap-3">
          <h2 id="tb-audit" data-toc="Contrast details" className="text-heading-h3">Contrast details</h2>
          <Audit b={b} />
        </section>

        <section aria-labelledby="tb-export" className="flex flex-col gap-3">
          <h2 id="tb-export" data-toc="Export" className="text-heading-h3">Export</h2>
          <Exports b={b} vars={vars} inGallery={inGallery} />
        </section>
      </div>
    </div>
  );
}
