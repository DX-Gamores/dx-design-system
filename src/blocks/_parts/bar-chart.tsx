/** A vertical bar chart in HTML/CSS with DX data-viz colours. Screen readers get the numbers as a table. */
export function BarChart({ title, data, height = 220, format = (n: number) => n.toLocaleString("en-US") }: {
  title: string;
  data: { label: string; value: number }[];
  height?: number;
  format?: (n: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value)) || 1;
  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="sr-only">{title}</figcaption>
      <div aria-hidden className="flex items-end gap-1 border-b sm:gap-2 border-line-default" style={{ height }}>
        {data.map((d) => (
          <div key={d.label} className="group relative flex h-full min-w-0 flex-1 flex-col justify-end">
            <span className="pointer-events-none absolute inset-x-0 -top-0 text-center text-caption-default text-fg-secondary opacity-0 tabular-nums group-hover:opacity-100">{format(d.value)}</span>
            <div className="rounded-t-sm bg-[var(--ds-color-dataviz-series-1)] transition-opacity group-hover:opacity-80" style={{ height: `${(d.value / max) * 90}%` }} />
          </div>
        ))}
      </div>
      <div aria-hidden className="flex gap-1 text-caption-default sm:gap-2 text-fg-secondary">
        {data.map((d) => <span key={d.label} className="min-w-0 flex-1 truncate text-center">{d.label}</span>)}
      </div>
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>{data.map((d) => <tr key={d.label}><th scope="row">{d.label}</th><td>{format(d.value)}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}
