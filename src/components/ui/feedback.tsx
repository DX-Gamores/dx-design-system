import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";

/* ---------- Badge — Tone (Neutral | Brand | Success | Warning | Danger | Info) */
type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";
const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-surface-subtle text-fg-secondary",
  brand: "bg-brand-subtle text-fg-brand",
  success: "bg-success-subtle text-fg-success",
  warning: "bg-warning-subtle text-fg-warning",
  danger: "bg-danger-subtle text-fg-danger",
  info: "bg-info-subtle text-fg-info",
};
export function Badge({ tone = "neutral", children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-label-small", badgeTones[tone], className)}>{children}</span>
  );
}

/* ---------- Alert — Tone (Info | Success | Warning | Danger). Danger uses role="alert". */
type AlertTone = "info" | "success" | "warning" | "danger";
const alertLook: Record<AlertTone, { box: string; icon: IconName; fg: string }> = {
  info: { box: "bg-info-subtle border-line-info", icon: "info", fg: "text-icon-info" },
  success: { box: "bg-success-subtle border-line-success", icon: "check-circle", fg: "text-icon-success" },
  warning: { box: "bg-warning-subtle border-line-warning", icon: "alert-triangle", fg: "text-icon-warning" },
  danger: { box: "bg-danger-subtle border-line-danger", icon: "alert-circle", fg: "text-icon-danger" },
};
export function Alert({
  tone = "info",
  title,
  children,
  action,
  onDismiss,
  live,
}: {
  tone?: AlertTone;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  /** Set when the alert is inserted dynamically so screen readers announce it. */
  live?: boolean;
}) {
  const l = alertLook[tone];
  return (
    <div
      role={live ? (tone === "danger" ? "alert" : "status") : undefined}
      className={cn("flex gap-3 rounded-md border p-[var(--ds-padding-row)]", l.box)}
    >
      <Icon name={l.icon} className={l.fg} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title && <p className="text-label-medium text-fg-primary">{title}</p>}
        {children && <div className="text-body-small text-fg-secondary">{children}</div>}
        {action}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Dismiss" className="h-6 w-6 rounded-sm text-icon-secondary hover:bg-neutral-hover focus-visible:focus-ring">
          <Icon name="close" size={16} className="m-auto" />
        </button>
      )}
    </div>
  );
}

/* ---------- Spinner + Skeleton */
export function Spinner({ size = "md", label = "Loading" }: { size?: "sm" | "md" | "lg"; label?: string }) {
  const px = { sm: 16, md: 20, lg: 32 }[size];
  return (
    <span role={label ? "status" : undefined} aria-label={label || undefined} className="inline-flex">
      <svg width={px} height={px} viewBox="0 0 24 24" className="animate-spin motion-reduce:animate-[spin_2s_linear_infinite]" aria-hidden>
        <circle cx="12" cy="12" r="9" fill="none" stroke="var(--ds-color-border-default)" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="var(--ds-color-bg-brand)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}
export function Skeleton({ shape = "text", className }: { shape?: "text" | "circle" | "block"; className?: string }) {
  const s = { text: "h-3 rounded-sm", circle: "size-10 rounded-full", block: "h-24 rounded-md" }[shape];
  return <span aria-hidden className={cn("block animate-pulse bg-surface-subtle motion-reduce:animate-none", s, className)} />;
}

/* ---------- Empty State */
export function EmptyState({
  icon = "folder",
  title,
  description,
  actions,
  headingLevel: H = "h2",
}: {
  icon?: IconName;
  title: string;
  description?: string;
  actions?: ReactNode;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <div className="flex flex-col items-center gap-[var(--ds-gap-stack)] px-6 py-10 text-center">
      <span className="grid size-[var(--ds-size-control-lg)] place-items-center rounded-full bg-surface-subtle text-icon-primary">
        <Icon name={icon} />
      </span>
      <div className="flex max-w-sm flex-col gap-1">
        <H className="text-heading-h4">{title}</H>
        {description && <p className="text-body-small text-fg-secondary">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap justify-center gap-2">{actions}</div>}
    </div>
  );
}

/* ---------- Progress Bar */
export function Progress({ value, label, tone = "brand" }: { value: number; label: string; tone?: "brand" | "success" | "warning" | "danger" }) {
  const fill = { brand: "bg-brand", success: "bg-success", warning: "bg-warning", danger: "bg-danger" }[tone];
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-label-small">
        <span>{label}</span>
        <span className="text-fg-secondary">{value}%</span>
      </div>
      <div role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} className="h-2 rounded-full bg-neutral-pressed">
        <div className={cn("h-full rounded-full", fill)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
