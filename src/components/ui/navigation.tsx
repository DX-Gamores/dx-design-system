"use client";
import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./icon";

/* ---------- Segmented Control — role="radiogroup"; ←/→ move and select; 2–5 options. */
export function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
  size = "md",
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; icon?: IconName; iconOnly?: boolean }[];
  size?: "md" | "sm";
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (e: KeyboardEvent, i: number) => {
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key as string];
    const jump = e.key === "Home" ? 0 : e.key === "End" ? options.length - 1 : null;
    if (dir === undefined && jump === null) return;
    e.preventDefault();
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl" && (e.key === "ArrowLeft" || e.key === "ArrowRight") ? -1 : 1;
    const n = jump ?? (i + (dir ?? 0) * rtl + options.length) % options.length;
    onChange(options[n].value);
    refs.current[n]?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex gap-0.5 rounded-md border border-line-default bg-surface-subtle p-1", size === "md" ? "h-control-md" : "h-control-sm")}
    >
      {options.map((o, i) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="radio"
            aria-checked={on}
            aria-label={o.iconOnly ? o.label : undefined}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => move(e, i)}
            className={cn(
              "inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-sm px-3 transition-colors duration-fast focus-visible:focus-ring",
              size === "md" ? "text-label-medium" : "text-label-small",
              on ? "border border-line-default bg-surface-raised text-fg-primary shadow-elevation-1" : "text-fg-secondary hover:bg-neutral-hover hover:text-fg-primary",
            )}
          >
            {o.icon && <Icon name={o.icon} size={16} />}
            {!o.iconOnly && <span className="truncate">{o.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Tabs — APG tabs, automatic activation. */
export function Tabs({ label, tabs, value, onChange }: { label: string; value: string; onChange: (id: string) => void; tabs: { id: string; label: string; count?: number; panel: ReactNode }[] }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = tabs.findIndex((t) => t.id === value);
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const j = e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : d ? (idx + d + tabs.length) % tabs.length : -1;
    if (j < 0) return;
    e.preventDefault();
    onChange(tabs[j].id);
    refs.current[j]?.focus();
  };
  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label={label} onKeyDown={onKey} className="flex gap-1 overflow-x-auto shadow-[inset_0_-1px_0_var(--ds-color-border-default)] [scrollbar-width:none]">
        {tabs.map((t, i) => {
          const on = t.id === value;
          return (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              aria-selected={on}
              aria-controls={`panel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(t.id)}
              className={cn(
                "inline-flex h-control-md shrink-0 items-center gap-2 border-b-2 px-3 text-label-medium whitespace-nowrap focus-visible:focus-ring",
                on ? "border-brand text-fg-brand" : "border-transparent text-fg-secondary hover:text-fg-primary",
              )}
            >
              {t.label}
              {t.count !== undefined && <span className="rounded-full bg-surface-subtle px-1.5 text-label-small text-fg-secondary">{t.count}</span>}
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div key={t.id} id={`panel-${t.id}`} role="tabpanel" aria-labelledby={`tab-${t.id}`} hidden={t.id !== value}>
          {t.panel}
        </div>
      ))}
    </div>
  );
}

/* ---------- Stepper — <nav><ol>, aria-current="step"; status in words + icon. */
export type StepStatus = "complete" | "current" | "upcoming" | "error";
export function Stepper({ steps, onStepClick }: { steps: { label: string; description?: string; status: StepStatus }[]; onStepClick?: (i: number) => void }) {
  const dot: Record<StepStatus, string> = {
    complete: "bg-brand text-fg-on-brand",
    current: "border-2 border-brand bg-surface text-fg-brand",
    upcoming: "border border-line-strong bg-surface text-fg-secondary",
    error: "border border-line-danger bg-danger-subtle text-icon-danger",
  };
  const sr = { complete: "completed", current: "current step", upcoming: "not started", error: "needs attention" };
  return (
    <nav aria-label="Progress">
      <ol className="flex gap-2">
        {steps.map((s, i) => {
          const body = (
            <>
              <span className="flex items-center gap-2">
                <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-label-medium", dot[s.status])}>
                  {s.status === "complete" ? <Icon name="check" size={16} /> : s.status === "error" ? <Icon name="alert-circle" size={16} /> : i + 1}
                </span>
                {i < steps.length - 1 && <span aria-hidden className={cn("h-0.5 flex-1 rounded-full", s.status === "complete" ? "bg-brand" : "bg-[var(--ds-color-border-default)]")} />}
              </span>
              <span className={cn("text-label-medium", s.status === "upcoming" ? "text-fg-secondary" : "text-fg-primary")}>{s.label}</span>
              {s.description && <span className={cn("text-caption-default", s.status === "error" ? "text-fg-danger" : "text-fg-secondary")}>{s.description}</span>}
              <span className="sr-only">, {sr[s.status]}</span>
            </>
          );
          return (
            <li key={s.label} className="flex min-w-0 flex-1 flex-col" aria-current={s.status === "current" ? "step" : undefined}>
              {s.status === "complete" && onStepClick ? (
                <button onClick={() => onStepClick(i)} className="flex flex-col gap-2 rounded-md text-left focus-visible:focus-ring">
                  {body}
                </button>
              ) : (
                <div className="flex flex-col gap-2">{body}</div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
