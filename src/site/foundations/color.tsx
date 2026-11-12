"use client";
import { useEffect, useState } from "react";
import { Alert, Badge, Button } from "@/components/ui";
import { CopyText, LiveHex, Swatch, useThemeVersion } from "./shared";
import type { ColorToken } from "../tokens-data";

const Callout = ({ n, className = "" }: { n: number; className?: string }) => (
  <span aria-hidden className={`absolute z-10 grid size-5 place-items-center rounded-full bg-[#e11d74] text-[11px] font-semibold text-white ring-2 ring-white ${className}`}>{n}</span>
);

/** Figma 01 · Color roles: the same mock in light and dark, numbered. */
export function ColorRoles() {
  useThemeVersion();
  const [brand, setBrand] = useState("default");
  useEffect(() => { setBrand(document.documentElement.dataset.brand || "default"); });
  const legend = [
    ["color/bg/canvas", "Page background behind everything"],
    ["color/bg/surface-subtle", "Quiet areas: headers of cards, table heads, wells"],
    ["color/bg/surface", "Cards, panels, inputs — where content sits"],
    ["color/border/default", "Dividers and container edges"],
    ["color/text/primary", "Titles and body text"],
    ["color/text/secondary", "Supporting text, helper text, captions"],
    ["color/bg/brand", "The one primary action, selected states"],
    ["color/text/brand", "Links and brand-coloured text"],
  ];
  const Mock = ({ theme }: { theme: string }) => (
    <div className="flex flex-col gap-2">
      <span className="text-label-small tracking-wide text-fg-secondary uppercase">{theme}</span>
      <div data-brand={brand} data-theme={theme} className="relative rounded-container bg-canvas p-6 text-fg-primary">
        <Callout n={1} className="top-2 left-2" />
        <div className="relative rounded-container border border-line-default bg-surface">
          <Callout n={4} className="-top-2.5 right-12" />
          <div className="relative rounded-t-container bg-surface-subtle px-4 py-3">
            <Callout n={2} className="top-1 right-2" />
            <span className="relative text-label-large">Quarterly review<Callout n={5} className="-top-2 -right-6" /></span>
          </div>
          <div className="relative flex flex-col gap-3 p-4">
            <Callout n={3} className="top-1 right-2" />
            <p className="relative w-fit text-body-small text-fg-secondary">Three reports are ready to share with your team.<Callout n={6} className="-top-2 -right-6" /></p>
            <div className="flex items-center gap-4">
              <span className="relative"><Button size="sm">Share</Button><Callout n={7} className="-top-2 -right-2" /></span>
              <span className="relative text-label-medium text-fg-brand underline underline-offset-2">View details<Callout n={8} className="-top-3 -right-5" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2"><Mock theme="light" /><Mock theme="dark" /></div>
      <ol className="grid gap-2 sm:grid-cols-2">
        {legend.map(([t, d], i) => (
          <li key={t} className="flex items-start gap-3 rounded-md p-2">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#e11d74] text-[12px] font-semibold text-white">{i + 1}</span>
            <span className="flex flex-col"><code className="text-code-small">{t}</code><span className="text-body-small text-fg-secondary">{d}</span></span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const statusOrder = ["info", "success", "warning", "danger"] as const;
const alertCopy = { info: ["New version", "v3.2 is available."], success: ["Saved", "All changes are live."], warning: ["Check this", "2 tokens are unused."], danger: ["Failed", "Upload didn’t finish."] };
/** Figma 02 · Status colors: four meanings × solid / subtle / text. */
export function StatusColors() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {statusOrder.map((s) => (
        <div key={s} className="flex flex-col gap-3 rounded-container border border-line-default bg-surface p-4">
          <span className="text-label-large capitalize">{s}</span>
          <div className="grid grid-cols-3 gap-2">
            {[["solid", `--ds-color-bg-${s}`], ["subtle", `--ds-color-bg-${s}-subtle`], ["text", `--ds-color-text-${s}`]].map(([k, css]) => (
              <div key={k} className="flex flex-col gap-1">
                <Swatch css={css} className="h-10 w-full" />
                <span className="text-caption-default">{k}</span>
                <LiveHex css={css} />
              </div>
            ))}
          </div>
          <Alert tone={s} title={alertCopy[s][0]}>{alertCopy[s][1]}</Alert>
        </div>
      ))}
    </div>
  );
}

const groupInfo: Record<string, { title: string; hint: string }> = {
  bg: { title: "Backgrounds", hint: "bg-*" },
  text: { title: "Text", hint: "text-fg-*" },
  border: { title: "Borders", hint: "border-line-*" },
  icon: { title: "Icons", hint: "text-icon-*" },
  category: { title: "Categories (tags, avatars)", hint: "bg-cat-*" },
};
/** Every semantic colour token with its Tailwind class, CSS variable and live value. */
export function SemanticColors({ groups }: { groups: Record<string, ColorToken[]> }) {
  const keys = Object.keys(groupInfo).filter((k) => groups[k]);
  const [g, setG] = useState(keys[0]);
  const list = groups[g] ?? [];
  const preview = (t: ColorToken) => {
    if (g === "text") return <span className="grid size-10 shrink-0 place-items-center rounded-md border border-line-default bg-surface text-label-large" style={{ color: `var(${t.css})` }}>Aa</span>;
    if (g === "border") return <span className="size-10 shrink-0 rounded-md border-2 bg-surface" style={{ borderColor: `var(${t.css})` }} />;
    if (g === "icon") return <span className="grid size-10 shrink-0 place-items-center rounded-md border border-line-default bg-surface" style={{ color: `var(${t.css})` }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></svg></span>;
    return <Swatch css={t.css} />;
  };
  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="Token group" className="flex flex-wrap gap-2">
        {keys.map((k) => (
          <button key={k} type="button" aria-pressed={g === k} onClick={() => setG(k)}
            className={`h-control-sm rounded-full border px-3 text-label-small focus-visible:focus-ring ${g === k ? "border-line-selected bg-selected text-fg-brand" : "border-line-default bg-surface hover:bg-neutral-hover"}`}>
            {groupInfo[k].title} · {groups[k].length}
          </button>
        ))}
      </div>
      <p className="text-body-small text-fg-secondary">{list.length} tokens · Tailwind <code className="text-code-small">{groupInfo[g].hint}</code> · values update with the theme switcher.</p>
      <div className="overflow-x-auto rounded-container border border-line-default bg-surface">
        <table className="w-full text-body-small">
          <thead className="bg-surface-subtle text-left text-label-small">
            <tr><th className="px-3 py-2">Token</th><th className="px-3 py-2">Tailwind</th><th className="px-3 py-2">CSS variable</th><th className="px-3 py-2">Now</th></tr>
          </thead>
          <tbody>
            {list.map((t) => (
              <tr key={t.name} className="border-t border-line-default">
                <td className="px-3 py-2"><span className="flex items-center gap-3">{preview(t)}<code className="text-code-small">{t.name.replace(/^color\//, "")}</code></span></td>
                <td className="px-3 py-2">{t.tw && <CopyText text={t.tw} />}</td>
                <td className="px-3 py-2"><CopyText text={`var(${t.css})`}>{t.css}</CopyText></td>
                <td className="px-3 py-2"><LiveHex css={t.css} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Figma 03 · Palette: 22 ramps × 11 steps. */
export function Palette({ ramps, brands }: { ramps: { ramp: string; steps: { step: string; hex: string; css: string }[] }[]; brands: { mode: string; primary: string; neutral: string }[] }) {
  const tag = (r: string) => brands.filter((b) => b.primary === r).map((b) => b.mode.replace("Sample · ", ""));
  const neutral = (r: string) => brands.filter((b) => b.neutral === r).map((b) => b.mode.replace("Sample · ", ""));
  return (
    <div className="flex flex-col gap-1 overflow-x-auto">
      <div className="grid min-w-[760px] grid-cols-[96px_repeat(11,1fr)] gap-1 text-caption-default text-fg-secondary">
        <span />
        {ramps[0].steps.map((s) => <span key={s.step} className="text-center">{s.step}</span>)}
      </div>
      {ramps.map(({ ramp, steps }) => (
        <div key={ramp} className="grid min-w-[760px] grid-cols-[96px_repeat(11,1fr)] items-center gap-1">
          <span className="flex flex-col text-label-small">
            {ramp}
            {tag(ramp).map((b) => <span key={b} className="text-caption-default text-fg-brand">{b} brand</span>)}
            {neutral(ramp).map((b) => <span key={b} className="text-caption-default text-fg-secondary">{b} neutral</span>)}
          </span>
          {steps.map((s) => (
            <span key={s.step} title={`color/${ramp}/${s.step} · ${s.hex}`} className="group relative h-9 rounded-sm" style={{ background: s.hex }}>
              <span className="pointer-events-none absolute inset-x-0 -bottom-0.5 hidden translate-y-full rounded-sm bg-inverse px-1 py-0.5 text-center font-mono text-[10px] text-fg-inverse group-hover:block">{s.hex}</span>
            </span>
          ))}
        </div>
      ))}
      <p className="pt-2 text-body-small text-fg-secondary">Primitives are hidden from pickers — reach them through Brand and Semantic tokens. Hover a swatch for its hex. The first five rows are grays; each brand picks one as its neutral.</p>
      <div className="flex flex-wrap gap-2 pt-1">{brands.map((b) => <Badge key={b.mode} tone="brand">{`${b.mode}: ${b.primary} + ${b.neutral}`}</Badge>)}</div>
    </div>
  );
}
