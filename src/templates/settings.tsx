"use client";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import {
  Avatar, Button, Dialog, Divider, ErrorSummary, FormActions, FormSection, Select, Tabs, TextField, Toggle, ToastProvider, useToast,
} from "@/components/ui";

/* Figma: _Template/Settings (Desktop · Tablet · Mobile) + States/Error.
   Validate on submit (never disable Save); a sticky save bar appears once something changes. */
function SettingsBody({ showError }: { showError?: boolean }) {
  const toast = useToast();
  const [tab, setTab] = useState("profile");
  const [name, setName] = useState("Jane Cooper");
  const [email, setEmail] = useState(showError ? "jane@" : "jane@acme.com");
  const [tz, setTz] = useState("mnl");
  const [notif, setNotif] = useState({ email: true, weekly: false, desktop: true });
  const [dirty, setDirty] = useState(!!showError);
  const [errors, setErrors] = useState<{ fieldId: string; message: string }[]>(showError ? [{ fieldId: "settings-email", message: "Enter an email address, like name@company.com" }] : []);
  const [confirm, setConfirm] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = [];
    if (!name.trim()) errs.push({ fieldId: "settings-name", message: "Enter a display name" });
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.push({ fieldId: "settings-email", message: "Enter an email address, like name@company.com" });
    setErrors(errs);
    if (!errs.length) { setDirty(false); toast.show({ message: "Changes saved", tone: "success" }); }
  };
  const err = (id: string) => errors.find((x) => x.fieldId === id)?.message;
  const change = <T,>(set: (v: T) => void) => (v: T) => { set(v); setDirty(true); };

  const profile = (
    <form noValidate onSubmit={save} className="flex flex-col gap-8 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)]">
      <ErrorSummary errors={errors} focusOnMount={!showError} />
      <FormSection title="Profile" description="This information is visible to everyone in the workspace.">
        <div className="flex items-center gap-4"><Avatar name={name || "?"} size="lg" /><Button type="button" variant="secondary" size="sm">Change photo</Button></div>
        <TextField id="settings-name" label="Display name" value={name} onChange={(e) => change(setName)(e.target.value)} error={err("settings-name")} />
        <TextField id="settings-email" label="Email" type="email" value={email} onChange={(e) => change(setEmail)(e.target.value)} error={err("settings-email")} helperText="We’ll send a confirmation if you change it." />
        <Select label="Time zone" value={tz} onChange={(e) => change(setTz)(e.target.value)} options={[{ value: "mnl", label: "(UTC+08:00) Manila" }, { value: "sgp", label: "(UTC+08:00) Singapore" }, { value: "tyo", label: "(UTC+09:00) Tokyo" }, { value: "lon", label: "(UTC+00:00) London" }]} />
      </FormSection>
      <Divider />
      <FormSection title="Notifications" description="Changes apply immediately.">
        <Toggle label="Email notifications" checked={notif.email} onChange={(v) => setNotif((n) => ({ ...n, email: v }))} />
        <Toggle label="Weekly summary" checked={notif.weekly} onChange={(v) => setNotif((n) => ({ ...n, weekly: v }))} />
        <Toggle label="Desktop alerts" checked={notif.desktop} onChange={(v) => setNotif((n) => ({ ...n, desktop: v }))} />
      </FormSection>
      <Divider />
      <FormSection title="Delete workspace" description="Permanently delete Acme, its projects and all member access. This cannot be undone.">
        <div><Button type="button" tone="danger" variant="secondary" onClick={() => setConfirm(true)}>Delete workspace</Button></div>
      </FormSection>
      {dirty && <FormActions variant="sticky" status="You have unsaved changes" onCancel={() => { setName("Jane Cooper"); setEmail("jane@acme.com"); setTz("mnl"); setErrors([]); setDirty(false); }} />}
    </form>
  );

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile, notifications and workspace." />
      <Tabs label="Settings sections" value={tab} onChange={setTab} tabs={[
        { id: "profile", label: "Profile", panel: profile },
        { id: "notifications", label: "Notifications", panel: <p className="text-body-small text-fg-secondary">Notification settings live in the Profile tab in this template.</p> },
        { id: "workspace", label: "Workspace", panel: <p className="text-body-small text-fg-secondary">Workspace name, URL and default role.</p> },
        { id: "billing", label: "Billing", panel: <p className="text-body-small text-fg-secondary">Plan, invoices and payment method.</p> },
      ]} />
      <Dialog open={confirm} onClose={() => setConfirm(false)} size="sm" tone="danger" title="Delete the Acme workspace?"
        description="This permanently deletes 36 projects and removes access for 12 members. You can’t undo this." primaryLabel="Delete workspace" onPrimary={() => setConfirm(false)} />
    </>
  );
}

export function SettingsTemplate({ showError }: { showError?: boolean }) {
  return <ToastProvider><SettingsBody showError={showError} /></ToastProvider>;
}
