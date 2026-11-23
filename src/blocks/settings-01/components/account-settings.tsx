"use client";
import { useState } from "react";
import { Avatar } from "@/components/ui/display";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/data";
import { RadioGroup, Select, TextField, Textarea, Toggle } from "@/components/ui/form";
import { FormActions, FormSection } from "@/components/ui/patterns";

const sections = [
  { id: "profile", label: "Profile" },
  { id: "preferences", label: "Preferences" },
  { id: "notifications", label: "Notifications" },
  { id: "danger", label: "Delete account" },
];

export function AccountSettings() {
  const [dirty, setDirty] = useState(false);
  const [notify, setNotify] = useState({ mentions: true, digest: true, product: false });
  const touch = () => setDirty(true);
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-heading-h2">Account settings</h1>
        <p className="text-body-medium text-fg-secondary">Manage your profile, how Acme looks for you, and what we email you about.</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <nav aria-label="Settings sections" className="lg:sticky lg:top-20 lg:self-start">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col">
            {sections.map((s, i) => (
              <li key={s.id} className="shrink-0">
                <a href={`#${s.id}`} aria-current={i === 0 ? "location" : undefined}
                  className="flex h-8 items-center rounded-control px-3 text-label-medium text-fg-secondary hover:bg-neutral-hover hover:text-fg-primary focus-visible:focus-ring aria-[current=location]:bg-selected aria-[current=location]:text-fg-brand">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <form className="flex min-w-0 flex-col gap-8 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)]" onChange={touch} onSubmit={(e) => { e.preventDefault(); setDirty(false); }}>
          <div id="profile" className="scroll-mt-20">
            <FormSection title="Profile" description="This is how others see you in Acme.">
              <div className="flex items-center gap-4"><Avatar name="Jane Cooper" size="lg" /><Button type="button" variant="secondary" size="sm">Change photo</Button></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="First name" defaultValue="Jane" autoComplete="given-name" />
                <TextField label="Last name" defaultValue="Cooper" autoComplete="family-name" />
              </div>
              <TextField label="Email" type="email" defaultValue="jane@acme.com" autoComplete="email" helperText="We'll send a link to confirm a new address." />
              <Textarea label="Bio" defaultValue="Product designer. Coffee, maps and long walks." maxLength={160} />
            </FormSection>
          </div>
          <Divider />
          <div id="preferences" className="scroll-mt-20">
            <FormSection title="Preferences" description="Language, time zone and theme for your account.">
              <div className="grid gap-4 xl:grid-cols-2">
                <Select label="Language" defaultValue="en" options={[{ value: "en", label: "English" }, { value: "fil", label: "Filipino" }, { value: "es", label: "Español" }]} />
                <Select label="Time zone" defaultValue="mnl" options={[{ value: "mnl", label: "Manila (GMT+8)" }, { value: "sgp", label: "Singapore (GMT+8)" }, { value: "lon", label: "London (GMT+0)" }]} />
              </div>
              <RadioGroup label="Theme" name="theme" orientation="horizontal" defaultValue="system" onChange={touch}
                options={[{ value: "system", label: "Match system" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />
            </FormSection>
          </div>
          <Divider />
          <div id="notifications" className="scroll-mt-20">
            <FormSection title="Notifications" description="Email only. In-app notifications are always on.">
              <Toggle label="Mentions and replies" checked={notify.mentions} onChange={(v) => { setNotify((n) => ({ ...n, mentions: v })); touch(); }} />
              <Toggle label="Weekly digest" checked={notify.digest} onChange={(v) => { setNotify((n) => ({ ...n, digest: v })); touch(); }} />
              <Toggle label="Product news and tips" checked={notify.product} onChange={(v) => { setNotify((n) => ({ ...n, product: v })); touch(); }} />
            </FormSection>
          </div>
          <Divider />
          <div id="danger" className="scroll-mt-20">
            <FormSection title="Delete account" description="Removes your profile and personal projects for good. Shared projects stay with their teams.">
              <div><Button type="button" variant="secondary" tone="danger" leadingIcon="trash">Delete account…</Button></div>
            </FormSection>
          </div>
          {dirty && <FormActions variant="sticky" status="Unsaved changes" onCancel={() => setDirty(false)} />}
        </form>
      </div>
    </div>
  );
}
