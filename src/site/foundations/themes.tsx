"use client";
import { useEffect, useRef, useState } from "react";
import { Badge, Select } from "@/components/ui";
import { contrast, resolveColor } from "./shared";

type Kind = "text" | "ui";
// 27 pairs: what people read (text) and what they need to see to operate (UI parts, focus).
const pairs: [string, string, Kind][] = [
  ["text/primary", "bg/surface", "text"], ["text/secondary", "bg/surface", "text"], ["text/secondary", "bg/canvas", "text"],
  ["text/secondary", "bg/surface-subtle", "text"], ["text/placeholder", "bg/surface", "text"], ["text/brand", "bg/surface", "text"],
  ["text/brand", "bg/brand-subtle", "text"], ["text/on-brand", "bg/brand", "text"], ["text/on-brand", "bg/brand-hover", "text"],
  ["text/danger", "bg/surface", "text"], ["text/danger", "bg/danger-subtle", "text"], ["text/success", "bg/surface", "text"],
  ["text/success", "bg/success-subtle", "text"], ["text/warning", "bg/surface", "text"], ["text/warning", "bg/warning-subtle", "text"],
  ["text/info", "bg/info-subtle", "text"], ["text/on-color", "bg/danger", "text"], ["text/on-warning", "bg/warning", "text"],
  ["text/inverse", "bg/inverse", "text"],
  ["border/strong", "bg/surface", "ui"], ["border/focus", "bg/surface", "ui"], ["border/focus", "bg/canvas", "ui"],
  ["icon/secondary", "bg/surface", "ui"], ["icon/brand", "bg/surface", "ui"], ["border/danger", "bg/surface", "ui"],
  ["bg/control-off", "bg/surface", "ui"], ["border/selected", "bg/surface", "ui"],
];
const brands = ["default", "violet", "amber"];
const themes = ["light", "dark", "light-hc", "dark-hc"];
const need = (k: Kind, theme: string) => (theme.endsWith("hc") ? (k === "text" ? 7 : 4.5) : k === "text" ? 4.5 : 3);
const v = (t: string) => `var(--ds-color-${t.replace("/", "-")})`;
type Row = { fg: string; bg: string; kind: Kind; ratio: number; min: number };

/** Figma 03 · Contrast audit, measured live from the CSS variables for every brand × colour mode. */
export function ContrastAudit() {
  const host = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<Record<string, Row[]>>({});
  const [sel, setSel] = useState("default/light");
  useEffect(() => {
    const out: Record<string, Row[]> = {};
    for (const b of brands) for (const t of themes) {
      const el = document.createElement("div");
      el.dataset.brand = b; el.dataset.theme = t;
      host.current!.appendChild(el);
      out[`${b}/${t}`] = pairs.map(([fg, bg, kind]) => {
        const a = resolveColor(v(fg), el), c = resolveColor(v(bg), el);
        return { fg, bg, kind, ratio: a && c ? contrast(a, c) : 0, min: need(kind, t) };
      });
      el.remove();
    }
    setResults(out);
  }, []);
  const total = Object.values(results).flat();
  const passed = total.filter((r) => r.ratio >= r.min).length;
  const rows = results[sel] ?? [];
  const [b, t] = sel.split("/");
  return (
    <div className="flex flex-col gap-4">
      <div ref={host} hidden />
      {total.length > 0 && (
        <p className="flex flex-wrap items-center gap-2 text-body-medium">
          <Badge tone={passed === total.length ? "success" : "danger"}>{`${passed} / ${total.length} pass`}</Badge>
          {pairs.length} pairs × {brands.length} brands × {themes.length} modes, measured in your browser from the live tokens. Text ≥ 4.5:1 and UI ≥ 3:1; high-contrast modes ≥ 7:1 and ≥ 4.5:1.
        </p>
      )}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {brands.flatMap((br) => themes.map((th) => {
          const k = `${br}/${th}`, list = results[k] ?? [];
          const ok = list.filter((r) => r.ratio >= r.min).length;
          const lowest = list.length ? Math.min(...list.map((r) => r.ratio / r.min)) : 0;
          return (
            <button key={k} type="button" onClick={() => setSel(k)} aria-pressed={sel === k}
              className={`flex flex-col gap-1 rounded-container border p-3 text-left focus-visible:focus-ring ${sel === k ? "border-line-selected bg-selected" : "border-line-default bg-surface hover:border-line-hover"}`}>
              <span className="text-label-medium">{br} · {th}</span>
              <span className="text-caption-default text-fg-secondary">{list.length ? `${ok}/${list.length} · tightest ${lowest.toFixed(2)}× the minimum` : "Measuring…"}</span>
            </button>
          );
        }))}
      </div>
      <div className="max-w-xs">
        <Select label="Show pairs for" value={sel} onChange={(e) => setSel(e.target.value)} options={brands.flatMap((br) => themes.map((th) => ({ value: `${br}/${th}`, label: `${br} · ${th}` })))} />
      </div>
      <div className="overflow-x-auto rounded-container border border-line-default bg-surface">
        <table className="w-full text-body-small">
          <thead className="bg-surface-subtle text-left text-label-small"><tr><th className="px-3 py-2">Sample</th><th className="px-3 py-2">Foreground</th><th className="px-3 py-2">Background</th><th className="px-3 py-2 text-right">Ratio</th><th className="px-3 py-2 text-right">Needs</th><th className="px-3 py-2">Result</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.fg + r.bg} className="border-t border-line-default">
                <td className="px-3 py-2">
                  <span data-brand={b} data-theme={t} className="inline-flex h-8 w-16 items-center justify-center rounded-md border border-line-default text-label-medium" style={{ background: v(r.bg), color: v(r.fg) }}>
                    {r.kind === "text" ? "Aa" : <span className="block h-3 w-8 rounded-sm" style={{ background: v(r.fg) }} />}
                  </span>
                </td>
                <td className="px-3 py-2"><code className="text-code-small">{r.fg}</code></td>
                <td className="px-3 py-2"><code className="text-code-small">{r.bg}</code></td>
                <td className="px-3 py-2 text-right tabular-nums">{r.ratio.toFixed(2)}:1</td>
                <td className="px-3 py-2 text-right tabular-nums text-fg-secondary">{r.min}:1</td>
                <td className="px-3 py-2">{r.ratio >= r.min ? <Badge tone="success">Pass</Badge> : <Badge tone="danger">Fail</Badge>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
