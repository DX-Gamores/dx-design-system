"use client";
import { Alert, Badge, Button, IconButton, TextField } from "@/components/ui";
import { Verdict, VerdictGrid } from "./shared";

/* Mirrors the Figma Content Guidelines page: at a glance, voice, glossary, do & don't. */

export function ContentGlance() {
  const tiles: [string, string][] = [["3", "Voice rules · clear, concise, human"], ["Aa", "Sentence case everywhere"], ["0", "Periods on buttons, labels and titles"], ["7 days", "Max age for “2 hours ago” style dates"]];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tiles.map(([n, l]) => (
        <div key={l} className="flex flex-col gap-1 rounded-container border border-line-default bg-surface p-4"><span className="text-heading-h2">{n}</span><span className="text-body-small text-fg-secondary">{l}</span></div>
      ))}
    </div>
  );
}

export function Voice() {
  const rows: [string, string, string][] = [
    ["Clear", "Your card was declined.", "Oops! Something went sideways with billing."],
    ["Concise", "Invite members", "Click here to invite new members to your workspace"],
    ["Human", "We couldn’t save your changes. Check your connection and try again.", "Error 500: Request failed."],
  ];
  return (
    <div className="flex flex-col gap-3">
      {rows.map(([rule, good, bad]) => (
        <div key={rule} className="grid gap-3 rounded-container border border-line-default bg-surface p-4 md:grid-cols-[120px_1fr_1fr] md:items-center">
          <span className="text-label-large">{rule}</span>
          <span className="flex items-start gap-2 text-body-medium"><span className="text-fg-success">✓</span>“{good}”</span>
          <span className="flex items-start gap-2 text-body-medium text-fg-secondary"><span className="text-fg-danger">✗</span><span className="line-through decoration-line-danger">“{bad}”</span></span>
        </div>
      ))}
    </div>
  );
}

export function Glossary() {
  const rows: [string, string, string][] = [
    ["Sign in · Sign out", "Log in · Login · Log out", "For accounts"],
    ["Delete", "Remove (for permanent loss)", "Delete = gone for good (Danger tone)"],
    ["Remove", "Delete (for group membership)", "Taken out of a group; it still exists"],
    ["Member · workspace · project", "User · team space · board", "Our nouns for people, org and work"],
  ];
  return (
    <div className="overflow-x-auto rounded-container border border-line-default bg-surface">
      <table className="w-full text-body-small">
        <thead className="bg-surface-subtle text-left text-label-small"><tr><th className="px-3 py-2">Use</th><th className="px-3 py-2">Not</th><th className="px-3 py-2">Meaning</th></tr></thead>
        <tbody>
          {rows.map(([use, not, m]) => (
            <tr key={use} className="border-t border-line-default">
              <td className="px-3 py-2"><Badge tone="success">{use}</Badge></td>
              <td className="px-3 py-2 text-fg-secondary line-through">{not}</td>
              <td className="px-3 py-2">{m}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-line-default px-3 py-2 text-caption-default text-fg-secondary">Example from the SaaS admin kit. Each product keeps its own noun list.</p>
    </div>
  );
}

export function ContentDoDont() {
  return (
    <VerdictGrid>
      <Verdict ok note="Sentence case on every label."><div className="flex flex-col items-start gap-2"><Button>Save changes</Button><span className="text-label-large">Pending invites</span></div></Verdict>
      <Verdict ok={false} note="Title Case shouts and slows reading."><div className="flex flex-col items-start gap-2"><Button>Save Changes</Button><span className="text-label-large">Pending Invites</span></div></Verdict>
      <Verdict ok note="Verb + object."><Button tone="danger">Delete project</Button></Verdict>
      <Verdict ok={false} note="“OK”, “Yes”, “Submit” hide the outcome."><Button variant="secondary">OK</Button><Button>Submit</Button></Verdict>
      <Verdict ok note="Links say where they go."><span className="text-label-medium text-fg-brand underline">View billing history</span></Verdict>
      <Verdict ok={false} note="“Learn more” on its own says nothing."><span className="text-label-medium text-fg-brand underline">Learn more</span></Verdict>
      <Verdict ok note="Errors: what happened + how to fix."><div className="w-full max-w-xs"><TextField label="Email" defaultValue="gab@" error="Enter an email address, like name@company.com." /></div></Verdict>
      <Verdict ok={false} note="Blames the person, fixes nothing."><div className="w-full max-w-xs"><TextField label="Email" defaultValue="gab@" error="Invalid input." /></div></Verdict>
      <Verdict ok note="Success: past tense, brief, with Undo."><div className="flex items-center gap-3 rounded-container bg-inverse px-4 py-3 text-fg-inverse"><span className="text-body-small">Project archived</span><span className="text-label-medium underline">Undo</span></div></Verdict>
      <Verdict ok={false} note="Wordy celebration slows people down."><Alert tone="success" title="Your project has been successfully archived!" /></Verdict>
      <Verdict ok note="Unambiguous dates, numerals, en-dash ranges."><span className="flex flex-col gap-1 text-body-medium"><span>12 Nov 2026 · 3:30 PM PHT</span><span>₱1,284.00 · 1–10 of 48 · 3 members</span></span></Verdict>
      <Verdict ok={false} note="“11/12” reads differently in PH, US and EU."><span className="flex flex-col gap-1 text-body-medium"><span>11/12/26 · 15:30</span><span>1284 PHP · 1-10 of 48 · three members</span></span></Verdict>
      <Verdict ok note="Name things specifically."><IconButton icon="more" label="More actions for Jane Cooper" variant="secondary" /><span className="text-caption-default text-fg-secondary">aria-label: “More actions for Jane Cooper”</span></Verdict>
      <Verdict ok={false} note="Twenty rows of “More” are indistinguishable."><IconButton icon="more" label="More" variant="secondary" /><span className="text-caption-default text-fg-secondary">aria-label: “More”</span></Verdict>
    </VerdictGrid>
  );
}
