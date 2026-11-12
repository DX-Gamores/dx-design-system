"use client";
import { useState } from "react";
import {
  Avatar, Badge, Button, Card, Checkbox, Dialog, Divider, Link, Radio, Select, SegmentedControl, TextField, Textarea, Toggle,
} from "@/components/ui";

/* Figma: Examples page — five compositions built only from library components. Copy any of them. */

export function SignInExample() {
  return (
    <form noValidate onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-[400px] flex-col gap-4 rounded-container border border-line-default bg-surface p-6 shadow-elevation-1">
      <div className="flex flex-col gap-1"><h3 className="text-heading-h3">Sign in</h3><p className="text-body-small text-fg-secondary">Welcome back. Enter your details to continue.</p></div>
      <TextField label="Email" type="email" placeholder="name@company.com" helperText="We’ll never share your email." />
      <TextField label="Password" type="password" helperText="At least 8 characters." />
      <div className="flex items-center justify-between gap-3"><Checkbox label="Remember me" defaultChecked /><Link href="#" size="sm">Forgot password?</Link></div>
      <Button type="submit" className="w-full">Sign in</Button>
    </form>
  );
}

export function NotificationPreferencesExample() {
  const [all, setAll] = useState(true);
  return (
    <div className="flex w-full max-w-[480px] flex-col gap-4 rounded-container border border-line-default bg-surface p-6">
      <div className="flex flex-col gap-1"><h3 className="flex items-center gap-2 text-heading-h4">Notifications <Badge tone="brand">New</Badge></h3><p className="text-body-small text-fg-secondary">Choose how you want to hear about project activity.</p></div>
      <Toggle label="All notifications" checked={all} onChange={setAll} />
      <fieldset disabled={!all} className="flex flex-wrap gap-x-6 gap-y-2">
        <legend className="sr-only">Channels</legend>
        <Checkbox label="Email" defaultChecked /><Checkbox label="Push" defaultChecked /><Checkbox label="SMS" />
      </fieldset>
      <div className="flex justify-end gap-2"><Button variant="secondary">Cancel</Button><Button>Save preferences</Button></div>
    </div>
  );
}

const projects = [
  { name: "Website redesign", text: "Refresh the marketing site with the new brand and components.", status: ["Active", "success"] as const },
  { name: "Mobile onboarding", text: "Reduce sign-up drop-off with a shorter, guided flow.", status: ["Review", "info"] as const },
  { name: "Billing settings", text: "Let workspace admins manage plans and invoices.", status: ["Overdue", "danger"] as const },
];
export function ProjectGridExample() {
  const [f, setF] = useState("all");
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-heading-h3">Projects</h3><Button leadingIcon="plus">New project</Button></div>
      <div className="overflow-x-auto"><SegmentedControl label="Filter projects" value={f} onChange={setF} options={[{ value: "all", label: "All 12" }, { value: "active", label: "Active 7" }, { value: "review", label: "Review 3" }, { value: "overdue", label: "Overdue 2" }]} /></div>
      <div className="grid gap-4 md:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.name} headingLevel={4} title={p.name} actions={<><Button size="sm" variant="secondary">Open project</Button><Button size="sm" variant="ghost" leadingIcon="share">Share</Button></>}>
            <Badge tone={p.status[1]}>{p.status[0]}</Badge>
            <p className="text-body-small text-fg-secondary">{p.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AccountProfileExample() {
  const [bio, setBio] = useState("Product designer leading the onboarding squad.");
  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-[560px] flex-col gap-5 rounded-container border border-line-default bg-surface p-6">
      <div className="flex items-center gap-4">
        <Avatar name="Jane Cooper" size="lg" />
        <div className="flex flex-col"><span className="flex items-center gap-2 text-label-large">Jane Cooper <Badge tone="success">Verified</Badge></span><span className="text-body-small text-fg-secondary">jane@acme.com</span></div>
      </div>
      <Divider />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Display name" defaultValue="Jane Cooper" />
        <Select label="Time zone" defaultValue="mnl" options={[{ value: "mnl", label: "(UTC+08:00) Manila" }, { value: "sgp", label: "(UTC+08:00) Singapore" }]} />
      </div>
      <Textarea label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={160} helperText={`${bio.length} / 160`} />
      <fieldset className="flex flex-col gap-2"><legend className="pb-2 text-label-medium">Profile visibility</legend><Radio name="vis" label="Everyone in the workspace" defaultChecked /><Radio name="vis" label="Only my team" /></fieldset>
      <Checkbox label="Show my local time" defaultChecked />
      <div className="flex flex-wrap items-center justify-between gap-3"><Link href="#" size="sm">View public profile</Link><div className="flex gap-2"><Button type="button" variant="secondary">Cancel</Button><Button type="submit">Save changes</Button></div></div>
    </form>
  );
}

export function DeleteConfirmationExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button tone="danger" variant="secondary" leadingIcon="trash" onClick={() => setOpen(true)}>Delete “Website redesign”</Button>
      <Dialog open={open} onClose={() => setOpen(false)} tone="danger" title="Delete “Website redesign”?" description="This permanently deletes the project and its 24 files. This action cannot be undone." primaryLabel="Delete project" onPrimary={() => setOpen(false)} />
    </>
  );
}
