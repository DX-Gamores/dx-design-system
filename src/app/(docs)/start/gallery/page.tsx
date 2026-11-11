"use client";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import {
  AILabel, Alert, Avatar, Badge, Button, Card, Checkbox, Citation, EmptyState, Icon, IconButton, iconNames, Progress,
  SegmentedControl, Select, Skeleton, Spinner, Stepper, Tabs, TextField, Textarea, Toggle,
} from "@/components/ui";
import { dataviz } from "@dxform/tokens";

// Component gallery — the code twin of the Figma pages. Use it to check a brand or theme change.
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-heading-h3">{title}</h2>
      <div className="flex flex-col gap-4 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)]">{children}</div>
    </section>
  );
}
const Row = ({ children }: { children: React.ReactNode }) => <div className="flex flex-wrap items-center gap-3">{children}</div>;

export default function Kit() {
  const [on, setOn] = useState(true);
  const [view, setView] = useState("list");
  const [tab, setTab] = useState("members");
  return (
    <>
      <PageHeader title="Components" description="Every coded component, in every variant. Switch brand, theme and density in the header." />
      <Section title="Button & Icon Button">
        {(["primary", "secondary", "ghost"] as const).map((v) => (
          <Row key={v}>
            <Button variant={v} size="lg">Large</Button>
            <Button variant={v}>Medium</Button>
            <Button variant={v} size="sm">Small</Button>
            <Button variant={v} leadingIcon="plus">With icon</Button>
            <Button variant={v} tone="danger" leadingIcon="trash">Delete</Button>
            <Button variant={v} disabled>Disabled</Button>
            <IconButton icon="edit" label="Edit" variant={v} />
          </Row>
        ))}
        <Row><Button loading>Saving…</Button></Row>
      </Section>
      <Section title="Fields">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Email" placeholder="name@company.com" helperText="We'll never share it." />
          <TextField label="Search" leadingIcon="search" placeholder="Search projects…" />
          <TextField label="Company" defaultValue="DXFORM" error="Company name is already taken — try another." />
          <TextField label="Workspace ID" defaultValue="dx-2026" disabled helperText="Set by your admin." />
          <Select label="Time zone" placeholder="Select an option" options={[{ value: "mnl", label: "Asia/Manila" }, { value: "sgp", label: "Asia/Singapore" }]} />
          <Textarea label="Bio" placeholder="A short introduction" helperText="Up to 160 characters." maxLength={160} />
        </div>
        <Row>
          <Checkbox label="Email me product updates" defaultChecked />
          <Checkbox label="I agree to the Terms and Privacy Policy, including how DXFORM processes my data." />
          <Toggle label="Email notifications" checked={on} onChange={setOn} />
        </Row>
      </Section>
      <Section title="Navigation">
        <SegmentedControl label="View" value={view} onChange={setView} options={[{ value: "list", label: "List", icon: "list-view" }, { value: "board", label: "Board", icon: "grid-view" }, { value: "calendar", label: "Calendar", icon: "calendar" }]} />
        <Tabs label="Member views" value={tab} onChange={setTab} tabs={[{ id: "members", label: "Members", count: 12, panel: <p className="text-fg-secondary">Members panel</p> }, { id: "invites", label: "Invites", count: 2, panel: <p className="text-fg-secondary">Invites panel</p> }, { id: "roles", label: "Roles", panel: <p className="text-fg-secondary">Roles panel</p> }]} />
        <Stepper steps={[{ label: "Account", description: "Email and password", status: "complete" }, { label: "Company", description: "Fix 2 fields", status: "error" }, { label: "Team", description: "Invite people", status: "upcoming" }, { label: "Billing", status: "upcoming" }]} onStepClick={() => {}} />
      </Section>
      <Section title="Feedback">
        <Row>{(["neutral", "brand", "success", "warning", "danger", "info"] as const).map((t) => <Badge key={t} tone={t}>{t}</Badge>)}</Row>
        {(["info", "success", "warning", "danger"] as const).map((t) => (
          <Alert key={t} tone={t} title={`${t[0].toUpperCase()}${t.slice(1)} alert`} onDismiss={() => {}}>Short explanation of what happened and what to do next.</Alert>
        ))}
        <Row><Spinner size="sm" /><Spinner /><Spinner size="lg" /></Row>
        <div className="flex max-w-sm flex-col gap-2"><Skeleton shape="circle" /><Skeleton /><Skeleton className="w-2/3" /></div>
        <div className="max-w-sm"><Progress label="Uploading files" value={60} /></div>
        <EmptyState icon="search" title="No results for “wade”" description="Check the spelling or clear the filters." actions={<Button variant="secondary">Clear filters</Button>} />
      </Section>
      <Section title="Display">
        <Row><Avatar name="Maria Santos" size="sm" /><Avatar name="Maria Santos" /><Avatar name="Maria Santos" size="lg" /></Row>
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Flat card" actions={<><Button size="sm">Primary</Button><Button size="sm" variant="secondary">Secondary</Button></>}>Supporting text about one subject.</Card>
          <Card title="Raised card" elevation="raised">Use on the canvas or when it needs emphasis.</Card>
        </div>
      </Section>
      <Section title="AI patterns">
        <div className="flex max-w-xl flex-col gap-3 rounded-container border border-line-default p-4" aria-live="polite">
          <Row><AILabel /><span className="text-caption-default text-fg-secondary">Just now · from 2 sources</span></Row>
          <p>You have 12 vacation days left this year. Up to 5 unused days roll over to 2027.</p>
          <Row><Citation n={1} title="Leave policy 2026" href="#" /><Citation n={2} title="HR portal" href="#" /></Row>
        </div>
      </Section>
      <Section title="Data viz palette">
        <Row>
          {dataviz.series.map((c, i) => (
            <span key={c} className="flex items-center gap-2 text-label-small"><span className="size-6 rounded-sm" style={{ background: c }} />series-{i + 1}</span>
          ))}
        </Row>
      </Section>
      <Section title={`Icons (${iconNames.length})`}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-3">
          {iconNames.map((n) => (
            <div key={n} className="flex flex-col items-center gap-2 rounded-md p-2 text-caption-default text-fg-secondary hover:bg-neutral-hover">
              <Icon name={n} size={24} className="text-icon-primary" />
              {n}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
