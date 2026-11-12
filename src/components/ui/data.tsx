"use client";
import type { ReactNode, ThHTMLAttributes, TdHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

/* ---------- Divider — Figma: Divider. Decorative by default; role="separator" only between meaningful groups. */
export function Divider({ orientation = "horizontal", semantic, className }: { orientation?: "horizontal" | "vertical"; semantic?: boolean; className?: string }) {
  return (
    <div
      role={semantic ? "separator" : undefined}
      aria-orientation={semantic ? orientation : undefined}
      aria-hidden={semantic ? undefined : true}
      className={cn("shrink-0 bg-[var(--ds-color-border-default)]", orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch", className)}
    />
  );
}

/* ---------- List + List Item — Figma: List Item. Leading (avatar/icon) · title + description · meta · action. */
export function List({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return <ul aria-label={label} className={cn("flex flex-col divide-y divide-line-default", className)}>{children}</ul>;
}
export function ListItem({ title, description, leading, meta, action, trailing, selected, href }: {
  title: string; description?: string; leading?: ReactNode; meta?: ReactNode; action?: ReactNode; trailing?: ReactNode; selected?: boolean; href?: string;
}) {
  const body = (
    <>
      {leading && <span className="shrink-0">{leading}</span>}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-label-medium">{title}</span>
        {description && <span className="truncate text-caption-default text-fg-secondary">{description}</span>}
      </span>
      {meta && <span className="shrink-0">{meta}</span>}
      {trailing && <span className="shrink-0 text-icon-secondary">{trailing}</span>}
    </>
  );
  return (
    <li aria-current={selected || undefined} className={cn("flex items-center gap-3 px-[var(--ds-padding-row)] py-3", selected && "bg-selected", !href && "hover:bg-neutral-hover")}>
      {href ? <a href={href} className="flex min-w-0 flex-1 items-center gap-3 rounded-sm focus-visible:focus-ring">{body}</a> : body}
      {action && <span className="shrink-0">{action}</span>}
    </li>
  );
}

/* ---------- Table — Figma: Table Header Cell + Table Cell. A real <table>: caption, scope="col",
   aria-sort on the sorted column only, sort is a button in the header. */
export type SortDir = "ascending" | "descending";
export function TableHeaderCell({ children, sortable, sort, onSort, align = "start", className, ...rest }: Omit<ThHTMLAttributes<HTMLTableCellElement>, "align"> & { sortable?: boolean; sort?: SortDir | null; onSort?: () => void; align?: "start" | "end" }) {
  return (
    <th scope="col" aria-sort={sort ?? undefined} className={cn("h-10 border-b border-line-default bg-surface-subtle px-4 text-label-small text-fg-secondary", align === "end" ? "text-end" : "text-start", className)} {...rest}>
      {sortable ? (
        <button type="button" onClick={onSort} className={cn("inline-flex items-center gap-1 rounded-sm hover:text-fg-primary focus-visible:focus-ring", align === "end" && "flex-row-reverse", sort && "text-fg-primary")}>
          {children}
          <Icon name={sort === "ascending" ? "arrow-up" : sort === "descending" ? "arrow-down" : "sort"} size={16} className={sort ? "text-icon-primary" : "text-icon-secondary"} />
        </button>
      ) : children}
    </th>
  );
}
export function TableCell({ children, align = "start", numeric, className, ...rest }: Omit<TdHTMLAttributes<HTMLTableCellElement>, "align"> & { align?: "start" | "end"; numeric?: boolean }) {
  return <td className={cn("h-[var(--ds-size-control-lg)] border-b border-line-default px-4 py-2 text-body-small", (numeric || align === "end") && "text-end tabular-nums", className)} {...rest}>{children}</td>;
}

export type Column<Row> = { key: string; header: string; sortable?: boolean; numeric?: boolean; width?: number | string; render?: (row: Row) => ReactNode; sortValue?: (row: Row) => string | number };
export function Table<Row>({ caption, captionHidden, columns, rows, rowKey, sort, onSortChange, empty }: {
  caption: string; captionHidden?: boolean; columns: Column<Row>[]; rows: Row[]; rowKey: (r: Row) => string;
  sort?: { key: string; direction: SortDir } | null; onSortChange?: (s: { key: string; direction: SortDir }) => void; empty?: ReactNode;
}) {
  const sorted = (() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const val = (r: Row) => col.sortValue?.(r) ?? (r as Record<string, unknown>)[col.key] as string | number;
    return [...rows].sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * (sort.direction === "ascending" ? 1 : -1));
  })();
  return (
    <div className="overflow-x-auto rounded-container border border-line-default bg-surface">
      <table className="w-full border-separate border-spacing-0">
        <caption className={cn("px-4 py-3 text-start text-label-large", captionHidden && "sr-only")}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <TableHeaderCell key={c.key} style={{ width: c.width }} align={c.numeric ? "end" : "start"} sortable={c.sortable}
                sort={sort?.key === c.key ? sort.direction : null}
                onSort={() => onSortChange?.({ key: c.key, direction: sort?.key === c.key && sort.direction === "ascending" ? "descending" : "ascending" })}>
                {c.header}
              </TableHeaderCell>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child_td]:border-b-0">
          {sorted.length ? sorted.map((r) => (
            <tr key={rowKey(r)} className="hover:bg-neutral-hover">
              {columns.map((c) => <TableCell key={c.key} numeric={c.numeric}>{c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key] ?? "")}</TableCell>)}
            </tr>
          )) : (
            <tr><td colSpan={columns.length} className="p-6">{empty ?? <span className="text-body-small text-fg-secondary">Nothing here yet.</span>}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
