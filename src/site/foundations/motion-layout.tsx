"use client";
import { useEffect, useState } from "react";
import { Badge, Button } from "@/components/ui";
import { CopyText } from "./shared";

type Motion = {
  durations: { name: string; css: string; ms: number }[];
  easings: { name: string; css: string; value: string }[];
  springs: { name: string; css: string; stiffness: number; damping: number; ms: number; value: string }[];
};
const durUse: Record<string, string> = { "duration/instant": "toggles, checkboxes", "duration/fast": "hover, press", "duration/moderate": "menus, tooltips", "duration/slow": "dialogs, drawers" };
const springUse: Record<string, string> = { "easing/spring-snappy": "Toggles, chips, small state changes", "easing/spring-gentle": "Panels, sheets, menus opening", "easing/spring-bouncy": "Rare delight: success, a new item landing" };

function bezierPath(v: string) {
  const m = v.match(/cubic-bezier\(([^)]+)\)/);
  if (!m) return "M0 100 L100 0";
  const [x1, y1, x2, y2] = m[1].split(",").map(Number);
  return `M0 100 C${x1 * 100} ${100 - y1 * 100} ${x2 * 100} ${100 - y2 * 100} 100 0`;
}
function linearPath(v: string) {
  const pts = (v.match(/linear\(([^)]+)\)/)?.[1] ?? "").split(",").map(Number);
  return pts.map((p, i) => `${i ? "L" : "M"}${(i / (pts.length - 1)) * 100} ${100 - p * 80}`).join(" ");
}

/** A track with a dot that moves when played — uses the token's real duration and easing. */
function Track({ duration, easing, play }: { duration: string; easing: string; play: boolean }) {
  return (
    <div className="relative h-8 rounded-full bg-surface-subtle">
      <span
        className="absolute top-1 size-6 rounded-full bg-brand"
        style={{ left: play ? "calc(100% - 28px)" : "4px", transition: `left ${duration} ${easing}` }}
      />
    </div>
  );
}

/** Figma 07 · Motion: durations, easing curves and springs. */
export function MotionDemo({ m }: { m: Motion }) {
  const [play, setPlay] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const upd = () => setReduced(q.matches || document.documentElement.dataset.motion === "reduced");
    upd(); q.addEventListener("change", upd); return () => q.removeEventListener("change", upd);
  }, []);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button leadingIcon={play ? "undo" : "arrow-right"} onClick={() => setPlay((p) => !p)}>{play ? "Reset" : "Play all"}</Button>
        {reduced && <Badge tone="info">Reduce motion is on — every duration is 0</Badge>}
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-heading-h4">Durations</h3>
        {m.durations.map((d) => (
          <div key={d.name} className="grid items-center gap-2 sm:grid-cols-[220px_1fr]">
            <span className="flex flex-col"><code className="text-code-small">{d.name}</code><span className="text-caption-default text-fg-secondary">{d.ms} ms · {durUse[d.name]}</span></span>
            <div className="max-w-[420px]"><Track duration={`var(${d.css})`} easing="var(--ds-easing-standard)" play={play} /></div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-heading-h4">Easing</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {m.easings.map((e) => (
            <div key={e.name} className="flex flex-col gap-2 rounded-container border border-line-default bg-surface p-4">
              <svg viewBox="-4 -4 108 108" className="h-24 w-full" aria-hidden><path d="M0 100 H100 M0 100 V0" className="stroke-line-default" strokeWidth="1" fill="none" /><path d={bezierPath(e.value)} className="stroke-icon-brand" strokeWidth="3" fill="none" /></svg>
              <code className="text-code-small">{e.name}</code>
              <span className="text-caption-default break-all text-fg-secondary">{e.value}</span>
              <Track duration="var(--ds-duration-slow)" easing={`var(${e.css})`} play={play} />
            </div>
          ))}
        </div>
        <p className="text-body-small text-fg-secondary"><strong>Standard</strong> for things that move within the screen, <strong>enter</strong> for things arriving (decelerate), <strong>exit</strong> for things leaving (accelerate).</p>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="flex items-center gap-2 text-heading-h4">Springs <Badge tone="brand">New · v3.2.0</Badge></h3>
        <p className="text-body-small text-fg-secondary">Physics-based timing for things that move with the hand or need to feel alive. Each spring ships as a CSS <code className="text-code-small">linear()</code> curve; Reduced mode makes them instant.</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {m.springs.map((s) => (
            <div key={s.name} className="flex flex-col gap-2 rounded-container border border-line-default bg-surface p-4">
              <svg viewBox="-4 -24 108 128" className="h-24 w-full" aria-hidden><path d="M0 20 H100" className="stroke-line-default" strokeDasharray="3 3" fill="none" /><path d={linearPath(s.value)} className="stroke-icon-brand" strokeWidth="3" fill="none" /></svg>
              <span className="text-label-large capitalize">{s.name.split("-").pop()}</span>
              <span className="text-caption-default text-fg-secondary">stiffness {s.stiffness} · damping {s.damping} · ~{s.ms} ms</span>
              <span className="text-body-small">{springUse[s.name]}</span>
              <CopyText text={`ease-${s.name.split("/")[1]}`} className="-ml-1 w-fit" />
              <Track duration={`${s.ms}ms`} easing={`var(${s.css})`} play={play && !reduced} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Figma 08 · Layout: four breakpoints drawn to scale. */
export function LayoutGrid({ layouts }: { layouts: ({ mode: string } & Record<string, number>)[] }) {
  const order = ["Mobile", "Tablet", "Desktop", "Wide"];
  const sorted = [...layouts].sort((a, b) => order.indexOf(a.mode) - order.indexOf(b.mode));
  const [w, setW] = useState(0);
  useEffect(() => { const u = () => setW(window.innerWidth); u(); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u); }, []);
  const current = [...sorted].reverse().find((l) => w >= l["breakpoint-min"])?.mode;
  const frameW: Record<string, number> = { Mobile: 390, Tablet: 834, Desktop: 1280, Wide: 1600 };
  const scale = 0.24;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4 overflow-x-auto pb-2">
        {sorted.map((l) => {
          const fw = frameW[l.mode] * scale, m = l.margin * scale, g = l.gutter * scale, cols = l.columns;
          return (
            <div key={l.mode} className="flex flex-col gap-2">
              <div className="relative h-28 rounded-md border border-line-strong bg-surface" style={{ width: fw }}>
                <div className="absolute inset-y-2 flex" style={{ left: m, right: m, gap: g }}>
                  {Array.from({ length: cols }).map((_, i) => <span key={i} className="flex-1 rounded-[1px] bg-[#e11d74]/25" />)}
                </div>
              </div>
              <span className="flex items-center gap-2 text-label-medium">{l.mode}{current === l.mode && <Badge tone="brand">You’re here</Badge>}</span>
              <span className="text-caption-default text-fg-secondary">{l.mode === "Mobile" ? "< 600" : `≥ ${l["breakpoint-min"]}`} · {cols} col · gutter {l.gutter} · margin {l.margin}</span>
            </div>
          );
        })}
      </div>
      <p className="text-body-small text-fg-secondary">In code the layout tokens switch at the same breakpoints: <code className="text-code-small">--ds-layout-columns</code>, <code className="text-code-small">--ds-layout-gutter</code>, <code className="text-code-small">--ds-layout-margin</code>, <code className="text-code-small">--ds-layout-content-max</code>. Drawn at 24%.</p>
    </div>
  );
}
