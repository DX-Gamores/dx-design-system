"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";

/* Helpers shared by the foundations pages. Values are read from the live CSS variables,
   so they follow the brand / theme / density switches in the header. */

/** Resolve a CSS colour expression (e.g. "var(--ds-color-bg-surface)") to rgb, inside `scope`. */
export function resolveColor(expr: string, scope: Element): [number, number, number] | null {
  const probe = document.createElement("span");
  probe.style.color = expr;
  probe.style.display = "none";
  scope.appendChild(probe);
  const c = getComputedStyle(probe).color;
  probe.remove();
  const m = c.match(/[\d.]+/g);
  return m ? [Number(m[0]), Number(m[1]), Number(m[2])] : null;
}
export const toHex = (rgb: [number, number, number] | null) =>
  rgb ? "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("") : "—";
const lum = ([r, g, b]: [number, number, number]) => {
  const f = (v: number) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
export const contrast = (a: [number, number, number], b: [number, number, number]) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/** Re-render when the theme attributes on <html> change. */
export function useThemeVersion() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const o = new MutationObserver(() => setV((n) => n + 1));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-brand", "data-density", "data-motion"] });
    return () => o.disconnect();
  }, []);
  return v;
}

/** Live hex value of a token in the current theme. */
export function LiveHex({ css }: { css: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const v = useThemeVersion();
  const [hex, setHex] = useState("");
  useEffect(() => {
    if (ref.current) setHex(toHex(resolveColor(`var(${css})`, ref.current)));
  }, [css, v]);
  return <span ref={ref} className="font-mono text-code-small text-fg-secondary tabular-nums">{hex}</span>;
}

export function Swatch({ css, className = "size-10" }: { css: string; className?: string }) {
  return <span aria-hidden className={cn("inline-block shrink-0 rounded-md border border-line-default", className)} style={{ background: `var(${css})` }} />;
}

export function CopyText({ text, children, className }: { text: string; children?: ReactNode; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard?.writeText(text).catch(() => {}); setDone(true); setTimeout(() => setDone(false), 1200); }}
      className={cn("inline-flex items-center gap-1 rounded-sm px-1 text-left font-mono text-code-small hover:bg-neutral-hover focus-visible:focus-ring", className)}
      aria-label={`Copy ${text}`}
    >
      {children ?? text}
      <Icon name={done ? "check" : "copy"} size={16} className={done ? "text-icon-success" : "text-icon-secondary"} />
    </button>
  );
}

/** A Do / Don't pair, like the _Doc/Verdict cards in Figma. */
export function Verdict({ ok, children, note }: { ok: boolean; children: ReactNode; note: string }) {
  return (
    <figure className="flex flex-col overflow-hidden rounded-container border border-line-default bg-surface">
      <div className="flex min-h-28 flex-1 items-center justify-center gap-3 bg-surface-subtle p-5">{children}</div>
      <figcaption className={cn("flex items-start gap-2 border-t-4 p-3 text-body-small", ok ? "border-line-success" : "border-line-danger")}>
        <Icon name={ok ? "check-circle" : "x-circle"} size={20} className={ok ? "text-icon-success" : "text-icon-danger"} />
        <span><strong className={ok ? "text-fg-success" : "text-fg-danger"}>{ok ? "Do" : "Don’t"}</strong> · {note}</span>
      </figcaption>
    </figure>
  );
}
export const VerdictGrid = ({ children }: { children: ReactNode }) => <div className="grid gap-4 md:grid-cols-2">{children}</div>;
