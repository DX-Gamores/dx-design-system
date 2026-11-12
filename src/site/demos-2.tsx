"use client";
import { useEffect, useState, type ReactNode } from "react";
import {
  Accordion, AccordionItem, AIResponse, Avatar, Badge, Breadcrumbs, Button, Calendar, Chip, Combobox, DatePicker, Dialog, Divider, Drawer,
  ErrorSummary, FileUpload, FormActions, FormSection, IconButton, Link, List, ListItem, Menu, Pagination, Popover, RadioGroup, RangeSlider,
  SearchField, Slider, Table, TextField, Toggle, ToastProvider, Tooltip, useToast, Checkbox, type DateRange, type ListOption, type SortDir, type UploadItem,
} from "@/components/ui";
import { PageHeader } from "@/components/app-shell";

/* Live examples for the components coded in Phase 3. */
const Row = ({ children }: { children: ReactNode }) => <div className="flex flex-wrap items-center gap-3">{children}</div>;
const Stack = ({ children }: { children: ReactNode }) => <div className="flex flex-col gap-4">{children}</div>;
const Note = ({ children }: { children: ReactNode }) => <p className="text-caption-default text-fg-secondary">{children}</p>;

const people: ListOption[] = [
  { value: "jane", label: "Jane Cooper", description: "jane@acme.com", icon: "user" },
  { value: "esther", label: "Esther Howard", description: "esther@acme.com", icon: "user" },
  { value: "cameron", label: "Cameron Williamson", description: "cameron@acme.com", icon: "user" },
  { value: "brooklyn", label: "Brooklyn Simmons", description: "brooklyn@acme.com", icon: "user" },
  { value: "leslie", label: "Leslie Alexander", description: "Deactivated", icon: "user", disabled: true },
  { value: "guy", label: "Guy Hawkins", description: "guy@acme.com", icon: "user" },
];
function ComboboxDemo() {
  const [v, setV] = useState<string | null>("esther");
  const [list, setList] = useState(people);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Combobox label="Assignee" options={list} value={v} onChange={setV} helperText="Type a name or email" recent={list.slice(0, 2)} showKeyboardHint
        onCreate={(q) => { const o = { value: q.toLowerCase(), label: q, description: "New person", icon: "plus" as const }; setList((l) => [...l, o]); setV(o.value); }} />
      <Note>Try typing “an”, use ↑ ↓ and Enter, Esc to close. Type a new name to see “Create”. Selected: <strong>{list.find((p) => p.value === v)?.label ?? "none"}</strong></Note>
    </div>
  );
}

function DateDemo() {
  const [d, setD] = useState<Date | null>(null);
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const today = new Date();
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Stack>
        <DatePicker label="Due date" value={d} onChange={setD} min={today} />
        <Note>Type “11/18”, “Nov 18” or use the calendar button. Dates before today are disabled.</Note>
      </Stack>
      <Stack>
        <span className="text-label-medium">Report range (inline calendar)</span>
        <Calendar mode="range" range={range} onRangeChange={setRange} />
        <Note>{range.start ? `${range.start.toDateString()} → ${range.end?.toDateString() ?? "pick an end date"}` : "Click a start date, then an end date."}</Note>
      </Stack>
    </div>
  );
}

function RadioDemo() {
  const [v, setV] = useState("m");
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <RadioGroup label="Billing cycle" name="cycle" value={v} onChange={setV} options={[{ value: "m", label: "Monthly · ₱499 per member" }, { value: "y", label: "Yearly · ₱4,990 per member (2 months free)" }, { value: "c", label: "Custom contract", disabled: true }]} />
      <RadioGroup label="Notify me" name="notify" orientation="horizontal" defaultValue="all" error="Choose how you want to be notified." options={[{ value: "all", label: "All activity" }, { value: "mentions", label: "Mentions only" }, { value: "none", label: "Nothing" }]} />
    </div>
  );
}

const peso = (n: number) => `₱${n.toLocaleString("en-PH")}`;
function SliderDemo() {
  const [v, setV] = useState(40);
  const [r, setR] = useState<[number, number]>([2000, 8000]);
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Slider label="Volume" value={v} onChange={setV} format={(n) => `${n}%`} />
      <RangeSlider label="Price" value={r} onChange={setR} min={0} max={10000} step={500} format={peso} showInputs />
      <Slider label="Locked by admin" value={70} onChange={() => {}} disabled />
      <Note>Drag, click the rail, or use the keys: ← → one step, Page Up/Down 10%, Home/End min/max. The number boxes mean dragging is never required.</Note>
    </div>
  );
}

function ChipDemo() {
  const [sel, setSel] = useState(new Set(["Design"]));
  const [tags, setTags] = useState(["Q4 launch", "Billing", "Urgent"]);
  return (
    <Stack>
      <div role="group" aria-label="Filter by team" className="flex flex-wrap gap-2">
        {["Design", "Web", "Mobile", "Data"].map((t) => <Chip key={t} selected={sel.has(t)} onToggle={(on) => setSel((s) => { const n = new Set(s); if (on) n.add(t); else n.delete(t); return n; })}>{t}</Chip>)}
        <Chip onToggle={() => {}} disabled>Archived</Chip>
      </div>
      <div className="flex flex-wrap gap-2">{tags.map((t) => <Chip key={t} onRemove={() => setTags((l) => l.filter((x) => x !== t))}>{t}</Chip>)}</div>
      <Note>Filter chips are toggle buttons (aria-pressed). Tags have a remove button named “Remove …”.</Note>
    </Stack>
  );
}

function UploadDemo() {
  const [items, setItems] = useState<UploadItem[]>([]);
  useEffect(() => {
    if (!items.some((i) => i.progress !== undefined && i.progress < 100)) return;
    const t = setTimeout(() => setItems((l) => l.map((i) => (i.progress !== undefined && i.progress < 100 ? { ...i, progress: Math.min(100, i.progress + 20) } : i))), 300);
    return () => clearTimeout(t);
  }, [items]);
  return (
    <div className="max-w-xl">
      <FileUpload accept=".pdf,.png,.jpg" maxSize="10MB" items={items}
        onFiles={(ok, bad) => setItems((l) => [...l, ...ok.map((file) => ({ file, progress: 0 })), ...bad])}
        onRemove={(f) => setItems((l) => l.filter((i) => i.file !== f))} />
    </div>
  );
}

function ToastButtons() {
  const toast = useToast();
  return (
    <Row>
      <Button variant="secondary" onClick={() => toast.show({ message: "Project archived", action: { label: "Undo", onClick: () => toast.show({ message: "Project restored", tone: "success" }) } })}>Archive project</Button>
      <Button variant="secondary" onClick={() => toast.show({ message: "Changes saved", tone: "success" })}>Save</Button>
      <Button variant="secondary" tone="danger" onClick={() => toast.show({ message: "Upload failed. Check your connection.", tone: "danger" })}>Fail an upload</Button>
    </Row>
  );
}

function OverlayDemo() {
  const [dlg, setDlg] = useState<"invite" | "delete" | null>(null);
  const [drawer, setDrawer] = useState(false);
  return (
    <Stack>
      <Row>
        <Button onClick={() => setDlg("invite")}>Invite a member</Button>
        <Button tone="danger" variant="secondary" onClick={() => setDlg("delete")}>Delete project</Button>
        <Button variant="secondary" leadingIcon="filter" onClick={() => setDrawer(true)}>Filters</Button>
      </Row>
      <Dialog open={dlg === "invite"} onClose={() => setDlg(null)} title="Invite a member" description="They’ll get an email with a link to join DXFORM." primaryLabel="Send invite" onPrimary={() => setDlg(null)}>
        <TextField label="Email" type="email" placeholder="name@company.com" />
      </Dialog>
      <Dialog open={dlg === "delete"} onClose={() => setDlg(null)} size="sm" tone="danger" title="Delete “Q4 launch”?" description="This deletes 24 tasks and their files for everyone. You can’t undo this." primaryLabel="Delete project" onPrimary={() => setDlg(null)} />
      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Filters" footer={<><Button variant="secondary" onClick={() => setDrawer(false)}>Clear</Button><Button onClick={() => setDrawer(false)}>Show 12 results</Button></>}>
        <Checkbox label="Assigned to me" defaultChecked />
        <Checkbox label="Has attachments" />
        <RadioGroup label="Status" name="status" defaultValue="open" options={[{ value: "open", label: "Open" }, { value: "done", label: "Done" }, { value: "any", label: "Any" }]} />
      </Drawer>
      <Note>Focus moves into the dialog, Tab stays inside, Esc or a click on the backdrop closes it, and focus returns to the button. Delete focuses Cancel first.</Note>
    </Stack>
  );
}

function PopoverDemo() {
  return (
    <Row>
      <Popover title="Billing contact" description="Invoices and payment reminders go to this address."
        trigger={(p) => <Button variant="secondary" trailingIcon="chevron-down" {...p}>Billing contact</Button>}>
        <TextField label="Email" defaultValue="billing@dxform.ph" />
        <div className="flex justify-end gap-2"><Button size="sm">Save</Button></div>
      </Popover>
      <Tooltip content="Edit member"><IconButton icon="edit" label="Edit Jane Cooper" variant="secondary" /></Tooltip>
    </Row>
  );
}

function MenuDemo() {
  const [last, setLast] = useState("—");
  return (
    <Stack>
      <Row>
        <span className="text-body-medium">Esther Howard</span>
        <Menu label="More actions for Esther Howard" items={[
          { label: "Edit role", icon: "edit", shortcut: "E", onSelect: () => setLast("Edit role") },
          { label: "Copy email", icon: "copy", onSelect: () => setLast("Copy email") },
          { label: "Resend invite", icon: "send", disabled: true },
          { label: "Remove from workspace", icon: "trash", tone: "danger", separatorBefore: true, onSelect: () => setLast("Remove") },
        ]} />
        <Menu label="Sort by" placement="bottom-start" trigger={(p) => <Button variant="secondary" trailingIcon="chevron-down" {...p}>Sort by</Button>}
          items={[{ label: "Name", onSelect: () => setLast("Sort: name") }, { label: "Last active", onSelect: () => setLast("Sort: last active") }, { label: "Role", onSelect: () => setLast("Sort: role") }]} />
      </Row>
      <Note>Last action: {last}. Keyboard: Enter or ↓ opens, ↑ ↓ move, a letter jumps, Esc closes and returns focus.</Note>
    </Stack>
  );
}

function SearchDemo() {
  const [q, setQ] = useState("");
  const all = ["Q4 launch", "Billing revamp", "Brand refresh", "Mobile onboarding", "Data warehouse"];
  const hits = all.filter((p) => p.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Stack>
        <SearchField label="Search projects" value={q} onChange={setQ} placeholder="Search projects" />
        <SearchField label="Search members" value="" onChange={() => {}} size="sm" placeholder="Search members" />
      </Stack>
      <ul aria-live="polite" className="flex flex-col gap-1 text-body-small">{hits.length ? hits.map((h) => <li key={h}>{h}</li>) : <li className="text-fg-secondary">No projects match “{q}”.</li>}</ul>
    </div>
  );
}

function NavDemo() {
  const [page, setPage] = useState(1);
  return (
    <Stack>
      <Breadcrumbs items={[{ label: "Settings", href: "#" }, { label: "Workspace", href: "#" }, { label: "Team members" }]} />
      <PageHeader headingLevel={2} title="Team members" description="People who can access this workspace." actions={<Button leadingIcon="plus">Invite people</Button>} />
      <Pagination page={page} pageCount={5} onPageChange={setPage} summary={`Showing ${(page - 1) * 10 + 1}–${Math.min(page * 10, 48)} of 48`} />
      <Note>App Header, Sidebar, Nav Item and Skip Link are live in this site’s own frame and in the starter app.</Note>
    </Stack>
  );
}

type Member = { id: string; name: string; email: string; role: string; status: "Active" | "Invited"; projects: number };
const members: Member[] = [
  { id: "1", name: "Jane Cooper", email: "jane@acme.com", role: "Admin", status: "Active", projects: 12 },
  { id: "2", name: "Esther Howard", email: "esther@acme.com", role: "Editor", status: "Active", projects: 7 },
  { id: "3", name: "Cameron Williamson", email: "cameron@acme.com", role: "Viewer", status: "Invited", projects: 0 },
  { id: "4", name: "Brooklyn Simmons", email: "brooklyn@acme.com", role: "Editor", status: "Active", projects: 21 },
];
function ListsTablesDemo() {
  const [sort, setSort] = useState<{ key: string; direction: SortDir } | null>({ key: "name", direction: "ascending" });
  return (
    <Stack>
      <List label="Team members" className="rounded-container border border-line-default bg-surface">
        {members.slice(0, 3).map((m) => (
          <ListItem key={m.id} title={m.name} description={m.email} leading={<Avatar name={m.name} decorative />}
            meta={<Badge tone={m.status === "Active" ? "success" : "warning"}>{m.status}</Badge>}
            action={<Menu label={`More actions for ${m.name}`} items={[{ label: "Edit role", icon: "edit" }, { label: "Remove", icon: "trash", tone: "danger", separatorBefore: true }]} />} />
        ))}
      </List>
      <Table<Member> caption="Team members" rows={members} rowKey={(m) => m.id} sort={sort} onSortChange={setSort} columns={[
        { key: "name", header: "Name", sortable: true, render: (m) => <span className="flex items-center gap-3"><Avatar name={m.name} size="sm" decorative /><span className="flex flex-col"><span className="text-label-medium">{m.name}</span><span className="text-caption-default text-fg-secondary">{m.email}</span></span></span> },
        { key: "role", header: "Role", sortable: true },
        { key: "status", header: "Status", render: (m) => <Badge tone={m.status === "Active" ? "success" : "warning"}>{m.status}</Badge> },
        { key: "projects", header: "Projects", sortable: true, numeric: true },
        { key: "actions", header: "Actions", width: 64, render: (m) => <Menu label={`More actions for ${m.name}`} items={[{ label: "Edit role", icon: "edit" }, { label: "Remove", icon: "trash", tone: "danger", separatorBefore: true }]} /> },
      ]} />
    </Stack>
  );
}

function FormDemo() {
  const [errors, setErrors] = useState<{ fieldId: string; message: string }[]>([]);
  const [dirty, setDirty] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = [];
    const val = (id: string) => (document.getElementById(id) as HTMLInputElement | null)?.value ?? "";
    if (!val("demo-name").trim()) errs.push({ fieldId: "demo-name", message: "Enter your full name" });
    if (!/^\S+@\S+\.\S+$/.test(val("demo-email"))) errs.push({ fieldId: "demo-email", message: "Enter an email address, like name@company.com" });
    setErrors(errs); if (!errs.length) setDirty(false);
  };
  const err = (id: string) => errors.find((x) => x.fieldId === id)?.message;
  return (
    <form noValidate onSubmit={submit} onChange={() => setDirty(true)} className="flex flex-col gap-6">
      <ErrorSummary errors={errors} />
      <FormSection title="Profile" description="This information is visible to everyone in the workspace.">
        <TextField id="demo-name" label="Full name" error={err("demo-name")} />
        <TextField id="demo-email" label="Work email" type="email" error={err("demo-email")} />
      </FormSection>
      <Divider />
      <FormSection title="Notifications" description="Choose what we email you about.">
        <Toggle label="Weekly summary" checked onChange={() => {}} />
      </FormSection>
      <FormActions variant="sticky" status={dirty ? "You have unsaved changes" : undefined} onCancel={() => { setErrors([]); setDirty(false); }} />
      <Note>Submit with empty fields: the summary appears, takes focus, and each link jumps to its field. Save is never disabled.</Note>
    </form>
  );
}

function AIDemo() {
  const full = "You have 12 vacation days left this year. Up to 5 unused days roll over to 2027; anything above that expires on Dec 31.";
  const [n, setN] = useState(full.length);
  const [status, setStatus] = useState<"streaming" | "complete" | "stopped" | "error">("complete");
  useEffect(() => {
    if (status !== "streaming") return;
    if (n >= full.length) { setStatus("complete"); return; }
    const t = setTimeout(() => setN((x) => x + 4), 40);
    return () => clearTimeout(t);
  }, [n, status, full.length]);
  const sources = [{ title: "Leave policy 2026", href: "#" }, { title: "HR portal", href: "#" }];
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <AIResponse status={status} sources={sources} confidence="high" onStop={() => setStatus("stopped")} onCopy={() => navigator.clipboard?.writeText(full)}
        onRegenerate={() => { setN(0); setStatus("streaming"); }} onFeedback={() => {}}>{full.slice(0, n)}</AIResponse>
      <Row>
        <Button size="sm" variant="secondary" onClick={() => { setN(0); setStatus("streaming"); }}>Stream an answer</Button>
        <Button size="sm" variant="ghost" onClick={() => setStatus("error")}>Show the error state</Button>
      </Row>
    </div>
  );
}

export const demos2 = {
  "Link": () => (
    <Stack>
      <p className="text-body-medium">Review your plan in <Link href="#">billing history</Link> before the renewal on Dec 1.</p>
      <Row><Link href="#">View billing history</Link><Link href="#" size="sm">Small link</Link><Link href="https://www.figma.com" external>Open in Figma</Link></Row>
    </Stack>
  ),
  "Combobox": ComboboxDemo,
  "Date Picker": DateDemo,
  "Search Field": SearchDemo,
  "Radio": RadioDemo,
  "Slider": SliderDemo,
  "Chip": ChipDemo,
  "File Upload": UploadDemo,
  "Toast": () => <ToastProvider><ToastButtons /><Note>Toasts appear bottom-right (bottom-centre on mobile), max 3, and never take focus. Hover pauses the timer.</Note></ToastProvider>,
  "Tooltip": () => (
    <Row>
      {(["top", "bottom", "left", "right"] as const).map((p) => <Tooltip key={p} content={`Tooltip on the ${p}`} placement={p}><Button variant="secondary" size="sm">{p}</Button></Tooltip>)}
      <Tooltip content="Delete member"><IconButton icon="trash" label="Delete Jane Cooper" variant="ghost" /></Tooltip>
    </Row>
  ),
  "Dialog": OverlayDemo,
  "Popover & Drawer": PopoverDemo,
  "Menu": MenuDemo,
  "Navigation": NavDemo,
  "Accordion": () => (
    <Accordion defaultOpen={["plan"]}>
      <AccordionItem id="plan" title="What is included in the plan?">Every plan includes unlimited projects, 10 GB of storage per member and email support.</AccordionItem>
      <AccordionItem title="Can I change plans later?">Yes. Upgrades apply right away; downgrades apply at the next billing date.</AccordionItem>
      <AccordionItem title="How do refunds work?">Annual plans can be refunded within 30 days of purchase.</AccordionItem>
    </Accordion>
  ),
  "Divider": () => (
    <Stack>
      <div className="flex flex-col gap-3 rounded-container border border-line-default bg-surface p-4"><span className="text-label-medium">Account</span><Divider /><span className="text-label-medium">Security</span></div>
      <div className="flex h-8 items-center gap-3 text-label-medium">Edit<Divider orientation="vertical" />Share<Divider orientation="vertical" />Archive</div>
    </Stack>
  ),
  "Lists & Tables": ListsTablesDemo,
  "Form Patterns": FormDemo,
  "AI Patterns": AIDemo,
};
