"use client";
import { useState, type ReactNode } from "react";
import { PageHeader } from "@/components/app-shell";
import { Button, Card, Chip, EmptyState, Icon, Link, SearchField, TextField } from "@/components/ui";

/* Figma: Starter & Empty States — 9 full-screen scenarios + 5 empties inside components.
   Writing formula: what's empty (title) · why / what happens next (description) · one way forward (action). */

import { scenarios, type Scenario } from "./empty-data";
export { scenarios, type Scenario };

export function EmptyScreen({ scenario }: { scenario: Scenario }) {
  const s = scenario;
  const [q, setQ] = useState("wade");
  return (
    <>
      <PageHeader title={s.page.title} description={s.page.description} actions={s.page.primary ? <Button leadingIcon="plus">{s.page.primary}</Button> : undefined} />
      {s.toolbar === "search" && <div className="max-w-sm"><SearchField label="Search projects" value={q} onChange={setQ} /></div>}
      {s.toolbar === "filters" && (
        <div className="flex flex-wrap items-center gap-2"><div className="w-64"><SearchField label="Search projects" value="" onChange={() => {}} placeholder="Search projects" /></div><Chip onRemove={() => {}}>Design</Chip><Chip onRemove={() => {}}>Archived</Chip></div>
      )}
      <div className="rounded-container border border-line-default bg-surface py-10">
        <EmptyState icon={s.icon} title={s.title} description={s.description} actions={s.actions.length ? <>{s.actions.map((a) => a.variant === "link" ? <Link key={a.label} href="#" className="self-center">{a.label}</Link> : <Button key={a.label} variant={a.variant ?? "primary"}>{a.label}</Button>)}</> : undefined} />
      </div>
    </>
  );
}

/* ---------- Empties inside components: keep the container, the title and the column headers. */
export function InComponentEmpties() {
  const Box = ({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) => (
    <div className={`flex flex-col gap-2 ${className}`}><span className="text-caption-default text-fg-secondary">{title}</span>{children}</div>
  );
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Box title="Card"><Card headingLevel={3} title="Recent activity"><div className="flex flex-col items-center gap-1 py-6 text-center"><span className="text-label-medium">No activity this week</span><span className="text-body-small text-fg-secondary">Updates from your projects will show up here.</span></div></Card></Box>
      <Box title="List">
        <Card headingLevel={3} title="Pending invites"><div className="flex flex-col items-center gap-2 py-4 text-center"><Icon name="mail" size={24} className="text-icon-secondary" /><span className="text-label-medium">No pending invites</span><span className="max-w-xs text-body-small text-fg-secondary">Invite teammates by email — they’ll show up here until they join.</span><Button size="sm" variant="secondary" leadingIcon="plus">Invite member</Button></div></Card>
      </Box>
      <Box title="Table" className="lg:col-span-2">
        <div className="overflow-x-auto rounded-container border border-line-default bg-surface">
          <table className="w-full border-separate border-spacing-0 text-body-small">
            <caption className="sr-only">Invoices</caption>
            <thead><tr>{["Invoice", "Status", "Amount", "Date"].map((h) => <th key={h} scope="col" className="h-10 border-b border-line-default bg-surface-subtle px-4 text-start text-label-small text-fg-secondary">{h}</th>)}</tr></thead>
            <tbody><tr><td colSpan={4} className="px-4 py-8 text-center"><span className="block text-label-medium">No invoices yet</span><span className="text-fg-secondary">Invoices appear here after your first payment.</span></td></tr></tbody>
          </table>
        </div>
      </Box>
      <Box title="Search dropdown">
        <div className="relative">
          <SearchField label="Search projects" value="zzq" onChange={() => {}} />
          <div className="mt-1 rounded-md border border-line-default bg-surface p-3 text-body-small shadow-elevation-2">No matches for “zzq”. Try another word, or <Link href="#" size="sm">search all projects</Link>.</div>
        </div>
      </Box>
      <Box title="Side panel">
        <div className="flex h-80 flex-col rounded-container border border-line-default bg-surface">
          <div className="border-b border-line-default px-4 py-3 text-label-large">Comments</div>
          <div className="flex flex-1 flex-col items-center justify-center gap-1 px-6 text-center"><span className="text-label-medium">No comments yet</span><span className="text-body-small text-fg-secondary">Start the conversation — mention someone with @.</span></div>
          <div className="border-t border-line-default p-3"><TextField label="Add a comment" hideLabel placeholder="Add a comment…" /></div>
        </div>
      </Box>
    </div>
  );
}
