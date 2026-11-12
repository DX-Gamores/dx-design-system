"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";

/* Live, scaled previews of the full-screen templates at the three Figma breakpoints.
   The frames are the real pages, so they follow the brand / theme / density switches. */
const sizes = { desktop: [1440, 900], tablet: [834, 1000], mobile: [390, 844] } as const;
type Bp = keyof typeof sizes;

export function ScreenPreview({ screens, base, initialBp = "desktop" }: { screens: { label: string; path: string }[]; base: string; initialBp?: Bp }) {
  const [i, setI] = useState(0);
  const [bp, setBp] = useState<Bp>(initialBp);
  const box = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(0);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setCw(e.contentRect.width));
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, []);
  const [w, h] = sizes[bp];
  const scale = cw ? Math.min(1, cw / w) : 0.5;
  const src = `${base}${screens[i].path}/`;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {screens.length > 1 && (
          <div role="group" aria-label="Screen" className="flex flex-wrap gap-2">
            {screens.map((s, k) => (
              <button key={s.path} type="button" aria-pressed={i === k} onClick={() => setI(k)}
                className={cn("h-control-sm rounded-full border px-3 text-label-small focus-visible:focus-ring", i === k ? "border-line-selected bg-selected text-fg-brand" : "border-line-default bg-surface hover:bg-neutral-hover")}>
                {s.label}
              </button>
            ))}
          </div>
        )}
        <div className="ms-auto flex items-center gap-3">
          <div role="group" aria-label="Breakpoint" className="flex gap-1 rounded-control bg-surface-subtle p-1">
            {(Object.keys(sizes) as Bp[]).map((k) => (
              <button key={k} type="button" aria-pressed={bp === k} onClick={() => setBp(k)}
                className={cn("h-8 rounded-[calc(var(--ds-shape-radius-control)-2px)] px-3 text-label-small whitespace-nowrap focus-visible:focus-ring", bp === k ? "bg-surface-raised text-fg-primary shadow-elevation-1" : "text-fg-secondary hover:text-fg-primary")}>
                <span className="capitalize">{k}</span> <span className="tabular-nums text-fg-secondary">{sizes[k][0]}</span>
              </button>
            ))}
          </div>
          <a href={src} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-sm text-label-small text-fg-brand underline underline-offset-2 focus-visible:focus-ring">
            Open full screen <Icon name="external-link" size={16} /><span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
      <div ref={box} className="flex justify-center rounded-container bg-surface-subtle p-0">
        <div className="relative overflow-hidden rounded-container border border-line-default bg-canvas shadow-elevation-1" style={{ width: w * scale, height: h * scale }}>
          <iframe key={src + bp} title={`${screens[i].label} at ${w}px`} src={src} loading="lazy"
            className="absolute start-0 top-0 origin-top-left border-0 rtl:origin-top-right" style={{ width: w, height: h, transform: `scale(${scale})` }} />
        </div>
      </div>
      <p className="text-caption-default text-fg-secondary">{screens[i].label} · {w}px wide, shown at {Math.round(scale * 100)}%. It’s the real page: click around, tab through it, switch the theme above.</p>
    </div>
  );
}
