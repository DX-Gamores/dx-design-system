"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, type SortDir } from "@/components/ui/data";
import { Badge } from "@/components/ui/feedback";
import { Chip, SearchField } from "@/components/ui/form";
import { Pagination } from "@/components/ui/nav-extra";

type Status = "Backlog" | "Todo" | "In progress" | "Done";
type Task = { id: string; title: string; label: string; status: Status; priority: "Low" | "Medium" | "High"; assignee: string };
const titles = ["Fix login redirect", "Write onboarding emails", "Audit color contrast", "Migrate invoices table", "Add CSV export", "Field map: offline tiles", "Rename projects to spaces", "Reduce bundle size", "Dark mode for charts", "Translate settings to Filipino", "Keyboard shortcuts help", "Archive old reports"];
const statuses: Status[] = ["Backlog", "Todo", "In progress", "Done"];
const people = ["Jane Cooper", "Wade Warren", "Esther Howard", "Leo Santos"];
const tasks: Task[] = titles.map((t, i) => ({
  id: `TASK-${8710 + i * 7}`, title: t, label: ["Bug", "Feature", "Docs"][i % 3], status: statuses[(i * 3) % 4],
  priority: (["Low", "Medium", "High"] as const)[(i * 2) % 3], assignee: people[i % 4],
}));
const statusTone = { Backlog: "neutral", Todo: "info", "In progress": "brand", Done: "success" } as const;
const PAGE = 6;

export function TasksTable() {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Set<Status>>(new Set());
  const [sort, setSort] = useState<{ key: string; direction: SortDir } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const rows = useMemo(() => tasks.filter((t) => (!q || `${t.id} ${t.title}`.toLowerCase().includes(q.toLowerCase())) && (!filters.size || filters.has(t.status))), [q, filters]);
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE));
  const shown = rows.slice((page - 1) * PAGE, page * PAGE);
  const allOnPage = shown.length > 0 && shown.every((r) => selected.has(r.id));
  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-64"><SearchField label="Search tasks" placeholder="Search tasks" size="sm" value={q} onChange={(v) => { setQ(v); setPage(1); }} onClear={() => setQ("")} /></div>
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <Chip key={s} selected={filters.has(s)} onToggle={(on) => { setFilters((f) => { const n = new Set(f); if (on) n.add(s); else n.delete(s); return n; }); setPage(1); }}>{s}</Chip>
          ))}
        </div>
        {(q || filters.size > 0) && <Button variant="ghost" size="sm" onClick={() => { setQ(""); setFilters(new Set()); }}>Reset</Button>}
      </div>
      <div role="region" aria-label="Bulk actions" aria-live="polite" className={selected.size ? "flex flex-wrap items-center gap-2 rounded-container border border-line-default bg-selected px-4 py-2" : "sr-only"}>
        {selected.size > 0 && (
          <>
            <span className="text-label-medium">{selected.size} selected</span>
            <Button size="sm" variant="secondary" leadingIcon="check">Mark done</Button>
            <Button size="sm" variant="secondary" leadingIcon="user">Assign</Button>
            <Button size="sm" variant="ghost" tone="danger" leadingIcon="trash">Delete</Button>
            <Button size="sm" variant="ghost" className="ms-auto" onClick={() => setSelected(new Set())}>Clear selection</Button>
          </>
        )}
      </div>
      <Table<Task>
        caption="Tasks"
        captionHidden
        rows={shown}
        rowKey={(t) => t.id}
        sort={sort}
        onSortChange={setSort}
        empty={<p className="py-6 text-center text-body-small text-fg-secondary">No tasks match. Try another word or clear the filters.</p>}
        columns={[
          {
            key: "select", header: "Select", headerHidden: true, width: 48,
            render: (t) => <input type="checkbox" aria-label={`Select ${t.id}`} checked={selected.has(t.id)} onChange={() => toggle(t.id)} className="size-4 accent-[var(--ds-color-bg-brand)] focus-visible:focus-ring" />,
          },
          { key: "id", header: "Task", sortable: true, width: 120, render: (t) => <span className="font-mono text-code-small">{t.id}</span> },
          { key: "title", header: "Title", sortable: true, render: (t) => <span className="flex items-center gap-2"><Badge>{t.label}</Badge><span className="truncate">{t.title}</span></span> },
          { key: "status", header: "Status", sortable: true, sortValue: (t) => statuses.indexOf(t.status), render: (t) => <Badge tone={statusTone[t.status]}>{t.status}</Badge> },
          { key: "priority", header: "Priority", sortable: true, sortValue: (t) => ["Low", "Medium", "High"].indexOf(t.priority) },
          { key: "assignee", header: "Assignee" },
        ]}
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-body-small">
          <input type="checkbox" checked={allOnPage} onChange={() => setSelected((s) => { const n = new Set(s); shown.forEach((r) => (allOnPage ? n.delete(r.id) : n.add(r.id))); return n; })} className="size-4 accent-[var(--ds-color-bg-brand)] focus-visible:focus-ring" />
          Select all on this page
        </label>
        <div className="ms-auto"><Pagination page={page} pageCount={pageCount} onPageChange={setPage} summary={`${rows.length} tasks`} /></div>
      </div>
    </div>
  );
}
