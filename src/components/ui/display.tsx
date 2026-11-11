import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "./feedback";
import { Icon } from "./icon";

/* ---------- Card — Elevation (Flat | Raised). One topic, up to two actions. */
export function Card({ title, children, actions, elevation = "flat", className }: { title?: string; children?: ReactNode; actions?: ReactNode; elevation?: "flat" | "raised"; className?: string }) {
  return (
    <section className={cn("flex flex-col gap-4 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)]", elevation === "raised" && "shadow-elevation-2", className)}>
      {title && <h3 className="text-heading-h4">{title}</h3>}
      {children}
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </section>
  );
}

/* ---------- Avatar — Size (Small 24 | Medium 32 | Large 40). Accessible name = the person's name. */
export function Avatar({ name, size = "md", decorative }: { name: string; size?: "sm" | "md" | "lg"; decorative?: boolean }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const s = { sm: "size-[var(--ds-size-avatar-sm)] text-[10px]", md: "size-[var(--ds-size-avatar-md)] text-label-small", lg: "size-[var(--ds-size-avatar-lg)] text-label-medium" }[size];
  return (
    <span role={decorative ? undefined : "img"} aria-label={decorative ? undefined : name} aria-hidden={decorative || undefined} className={cn("grid shrink-0 place-items-center rounded-full bg-brand-subtle text-fg-brand", s)}>
      {initials}
    </span>
  );
}

/* ---------- Stat Card (Product kit) — trend shows a sign, never colour alone. */
export function StatCard({ label, value, trend, context }: { label: string; value: string; trend?: { direction: "positive" | "negative" | "neutral"; value: string }; context?: string }) {
  const tone = trend?.direction === "positive" ? "success" : trend?.direction === "negative" ? "danger" : "neutral";
  return (
    <div className="flex flex-col gap-2 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)]">
      <p className="text-label-medium text-fg-secondary">{label}</p>
      <p className="text-heading-h2 tabular-nums">{value}</p>
      <div className="flex items-center gap-2">
        {trend && <Badge tone={tone}>{trend.value}</Badge>}
        {context && <span className="text-caption-default text-fg-secondary">{context}</span>}
      </div>
    </div>
  );
}

/* ---------- AI Label + Citation (AI Patterns) */
export function AILabel({ type = "generated" }: { type?: "generated" | "edited" }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-label-small", type === "generated" ? "bg-accent-subtle text-fg-accent" : "bg-surface-subtle text-fg-secondary")}>
      <Icon name="star" size={16} />
      {type === "generated" ? "AI-generated" : "Edited by you"}
    </span>
  );
}
export function Citation({ n, title, href }: { n: number; title: string; href: string }) {
  return (
    <a href={href} aria-label={`Source ${n}: ${title}`} className="inline-flex items-center gap-1 rounded-md border border-line-default bg-surface-subtle py-0.5 pr-2 pl-1 text-label-small hover:bg-neutral-hover focus-visible:focus-ring">
      <span className="grid size-4 place-items-center rounded-sm bg-surface text-fg-brand">{n}</span>
      {title}
    </a>
  );
}
