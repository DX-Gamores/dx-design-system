"use client";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/app-shell";
import {
  Avatar, Badge, Button, Checkbox, EmptyState, List, ListItem, Menu, Pagination, SearchField, Select, Skeleton, Spinner, Table, Tabs, useToast, ToastProvider, type SortDir,
} from "@/components/ui";

/* Figma: _Template/Members (Desktop · Tablet · Mobile) + States: Empty · Loading · Error.
   Search and the role filter work; zero matches shows the "no results" empty state. */
type Member = { id: string; name: string; email: string; role: "Admin" | "Editor" | "Viewer"; status: "Active" | "Invited" | "Suspended"; lastActive: string; order: number };
const all: Member[] = [
  { id: "1", name: "Jane Cooper", email: "jane@acme.com", role: "Admin", status: "Active", lastActive: "Today", order: 0 },
  { id: "2", name: "Wade Warren", email: "wade@acme.com", role: "Editor", status: "Active", lastActive: "Yesterday", order: 1 },
  { id: "3", name: "Esther Howard", email: "esther@acme.com", role: "Viewer", status: "Invited", lastActive: "—", order: 99 },
  { id: "4", name: "Cameron Williamson", email: "cameron@acme.com", role: "Editor", status: "Suspended", lastActive: "3 weeks ago", order: 21 },
  { id: "5", name: "Brooklyn Simmons", email: "brooklyn@acme.com", role: "Viewer", status: "Active", lastActive: "2 days ago", order: 2 },
];
const statusTone = { Active: "success", Invited: "warning", Suspended: "neutral" } as const;

export type MembersState = "default" | "empty" | "loading" | "error";

function MembersBody({ state }: { state: MembersState }) {
  const toast = useToast();
  const [tab, setTab] = useState("members");
  const [q, setQ] = useState(state === "empty" ? "wade" : "");
  const [role, setRole] = useState(state === "empty" ? "Admin" : "");
  const [sort, setSort] = useState<{ key: string; direction: SortDir } | null>({ key: "name", direction: "ascending" });
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const rows = useMemo(() => all.filter((m) => (!q || `${m.name} ${m.email}`.toLowerCase().includes(q.toLowerCase())) && (!role || m.role === role)), [q, role]);
  const toggle = (id: string) => setPicked((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  const toolbar = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="sm:max-w-sm sm:flex-1"><SearchField label="Search members" placeholder="Search by name or email" value={q} onChange={setQ} /></div>
      <div className="sm:w-48"><Select label="Role" hideLabel value={role} onChange={(e) => setRole(e.target.value)} placeholder="All roles" options={[{ value: "Admin", label: "Admin" }, { value: "Editor", label: "Editor" }, { value: "Viewer", label: "Viewer" }]} /></div>
      {picked.size > 0 && <div className="flex items-center gap-2 sm:ms-auto"><span className="text-body-small text-fg-secondary">{picked.size} selected</span><Button size="sm" variant="secondary" tone="danger" onClick={() => { toast.show({ message: `${picked.size} member${picked.size > 1 ? "s" : ""} removed`, action: { label: "Undo", onClick: () => {} } }); setPicked(new Set()); }}>Remove</Button></div>}
    </div>
  );

  let content;
  if (state === "loading") {
    content = (
      <div aria-busy="true" className="flex flex-col gap-3 rounded-container border border-line-default bg-surface p-4">
        <span role="status" className="flex items-center gap-2 text-body-small text-fg-secondary"><Spinner size="sm" label="" />Loading members…</span>
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="flex items-center gap-3"><Skeleton shape="circle" /><div className="flex flex-1 flex-col gap-2"><Skeleton className="w-1/3" /><Skeleton className="w-1/2" /></div></div>)}
      </div>
    );
  } else if (state === "error") {
    content = (
      <div className="rounded-container border border-line-default bg-surface">
        <EmptyState icon="alert-triangle" title="Couldn’t load members" description="Check your connection and try again. Your data is safe." actions={<Button variant="secondary" leadingIcon="refresh">Try again</Button>} />
      </div>
    );
  } else if (!rows.length) {
    content = (
      <div className="rounded-container border border-line-default bg-surface">
        <EmptyState icon="search" title={q ? `No members match “${q}”` : "No members match these filters"} description="Try a different name or email, or clear the role filter."
          actions={<Button variant="secondary" onClick={() => { setQ(""); setRole(""); }}>Clear filters</Button>} />
      </div>
    );
  } else {
    content = (
      <>
        {/* Mobile: a list (the table's essential columns only). Spec: switch tables to List Items under 600px. */}
        <List label="Members" className="rounded-container border border-line-default bg-surface sm:hidden">
          {rows.map((m) => (
            <ListItem key={m.id} title={m.name} description={`${m.role} · ${m.email}`} leading={<Avatar name={m.name} decorative />}
              meta={<Badge tone={statusTone[m.status]}>{m.status}</Badge>}
              action={<Menu label={`More actions for ${m.name}`} items={[{ label: "Change role", icon: "edit" }, { label: "Remove from workspace", icon: "trash", tone: "danger", separatorBefore: true }]} />} />
          ))}
        </List>
        <div className="hidden sm:block">
        <Table<Member> caption="Members" captionHidden rows={rows} rowKey={(m) => m.id} sort={sort} onSortChange={setSort} columns={[
          { key: "select", header: "Select", headerHidden: true, width: 48, render: (m) => <Checkbox label={<span className="sr-only">Select {m.name}</span>} checked={picked.has(m.id)} onChange={() => toggle(m.id)} /> },
          { key: "name", header: "Member", sortable: true, render: (m) => <span className="flex items-center gap-3"><Avatar name={m.name} size="sm" decorative /><span className="flex min-w-0 flex-col"><span className="text-label-medium">{m.name}</span><span className="text-caption-default text-fg-secondary">{m.email}</span></span></span> },
          { key: "role", header: "Role", sortable: true },
          { key: "status", header: "Status", render: (m) => <Badge tone={statusTone[m.status]}>{m.status}</Badge> },
          { key: "lastActive", header: "Last active", sortable: true, sortValue: (m) => m.order },
          { key: "actions", header: "Actions", width: 64, render: (m) => <Menu label={`More actions for ${m.name}`} items={[{ label: "Change role", icon: "edit" }, { label: m.status === "Invited" ? "Resend invite" : "Send message", icon: "send" }, { label: "Remove from workspace", icon: "trash", tone: "danger", separatorBefore: true, onSelect: () => toast.show({ message: `${m.name} removed`, action: { label: "Undo", onClick: () => {} } }) }]} /> },
        ]} />
        </div>
        <Pagination page={page} pageCount={3} onPageChange={setPage} summary={`Showing 1–${rows.length} of 12`} />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Members" description="Manage who can access the Acme workspace and what they can do."
        actions={<><Button variant="secondary" leadingIcon="download">Export</Button><Button leadingIcon="plus">Invite member</Button></>} />
      <Tabs label="Member views" value={tab} onChange={setTab} tabs={[
        { id: "members", label: "Members", count: 12, panel: <div className="flex flex-col gap-4">{toolbar}{content}</div> },
        { id: "invites", label: "Pending invites", count: 2, panel: <p className="text-body-small text-fg-secondary">2 invitations are waiting for a reply.</p> },
        { id: "roles", label: "Roles", panel: <p className="text-body-small text-fg-secondary">Admin, Editor and Viewer.</p> },
        { id: "audit", label: "Audit log", panel: <p className="text-body-small text-fg-secondary">Every change to membership, for 90 days.</p> },
      ]} />
    </>
  );
}

export function MembersTemplate({ state = "default" }: { state?: MembersState }) {
  return <ToastProvider><MembersBody state={state} /></ToastProvider>;
}
