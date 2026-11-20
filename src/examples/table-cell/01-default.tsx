/**
 * @title Table Cell
 * @description A data cell in Table. Numbers align to the end and use tabular figures.
 */
"use client";
import { useState } from "react";
import { Table, type SortDir } from "@/components/ui/data";
import { Avatar } from "@/components/ui/display";
import { Badge } from "@/components/ui/feedback";

type Member = { id: string; name: string; email: string; role: string; status: "Active" | "Invited"; projects: number };
const members: Member[] = [
  { id: "1", name: "Jane Cooper", email: "jane@acme.com", role: "Admin", status: "Active", projects: 12 },
  { id: "2", name: "Esther Howard", email: "esther@acme.com", role: "Editor", status: "Active", projects: 7 },
  { id: "3", name: "Cameron Williamson", email: "cameron@acme.com", role: "Viewer", status: "Invited", projects: 0 },
];

export default function Example() {
  const [sort, setSort] = useState<{ key: string; direction: SortDir } | null>({ key: "name", direction: "ascending" });
  const rows = [...members].sort((a, b) => {
    if (!sort) return 0;
    const k = sort.key as keyof Member;
    const r = String(a[k]).localeCompare(String(b[k]), undefined, { numeric: true });
    return sort.direction === "ascending" ? r : -r;
  });
  return (
    <Table<Member>
      caption="Team members"
      rows={rows}
      rowKey={(m) => m.id}
      sort={sort}
      onSortChange={setSort}
      columns={[
        {
          key: "name",
          header: "Name",
          sortable: true,
          render: (m) => (
            <span className="flex items-center gap-3">
              <Avatar name={m.name} size="sm" decorative />
              <span className="flex flex-col"><span className="text-label-medium">{m.name}</span><span className="text-caption-default text-fg-secondary">{m.email}</span></span>
            </span>
          ),
        },
        { key: "role", header: "Role", sortable: true },
        { key: "status", header: "Status", render: (m) => <Badge tone={m.status === "Active" ? "success" : "warning"}>{m.status}</Badge> },
        { key: "projects", header: "Projects", sortable: true, numeric: true },
      ]}
    />
  );
}
