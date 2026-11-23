"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, Card } from "@/components/ui/display";
import { Table } from "@/components/ui/data";
import { Badge, Progress } from "@/components/ui/feedback";
import { Select, TextField } from "@/components/ui/form";
import { Tabs } from "@/components/ui/navigation";
import { Menu } from "@/components/ui/overlays";
import { FormActions } from "@/components/ui/patterns";

type Member = { name: string; email: string; role: string; status: "Active" | "Invited" };
const members: Member[] = [
  { name: "Jane Cooper", email: "jane@acme.com", role: "owner", status: "Active" },
  { name: "Wade Warren", email: "wade@acme.com", role: "admin", status: "Active" },
  { name: "Esther Howard", email: "esther@acme.com", role: "member", status: "Active" },
  { name: "Cameron Williamson", email: "cameron@acme.com", role: "member", status: "Invited" },
];
const roles = [{ value: "owner", label: "Owner" }, { value: "admin", label: "Admin" }, { value: "member", label: "Member" }, { value: "viewer", label: "Viewer" }];
const invoices = [
  { id: "INV-2026-011", date: "Nov 1, 2026", amount: "$480.00" },
  { id: "INV-2026-010", date: "Oct 1, 2026", amount: "$480.00" },
  { id: "INV-2026-009", date: "Sep 1, 2026", amount: "$420.00" },
];

function General() {
  return (
    <Card headingLevel={2} title="Workspace">
      <form className="flex max-w-xl flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <TextField label="Workspace name" defaultValue="Acme Inc" />
        <TextField label="Workspace URL" defaultValue="acme" helperText="acme.app/acme — changing it breaks old links." />
        <Select label="Default role for new members" defaultValue="member" options={roles.slice(1)} />
        <FormActions />
      </form>
    </Card>
  );
}

function Members() {
  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-3 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)] sm:flex-row sm:items-end" onSubmit={(e) => e.preventDefault()}>
        <div className="flex-1"><TextField label="Invite by email" type="email" placeholder="name@company.com" /></div>
        <div className="sm:w-40"><Select label="Role" defaultValue="member" options={roles.slice(1)} /></div>
        <Button type="submit" leadingIcon="send">Send invite</Button>
      </form>
      <Table<Member>
        caption="Members"
        rows={members}
        rowKey={(m) => m.email}
        columns={[
          { key: "name", header: "Name", render: (m) => <span className="flex items-center gap-3"><Avatar name={m.name} decorative /><span className="flex flex-col"><span className="text-label-medium">{m.name}</span><span className="text-caption-default text-fg-secondary">{m.email}</span></span></span> },
          { key: "role", header: "Role", width: 160, render: (m) => <Select label={`Role for ${m.name}`} hideLabel defaultValue={m.role} options={roles} disabled={m.role === "owner"} /> },
          { key: "status", header: "Status", render: (m) => <Badge tone={m.status === "Active" ? "success" : "warning"}>{m.status}</Badge> },
          { key: "actions", header: "Actions", headerHidden: true, width: 56, render: (m) => <Menu label={`More actions for ${m.name}`} placement={members.indexOf(m) < 2 ? "bottom-end" : "top-end"} items={[{ label: m.status === "Invited" ? "Resend invite" : "View profile", icon: m.status === "Invited" ? "send" : "user" }, { label: "Remove from team", icon: "trash", tone: "danger", separatorBefore: true, disabled: m.role === "owner" }]} /> },
        ]}
      />
    </div>
  );
}

function Billing() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card headingLevel={2} title="Plan" actions={<><Button>Upgrade to Business</Button><Button variant="secondary">Compare plans</Button></>}>
        <p className="flex items-baseline gap-2"><span className="text-heading-h2">Pro</span><span className="text-body-small text-fg-secondary">$12 per member / month · renews Dec 1</span></p>
        <Progress value={80} label="Seats (8 of 10)" />
        <Progress value={46} label="Storage (46 of 100 GB)" />
      </Card>
      <Card headingLevel={2} title="Invoices">
        <ul className="flex flex-col divide-y divide-line-default">
          {invoices.map((i) => (
            <li key={i.id} className="flex items-center gap-3 py-2">
              <span className="flex flex-1 flex-col"><span className="text-label-medium">{i.date}</span><span className="text-caption-default text-fg-secondary">{i.id}</span></span>
              <span className="tabular-nums">{i.amount}</span>
              <Button variant="ghost" size="sm" leadingIcon="download" aria-label={`Download ${i.id}`}>PDF</Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function TeamSettings() {
  const [tab, setTab] = useState("members");
  return (
    <Tabs label="Team settings" value={tab} onChange={setTab}
      tabs={[
        { id: "general", label: "General", panel: <General /> },
        { id: "members", label: "Members", count: members.length, panel: <Members /> },
        { id: "billing", label: "Billing", panel: <Billing /> },
      ]} />
  );
}
