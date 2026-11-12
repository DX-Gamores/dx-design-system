"use client";
import { createContext, useContext, useId, useState, type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";
import { IconButton } from "./button";

/* ---------- Link — Figma: Link. Always underlined, so it never relies on colour.
   External links show the icon and tell screen readers they open a new tab. */
export function Link({ children, size = "md", external, className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { size?: "md" | "sm"; external?: boolean }) {
  return (
    <a
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex items-center gap-1 rounded-sm text-fg-brand underline underline-offset-2 hover:text-fg-brand-hover hover:decoration-2 focus-visible:focus-ring",
        size === "md" ? "text-label-medium" : "text-label-small",
        className,
      )}
      {...rest}
    >
      {children}
      {external && <><Icon name="external-link" size={size === "md" ? 16 : 16} /><span className="sr-only"> (opens in a new tab)</span></>}
    </a>
  );
}

/* ---------- Breadcrumbs — Figma: Breadcrumbs (Navigation page). The current page is last and not a link. */
export function Breadcrumbs({ items, label = "Breadcrumb" }: { items: { label: string; href?: string }[]; label?: string }) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-1 text-label-small">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.label + i} className="flex items-center gap-1">
              {last || !it.href ? (
                <span aria-current={last ? "page" : undefined} className={last ? "text-fg-primary" : "text-fg-secondary"}>{it.label}</span>
              ) : (
                <a href={it.href} className="rounded-sm text-fg-secondary underline-offset-2 hover:text-fg-primary hover:underline focus-visible:focus-ring">{it.label}</a>
              )}
              {!last && <Icon name="chevron-right" size={16} className="text-icon-secondary" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------- Pagination — Figma: Pagination (Lists & Tables). Summary on the start side, page controls on the end. */
export function Pagination({ page, pageCount, onPageChange, summary, label = "Pagination" }: { page: number; pageCount: number; onPageChange: (p: number) => void; summary?: string; label?: string }) {
  return (
    <nav aria-label={label} className="flex flex-wrap items-center justify-between gap-3 py-2">
      {summary && <p className="text-body-small text-fg-secondary" aria-live="polite">{summary}</p>}
      <div className="ms-auto flex items-center gap-2">
        <IconButton icon="chevron-left" label="Previous page" variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
        <span className="min-w-24 text-center text-label-small tabular-nums" aria-current="page">Page {page} of {pageCount}</span>
        <IconButton icon="chevron-right" label="Next page" variant="secondary" size="sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} />
      </div>
    </nav>
  );
}

/* ---------- Accordion + Accordion Item — Figma: Accordion. Header is a button with aria-expanded;
   each panel is a labelled region. Tab moves between headers — no arrow keys needed (APG). */
const AccCtx = createContext<{ multiple: boolean; open: Set<string>; toggle: (id: string) => void; level: 2 | 3 | 4 } | null>(null);

export function Accordion({ children, multiple = true, defaultOpen = [], headingLevel = 3 }: { children: ReactNode; multiple?: boolean; defaultOpen?: string[]; headingLevel?: 2 | 3 | 4 }) {
  const [open, setOpen] = useState(new Set(defaultOpen));
  const toggle = (id: string) => setOpen((s) => { const n = new Set(multiple ? s : []); if (s.has(id)) n.delete(id); else n.add(id); return n; });
  return (
    <AccCtx.Provider value={{ multiple, open, toggle, level: headingLevel }}>
      <div className="flex flex-col divide-y divide-line-default rounded-container border border-line-default bg-surface">{children}</div>
    </AccCtx.Provider>
  );
}
export function AccordionItem({ title, children, id: given }: { title: string; children: ReactNode; id?: string }) {
  const c = useContext(AccCtx)!;
  const auto = useId();
  const id = given ?? auto;
  const expanded = c.open.has(id);
  const H = `h${c.level}` as "h3";
  return (
    <div>
      <H className="m-0">
        <button type="button" id={`${id}-h`} aria-expanded={expanded} aria-controls={`${id}-p`} onClick={() => c.toggle(id)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start text-label-large hover:bg-neutral-hover focus-visible:focus-ring first:rounded-t-container">
          {title}
          <Icon name="chevron-down" className={cn("shrink-0 text-icon-secondary transition-transform duration-[var(--ds-duration-moderate)] ease-standard", expanded && "rotate-180")} />
        </button>
      </H>
      <div id={`${id}-p`} role="region" aria-labelledby={`${id}-h`} hidden={!expanded} className="px-4 pb-4 text-body-small text-fg-secondary">{children}</div>
    </div>
  );
}
Accordion.Item = AccordionItem;
