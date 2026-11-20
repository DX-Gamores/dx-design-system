"use client";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { Button, Chip, SearchField, SegmentedControl, Select } from "@/components/ui";
import type { TokenRow } from "./token-data";
import { CopyButton } from "./preview";

/* Token explorer: search all Figma variables, filter by tier, see the value in any brand × color mode,
   and copy the token as CSS, Tailwind, React Native or its raw value. */

type Format = "css" | "tailwind" | "rn" | "value";
const tiers = ["Semantic", "Component", "Brand", "Foundation", "Primitive"];
const PAGE = 50;

export function TokenExplorer({ rows, brands, modes }: { rows: TokenRow[]; brands: readonly string[]; modes: readonly string[] }) {
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<string | null>("Semantic");
  const [brand, setBrand] = useState(0);
  const [mode, setMode] = useState(0);
  const [format, setFormat] = useState<Format>("css");
  const [limit, setLimit] = useState(PAGE);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return rows.filter((r) => (!tier || r.tier === tier) && (!t || r.name.toLowerCase().includes(t) || r.css.includes(t) || (r.tailwind ?? "").includes(t)));
  }, [rows, q, tier]);
  const shown = filtered.slice(0, limit);
  const valueOf = (r: TokenRow) => {
    const v = r.values.length > 1 ? r.values[brand][mode] : r.values[0][Math.min(mode, r.values[0].length - 1)];
    return r.type === "number" && typeof v === "number" ? (/opacity/.test(r.name) ? `${v}%` : /^(z|font-weight|layout\/columns|spring)/.test(r.name) ? String(v) : /duration/.test(r.name) ? `${v}ms` : `${Math.round(v * 100) / 100}px`) : String(v);
  };
  const copyText = (r: TokenRow) => (format === "css" ? `var(${r.css})` : format === "tailwind" ? r.tailwind ?? `var(${r.css})` : format === "rn" ? r.rn ?? "" : valueOf(r));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <SearchField label="Search tokens" value={q} onChange={(v) => { setQ(v); setLimit(PAGE); }} placeholder="e.g. surface, brand, radius" />
        <Select label="Brand" value={String(brand)} onChange={(e) => setBrand(Number(e.target.value))} options={brands.map((b, i) => ({ value: String(i), label: b }))} />
        <Select label="Color mode" value={String(mode)} onChange={(e) => setMode(Number(e.target.value))} options={modes.map((m, i) => ({ value: String(i), label: m }))} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Tier" className="flex flex-wrap gap-2">
          <Chip selected={tier === null} onToggle={() => { setTier(null); setLimit(PAGE); }}>All</Chip>
          {tiers.map((t) => <Chip key={t} selected={tier === t} onToggle={(on) => { setTier(on ? t : null); setLimit(PAGE); }}>{t}</Chip>)}
        </div>
        <div className="shrink-0 [&_[role=radio]]:min-w-fit"><SegmentedControl label="Copy as" size="sm" value={format} onChange={setFormat} options={[{ value: "css", label: "CSS" }, { value: "tailwind", label: "Tailwind" }, { value: "rn", label: "React Native" }, { value: "value", label: "Value" }]} /></div>
      </div>
      <p className="text-caption-default text-fg-secondary" aria-live="polite">{`${filtered.length} tokens${tier ? ` · ${tier}` : ""}${q ? ` matching “${q}”` : ""}`}</p>

      <div className="overflow-x-auto rounded-container border border-line-default bg-surface">
        <table className="w-full text-body-small">
          <caption className="sr-only">Design tokens</caption>
          <thead className="bg-surface-subtle text-left text-label-small">
            <tr>
              <th scope="col" className="px-3 py-2">Token</th>
              <th scope="col" className="px-3 py-2">Value</th>
              <th scope="col" className="px-3 py-2">{format === "css" ? "CSS" : format === "tailwind" ? "Tailwind" : format === "rn" ? "React Native" : "Raw value"}</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => {
              const v = valueOf(r);
              const raw = r.raw[r.modes.length > 1 ? (r.collection === "Brand" ? brand : mode) % r.raw.length : 0];
              const text = copyText(r);
              return (
                <tr key={r.name} className="border-t border-line-default align-top">
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-label-medium break-all">{r.name}</span>
                      <span className="text-caption-default text-fg-secondary">{r.collection}{r.modes.length > 1 ? ` · ${r.modes.length} modes` : ""}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {r.type === "color" && <span aria-hidden className="size-5 shrink-0 rounded-sm border border-line-default" style={{ background: v }} />}
                      <span className="flex flex-col">
                        <code className="text-code-small">{v}</code>
                        {raw.startsWith("→") && <span className="text-caption-default text-fg-secondary break-all">{raw}</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <code className={cn("text-code-small break-all", !text && "text-fg-secondary")}>{text || "—"}</code>
                      {text && <CopyButton text={text} label="Copy" className="ms-auto shrink-0" />}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filtered.length > limit && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => setLimit((l) => l + PAGE)}>{`Show ${Math.min(PAGE, filtered.length - limit)} more`}</Button>
        </div>
      )}
    </div>
  );
}
