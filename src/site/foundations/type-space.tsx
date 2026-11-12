"use client";
import { useEffect, useState } from "react";
import { Button, Checkbox, TextField } from "@/components/ui";
import { CopyText, useThemeVersion } from "./shared";
import type { TextStyle } from "../tokens-data";

const fontByBrand: Record<string, string> = { default: "Inter", violet: "Manrope", amber: "Poppins" };

/** Figma 04 · Typography: 16 styles rendered with the real utilities. */
export function Typography({ styles }: { styles: TextStyle[] }) {
  useThemeVersion();
  const [brand, setBrand] = useState("default");
  useEffect(() => { setBrand(document.documentElement.dataset.brand || "default"); });
  return (
    <div className="flex flex-col gap-4">
      <p className="text-body-small text-fg-secondary">
        Showing the <strong>{brand}</strong> brand ({fontByBrand[brand] ?? "Inter"}; code in Roboto Mono). Switch brand in the header to see its type. Headings step down on tablet (&lt; 1024px) and mobile (&lt; 600px).
      </p>
      <ul className="flex flex-col divide-y divide-line-default rounded-container border border-line-default bg-surface">
        {styles.map((s) => (
          <li key={s.name} className="grid gap-2 p-4 md:grid-cols-[200px_1fr] md:items-baseline md:gap-6">
            <span className="flex flex-col gap-0.5">
              <span className="text-label-medium">{s.name}</span>
              <span className="text-caption-default text-fg-secondary">{s.size} / {s.lh} · {s.weight}</span>
              <CopyText text={s.cls} className="-ml-1 w-fit" />
            </span>
            <span className={`${s.cls} min-w-0 break-words`}>
              {s.name.startsWith("Code") ? 'const token = "color/bg/brand";' : s.size >= 36 ? "Design once, ship everywhere" : "The quick brown fox jumps over the lazy dog — 0123456789"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Figma 05 · Spacing & density. */
export function Spacing({ steps }: { steps: { name: string; css: string; comfortable: number; compact: number }[] }) {
  const max = Math.max(...steps.map((s) => s.comfortable));
  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-2">
        {steps.map((s) => (
          <li key={s.name} className="grid grid-cols-[110px_56px_1fr] items-center gap-3 sm:grid-cols-[130px_72px_1fr]">
            <code className="text-code-small">{s.name}</code>
            <span className="text-caption-default text-fg-secondary tabular-nums">{s.comfortable}px</span>
            <span className="h-4 rounded-sm bg-[#e11d74]/70" style={{ width: `${(s.comfortable / max) * 100}%`, minWidth: 2 }} />
          </li>
        ))}
      </ul>
      <p className="text-body-small text-fg-secondary">Names are multipliers of 4 — <code className="text-code-small">spacing/4</code> = 16px = Tailwind <code className="text-code-small">p-4</code>. The scale is the same in both densities; Compact shrinks control heights and padding.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {(["comfortable", "compact"] as const).map((d) => (
          <div key={d} className="flex flex-col gap-2">
            <span className="text-label-small tracking-wide text-fg-secondary uppercase">{d} {d === "comfortable" ? "· 40px controls" : "· 32px controls"}</span>
            <div data-density={d} className="flex flex-col gap-3 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)]">
              <TextField label="Email" defaultValue="gab@dxform.ph" />
              <Checkbox label="Remember me" defaultChecked />
              <div className="flex justify-end gap-2"><Button variant="secondary">Cancel</Button><Button>Sign in</Button></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type Shadow = { n: string; e: { x: number; y: number; r: number; sp: number; c: string }[] };
const useFor: Record<string, string> = { "Elevation/1": "Hovered cards, sticky headers", "Elevation/2": "Raised cards, dropdowns", "Elevation/3": "Dialogs, popovers, toasts" };
/** Figma 06 · Shape & depth. */
export function ShapeDepth({ radii, shadows, z }: { radii: { name: string; css: string; px: number }[]; shadows: Shadow[]; z: { name: string; css: string; value: number }[] }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h3 className="text-heading-h4">Corners</h3>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {radii.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-2">
              <span className="size-16 border-2 border-line-strong bg-brand-subtle" style={{ borderRadius: `var(${r.css})` }} />
              <code className="text-code-small">{r.name.split("/")[1]}</code>
              <span className="text-caption-default text-fg-secondary">{r.px >= 999 ? "full" : `${r.px}px`}</span>
            </div>
          ))}
        </div>
        <p className="text-body-small text-fg-secondary">Brands change corner style through <code className="text-code-small">shape/radius-control</code> (<code className="text-code-small">rounded-control</code>) and <code className="text-code-small">shape/radius-container</code> (<code className="text-code-small">rounded-container</code>) — Amber is round. Switch to Amber to see these buttons change:</p>
        <div className="flex flex-wrap items-center gap-3"><Button>Control radius</Button><span className="rounded-container border border-line-default bg-surface px-4 py-3 text-body-small">Container radius</span></div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-heading-h4">Elevation</h3>
        <div className="grid gap-4 rounded-container bg-canvas p-6 sm:grid-cols-3">
          {shadows.map((s, i) => (
            <div key={s.n} className="flex flex-col gap-1 rounded-container bg-surface p-4" style={{ boxShadow: `var(--ds-shadow-elevation-${i + 1})` }}>
              <span className="text-label-large">{s.n}</span>
              <span className="text-body-small text-fg-secondary">{useFor[s.n]}</span>
              <CopyText text={`shadow-elevation-${i + 1}`} className="-ml-1 mt-2 w-fit" />
            </div>
          ))}
        </div>
        <p className="text-body-small text-fg-secondary">Shadows are for things that float. Cards on a surface stay flat; dark mode uses stronger shadow colours so depth still reads.</p>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-heading-h4">Layer order</h3>
        <ol className="flex flex-col-reverse gap-1">
          {z.map((l, i) => (
            <li key={l.name} className="flex items-center gap-3 rounded-md border border-line-default bg-surface px-3 py-2" style={{ marginLeft: `${i * 16}px` }}>
              <code className="text-code-small">{l.name}</code><span className="text-caption-default text-fg-secondary tabular-nums">{l.value}</span>
              <span className="ml-auto text-caption-default text-fg-secondary">{`z-[var(${l.css})]`}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
