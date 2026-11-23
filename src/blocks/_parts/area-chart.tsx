/** A small area chart in plain SVG, coloured with the DX data-viz tokens. Screen readers get the numbers as a table.
 *  For bigger needs, swap in a chart library and keep the colours: var(--ds-color-dataviz-series-N). */
export function AreaChart({ title, series, data, height = 240, format = (n: number) => n.toLocaleString("en-US") }: {
  title: string;
  series: string[];
  data: { label: string; values: number[] }[];
  height?: number;
  format?: (n: number) => string;
}) {
  const W = 100, H = 40;
  const max = Math.max(...data.flatMap((d) => d.values)) * 1.1 || 1;
  const x = (i: number) => (i / Math.max(data.length - 1, 1)) * W;
  const y = (v: number) => H - (v / max) * H;
  const line = (s: number) => data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(2)},${y(d.values[s]).toFixed(2)}`).join(" ");
  const every = Math.ceil(data.length / 6);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));
  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="sr-only">{title}</figcaption>
      <div className="flex gap-2">
        <div aria-hidden className="flex flex-col justify-between py-0 text-end text-caption-default text-fg-secondary tabular-nums" style={{ height }}>
          {[...ticks].reverse().map((t) => <span key={t} className="-my-2 leading-4">{format(t)}</span>)}
        </div>
        <svg aria-hidden viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="min-w-0 flex-1 overflow-visible" style={{ height }}>
          {ticks.map((t) => <line key={t} x1="0" x2={W} y1={y(t)} y2={y(t)} stroke="var(--ds-color-border-default)" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
          {series.map((_, s) => (
            <g key={s}>
              <path d={`${line(s)} L${W},${H} L0,${H} Z`} fill={`var(--ds-color-dataviz-series-${s + 1})`} fillOpacity={0.14} />
              <path d={line(s)} fill="none" stroke={`var(--ds-color-dataviz-series-${s + 1})`} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </g>
          ))}
        </svg>
      </div>
      <div aria-hidden className="flex justify-between ps-10 text-caption-default text-fg-secondary">
        {data.filter((_, i) => i % every === 0).map((d) => <span key={d.label}>{d.label}</span>)}
      </div>
      {series.length > 1 && (
        <ul aria-hidden className="flex flex-wrap justify-center gap-4 text-caption-default text-fg-secondary">
          {series.map((s, i) => <li key={s} className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: `var(--ds-color-dataviz-series-${i + 1})` }} />{s}</li>)}
        </ul>
      )}
      <table className="sr-only">
        <caption>{title}</caption>
        <thead><tr><th scope="col">Period</th>{series.map((s) => <th key={s} scope="col">{s}</th>)}</tr></thead>
        <tbody>{data.map((d) => <tr key={d.label}><th scope="row">{d.label}</th>{d.values.map((v, i) => <td key={i}>{format(v)}</td>)}</tr>)}</tbody>
      </table>
    </figure>
  );
}
