"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/feedback";
import { Table, type SortDir } from "@/components/ui/data";

type Row = { id: string; title: string; type: string; status: "Done" | "In progress" | "Not started"; target: number; limit: number; reviewer: string };
const rows: Row[] = [
  { id: "1", title: "Cover page", type: "Cover page", status: "In progress", target: 18, limit: 5, reviewer: "Eddie Lake" },
  { id: "2", title: "Table of contents", type: "Table of contents", status: "Done", target: 29, limit: 24, reviewer: "Eddie Lake" },
  { id: "3", title: "Executive summary", type: "Narrative", status: "Done", target: 10, limit: 13, reviewer: "Eddie Lake" },
  { id: "4", title: "Technical approach", type: "Narrative", status: "Done", target: 27, limit: 23, reviewer: "Jamik Tashpulatov" },
  { id: "5", title: "Design", type: "Narrative", status: "In progress", target: 2, limit: 16, reviewer: "Jamik Tashpulatov" },
  { id: "6", title: "Capabilities", type: "Narrative", status: "In progress", target: 20, limit: 8, reviewer: "Jamik Tashpulatov" },
  { id: "7", title: "Integration with existing systems", type: "Narrative", status: "Not started", target: 19, limit: 21, reviewer: "Assign reviewer" },
];
const tone = { Done: "success", "In progress": "info", "Not started": "neutral" } as const;

export function DocumentsTable() {
  const [sort, setSort] = useState<{ key: string; direction: SortDir } | null>({ key: "title", direction: "ascending" });
  return (
    <Table<Row>
      caption="Documents"
      rows={rows}
      rowKey={(r) => r.id}
      sort={sort}
      onSortChange={setSort}
      columns={[
        { key: "title", header: "Header", sortable: true },
        { key: "type", header: "Section type", sortable: true },
        { key: "status", header: "Status", sortable: true, render: (r) => <Badge tone={tone[r.status]}>{r.status}</Badge> },
        { key: "target", header: "Target", numeric: true, sortable: true },
        { key: "limit", header: "Limit", numeric: true, sortable: true },
        { key: "reviewer", header: "Reviewer", render: (r) => <span className={r.reviewer === "Assign reviewer" ? "text-fg-secondary" : ""}>{r.reviewer}</span> },
      ]}
    />
  );
}
