"use client";
import { Icon } from "@/components/ui";
import { CopyText, LiveHex, Swatch } from "./shared";

const series = Array.from({ length: 8 }, (_, i) => `--ds-color-dataviz-series-${i + 1}`);
const seq = Array.from({ length: 5 }, (_, i) => `--ds-color-dataviz-sequential-${i + 1}`);
const div = ["neg-2", "neg-1", "mid", "pos-1", "pos-2"].map((k) => `--ds-color-dataviz-diverging-${k}`);

// Machado, Oliveira & Fernandes (2009), severity 1.0 — applied in linear RGB (SVG filter default).
const cvd = {
  Protanopia: "0.152286 1.052583 -0.204868 0 0  0.114503 0.786281 0.099216 0 0  -0.003882 -0.048116 1.051998 0 0  0 0 0 1 0",
  Deuteranopia: "0.367322 0.860646 -0.227968 0 0  0.280085 0.672501 0.047413 0 0  -0.011820 0.042940 0.968881 0 0  0 0 0 1 0",
  Tritanopia: "1.255528 -0.076749 -0.178779 0 0  -0.078411 0.930809 0.147602 0 0  0.004733 -0.479748 1.475015 0 0  0 0 0 1 0",
};

export function Categorical() {
  return (
    <div className="flex flex-col gap-3">
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {series.map((c, i) => (
          <li key={c} className="flex items-center gap-3 rounded-container border border-line-default bg-surface p-3">
            <Swatch css={c} />
            <span className="flex flex-col"><span className="text-label-medium">series-{i + 1}</span><LiveHex css={c} /></span>
          </li>
        ))}
      </ol>
      <p className="text-body-small text-fg-secondary">Use them in order — series-1 first. The tokens adapt per colour mode, so switch the theme in the header to see the dark and high-contrast versions.</p>
    </div>
  );
}

export function ColorBlindCheck() {
  return (
    <div className="flex flex-col gap-3">
      <svg width="0" height="0" className="absolute" aria-hidden>
        {Object.entries(cvd).map(([k, m]) => <filter key={k} id={`cvd-${k}`}><feColorMatrix type="matrix" values={m} /></filter>)}
      </svg>
      {(["Normal vision", ...Object.keys(cvd)] as string[]).map((k) => (
        <div key={k} className="grid items-center gap-2 sm:grid-cols-[140px_1fr]">
          <span className="text-label-medium">{k}</span>
          <div className="flex gap-1" style={k in cvd ? { filter: `url(#cvd-${k})` } : undefined}>
            {series.map((c, i) => (
              <span key={c} className="flex h-10 flex-1 items-end justify-center rounded-sm pb-1 text-[11px] font-semibold text-white" style={{ background: `var(${c})`, opacity: i < 4 ? 1 : 0.95 }}>{i + 1}</span>
            ))}
          </div>
        </div>
      ))}
      <p className="text-body-small text-fg-secondary">Simulated in your browser (Machado 2009, full severity). Series 1–4 stay apart for everyone; from series 5 on, label lines and bars directly instead of relying on a legend.</p>
    </div>
  );
}

export function SeqDiv() {
  const Row = ({ title, list, note }: { title: string; list: string[]; note: string }) => (
    <div className="flex flex-col gap-2">
      <span className="text-label-large">{title}</span>
      <div className="flex gap-1">{list.map((c) => <span key={c} className="flex min-w-0 flex-1 flex-col gap-1"><Swatch css={c} className="h-12 w-full" /><code className="truncate text-[11px]">{c.replace(/--ds-color-dataviz-(sequential|diverging)-/, "")}</code></span>)}</div>
      <span className="text-body-small text-fg-secondary">{note}</span>
    </div>
  );
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Row title="Sequential" list={seq} note="One hue, darker = more. Flips in dark mode so “more” still stands out." />
      <Row title="Diverging" list={div} note="Orange below the midpoint, blue above — never red/green." />
    </div>
  );
}

export function PickPalette() {
  const cards = [
    { q: "Separate categories?", a: "Categorical · series-1…8", eg: "Tickets by channel, revenue by region", icon: "grid-view" as const },
    { q: "Ordered values, low → high?", a: "Sequential · 1…5", eg: "Heatmaps, usage intensity, density maps", icon: "chart" as const },
    { q: "Above and below a midpoint?", a: "Diverging · neg / mid / pos", eg: "Change vs. last month, sentiment, budget variance", icon: "sort" as const },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {cards.map((c) => (
        <div key={c.q} className="flex flex-col gap-2 rounded-container border border-line-default bg-surface p-4">
          <Icon name={c.icon} size={24} className="text-icon-brand" />
          <span className="text-label-large">{c.q}</span>
          <span className="text-body-small">→ {c.a}</span>
          <span className="text-caption-default text-fg-secondary">e.g. {c.eg}</span>
        </div>
      ))}
    </div>
  );
}

export function ChartAnatomy() {
  const data = [[12, 18, 15, 24, 29, 33], [8, 10, 14, 13, 18, 21], [5, 7, 6, 9, 8, 12]];
  const x = (i: number) => 40 + i * 64, y = (v: number) => 170 - v * 4.5;
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_260px]">
      <figure className="rounded-container border border-line-default bg-surface p-4">
        <figcaption className="pb-2 text-label-medium">Active projects by team (example)</figcaption>
        <svg viewBox="0 0 400 200" className="w-full" role="img" aria-label="Line chart with three series rising over six months">
          {[0, 10, 20, 30].map((t) => (
            <g key={t}>
              <line x1="40" x2="380" y1={y(t)} y2={y(t)} stroke="var(--ds-color-dataviz-gridline)" />
              <text x="32" y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--ds-color-dataviz-label)">{t}</text>
            </g>
          ))}
          <line x1="40" x2="380" y1="170" y2="170" stroke="var(--ds-color-dataviz-axis)" strokeWidth="1.5" />
          {["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((m, i) => <text key={m} x={x(i)} y="188" textAnchor="middle" fontSize="11" fill="var(--ds-color-dataviz-label)">{m}</text>)}
          {data.map((d, s) => (
            <g key={s}>
              <polyline fill="none" stroke={`var(--ds-color-dataviz-series-${s + 1})`} strokeWidth="2.5" points={d.map((v, i) => `${x(i)},${y(v)}`).join(" ")} />
              <text x={x(5) + 6} y={y(d[5]) + 4} fontSize="11" fill={`var(--ds-color-dataviz-series-${s + 1})`} fontWeight="600">{["Design", "Web", "Mobile"][s]}</text>
            </g>
          ))}
        </svg>
      </figure>
      <ul className="flex flex-col gap-2 text-body-small">
        {[["gridline", "Gridlines whisper"], ["axis", "Axes speak"], ["label", "Labels stay readable (≥ 4.5:1)"], ["series-1", "Data shouts"]].map(([k, d]) => (
          <li key={k} className="flex items-center gap-3"><Swatch css={`--ds-color-dataviz-${k}`} className="size-6" /><span className="flex flex-col"><code className="text-code-small">dataviz/{k}</code><span className="text-fg-secondary">{d}</span></span></li>
        ))}
        <li className="pt-2 text-fg-secondary">Lines are labelled directly at their ends, so the chart works without a legend.</li>
      </ul>
    </div>
  );
}

export function DatavizTokens() {
  const all = [...series, ...seq, ...div, "--ds-color-dataviz-gridline", "--ds-color-dataviz-axis", "--ds-color-dataviz-label"];
  return (
    <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
      {all.map((c) => (
        <li key={c} className="flex items-center gap-3 py-1">
          <Swatch css={c} className="size-6" />
          <CopyText text={`var(${c})`}>{c.replace("--ds-color-", "")}</CopyText>
          <span className="ml-auto"><LiveHex css={c} /></span>
        </li>
      ))}
    </ul>
  );
}
