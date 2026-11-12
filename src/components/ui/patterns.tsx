"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";
import { Button, IconButton } from "./button";
import { AILabel, Citation } from "./display";

/* ---------- Form Section — Figma: Form Section. A labelled region whose heading is the title.
   Side by side on desktop (intro column + fields), stacked on mobile or when layout="stacked". */
export function FormSection({ title, description, children, layout = "side-by-side" }: { title: string; description?: string; children: ReactNode; layout?: "side-by-side" | "stacked" }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={cn("grid gap-6", layout === "side-by-side" && "lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-12")}>
      <div className="flex flex-col gap-1">
        <h3 id={id} className="text-heading-h4">{title}</h3>
        {description && <p className="text-body-small text-fg-secondary">{description}</p>}
      </div>
      <div className="flex max-w-xl flex-col gap-4">{children}</div>
    </section>
  );
}

/* ---------- Form Actions — Figma: Form Actions. Inline at the end of a form, or sticky on long
   settings pages while there are unsaved changes. Never disable Save — validate on submit. */
export function FormActions({ variant = "inline", status, onCancel, submitLabel = "Save changes", cancelLabel = "Cancel", loading }: {
  variant?: "inline" | "sticky"; status?: string; onCancel?: () => void; submitLabel?: string; cancelLabel?: string; loading?: boolean;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3",
      variant === "sticky" ? "sticky bottom-0 z-[var(--ds-z-sticky)] -mx-[var(--ds-padding-card)] border-t border-line-default bg-surface px-[var(--ds-padding-card)] py-3 shadow-elevation-1" : "pt-2")}>
      {status && <p role="status" className="flex items-center gap-2 text-body-small text-fg-secondary"><span aria-hidden className="size-2 rounded-full bg-warning" />{status}</p>}
      <div className="ms-auto flex gap-2">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>{cancelLabel}</Button>}
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </div>
  );
}

/* ---------- Error Summary — Figma: Error Summary. Shown at the top after a failed submit; takes focus,
   lists every problem, each link moves focus to its field. Icon + title carry the meaning, not red alone. */
export function ErrorSummary({ errors, title, focusOnMount = true }: { errors: { fieldId: string; message: string }[]; title?: string; focusOnMount?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (focusOnMount && errors.length) ref.current?.focus(); }, [errors.length, focusOnMount]);
  if (!errors.length) return null;
  const heading = title ?? `There ${errors.length === 1 ? "is 1 problem" : `are ${errors.length} problems`} with your form`;
  return (
    <div ref={ref} tabIndex={-1} role="alert" aria-labelledby="error-summary-title" className="flex gap-3 rounded-md border-2 border-line-danger bg-danger-subtle p-4 outline-none focus-visible:focus-ring">
      <Icon name="alert-circle" className="text-icon-danger" />
      <div className="flex flex-col gap-2">
        <h2 id="error-summary-title" className="text-label-large">{heading}</h2>
        <ul className="flex flex-col gap-1">
          {errors.map((e) => (
            <li key={e.fieldId}>
              <a href={`#${e.fieldId}`} onClick={(ev) => { const f = document.getElementById(e.fieldId); if (f) { ev.preventDefault(); f.focus(); f.scrollIntoView({ block: "center" }); } }}
                className="rounded-sm text-body-small text-fg-danger underline underline-offset-2 focus-visible:focus-ring">{e.message}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- AI Confidence — Figma: AI Confidence. Level in words + bars, never colour alone. */
export function AIConfidence({ level }: { level: "high" | "medium" | "low" }) {
  const n = { high: 3, medium: 2, low: 1 }[level];
  const tone = { high: "bg-success", medium: "bg-warning", low: "bg-danger" }[level];
  const words = { high: "High confidence", medium: "Medium confidence — check the sources", low: "Low confidence — verify before using" }[level];
  return (
    <span className="inline-flex items-center gap-2 text-caption-default text-fg-secondary">
      <span aria-hidden className="flex items-end gap-0.5">{[1, 2, 3].map((i) => <span key={i} className={cn("w-1 rounded-sm", i <= n ? tone : "bg-control-off/30")} style={{ height: 4 + i * 3 }} />)}</span>
      {words}
    </span>
  );
}

/* ---------- AI Response — Figma: AI Response. Disclose it's AI, show sources, keep people in control.
   Live region (polite) + aria-busy while streaming; Stop is the first control while it streams. */
export function AIResponse({ status, children, sources = [], confidence, time = "Just now", onStop, onRegenerate, onCopy, onFeedback, error = "Something went wrong and the answer didn’t finish." }: {
  status: "streaming" | "complete" | "stopped" | "error"; children?: ReactNode; sources?: { title: string; href: string }[];
  confidence?: "high" | "medium" | "low"; time?: string; onStop?: () => void; onRegenerate?: () => void; onCopy?: () => void; onFeedback?: (helpful: boolean) => void; error?: string;
}) {
  return (
    <article aria-live="polite" aria-busy={status === "streaming"} className="flex flex-col gap-3 rounded-container border border-line-default bg-surface p-4">
      <header className="flex flex-wrap items-center gap-2">
        <AILabel />
        <span className="text-caption-default text-fg-secondary">{status === "streaming" ? "Writing…" : time}{sources.length ? ` · from ${sources.length} source${sources.length > 1 ? "s" : ""}` : ""}</span>
        {status === "streaming" && onStop && <Button size="sm" variant="secondary" className="ms-auto" onClick={onStop}>Stop</Button>}
      </header>
      {status === "error" ? (
        <p className="flex items-center gap-2 text-body-small text-fg-danger"><Icon name="alert-circle" size={16} />{error}</p>
      ) : (
        <div className="text-body-medium">
          {children}
          {status === "streaming" && <span aria-hidden className="ms-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-[var(--ds-color-text-accent)] align-middle" />}
          {status === "stopped" && <span className="ms-2 text-caption-default text-fg-secondary">(Stopped)</span>}
        </div>
      )}
      {status !== "streaming" && (sources.length > 0 || confidence) && (
        <div className="flex flex-wrap items-center gap-2">
          {sources.map((s, i) => <Citation key={s.href + i} n={i + 1} title={s.title} href={s.href} />)}
          {confidence && <span className="ms-auto"><AIConfidence level={confidence} /></span>}
        </div>
      )}
      {status !== "streaming" && (
        <footer className="flex items-center gap-1 border-t border-line-default pt-2">
          {onCopy && status !== "error" && <IconButton icon="copy" label="Copy answer" size="sm" onClick={onCopy} />}
          {onRegenerate && <Button size="sm" variant="ghost" leadingIcon="refresh" onClick={onRegenerate}>{status === "error" ? "Try again" : "Regenerate"}</Button>}
          {onFeedback && status === "complete" && (
            <span className="ms-auto flex items-center gap-1 text-caption-default text-fg-secondary">
              Helpful?
              <Button size="sm" variant="ghost" onClick={() => onFeedback(true)}>Yes</Button>
              <Button size="sm" variant="ghost" onClick={() => onFeedback(false)}>No</Button>
            </span>
          )}
        </footer>
      )}
    </article>
  );
}
