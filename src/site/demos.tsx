"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  AILabel, Alert, Avatar, Badge, Button, Card, Checkbox, Citation, EmptyState, Icon, IconButton, iconNames, Progress,
  SegmentedControl, Select, Skeleton, Spinner, StatCard, Stepper, Tabs, TextField, Textarea, Toggle,
} from "@/components/ui";
import { PageHeader } from "@/components/app-shell";
import type { DemoName } from "./demo-names";
import type { IconName } from "@/components/ui/icon";
import lucideNames from "./lucide-names.json";
import { demos2 } from "./demos-2";

/* Live examples for the docs pages, keyed by Figma page name. Everything here uses the real
   components from src/components/ui, so the theme switcher in the header re-skins them. */

const Row = ({ children }: { children: ReactNode }) => <div className="flex flex-wrap items-center gap-3">{children}</div>;
const Stack = ({ children }: { children: ReactNode }) => <div className="flex flex-col gap-4">{children}</div>;

function ToggleDemo() {
  const [on, setOn] = useState(true);
  const [b, setB] = useState(false);
  return (
    <Stack>
      <Toggle label="Email notifications" checked={on} onChange={setOn} />
      <Toggle label="Weekly digest" checked={b} onChange={setB} />
    </Stack>
  );
}
function SegmentedDemo() {
  const [view, setView] = useState("list");
  const [range, setRange] = useState("30d");
  return (
    <Stack>
      <SegmentedControl label="View" value={view} onChange={setView} options={[{ value: "list", label: "List", icon: "list-view" }, { value: "board", label: "Board", icon: "grid-view" }, { value: "calendar", label: "Calendar", icon: "calendar" }]} />
      <SegmentedControl label="Period" value={range} onChange={setRange} options={[{ value: "7d", label: "7 days" }, { value: "30d", label: "30 days" }, { value: "q", label: "Quarter" }, { value: "y", label: "Year" }]} />
    </Stack>
  );
}
function TabsDemo() {
  const [tab, setTab] = useState("members");
  return (
    <Tabs label="Member views" value={tab} onChange={setTab} tabs={[
      { id: "members", label: "Members", count: 12, panel: <p className="text-fg-secondary">12 people have access to this workspace.</p> },
      { id: "invites", label: "Invites", count: 2, panel: <p className="text-fg-secondary">2 invitations are waiting for a reply.</p> },
      { id: "roles", label: "Roles", panel: <p className="text-fg-secondary">Owner, Admin, Member and Viewer.</p> },
    ]} />
  );
}
type IconFormat = "dx" | "jsx" | "rn" | "svg";
const iconFormats: { value: IconFormat; label: string }[] = [
  { value: "dx", label: "DX" },
  { value: "jsx", label: "Lucide React" },
  { value: "rn", label: "React Native" },
  { value: "svg", label: "SVG" },
];
function iconCode(n: IconName, f: IconFormat, svg: string) {
  const L = (lucideNames as Record<string, string>)[n];
  if (f === "dx") return `<Icon name="${n}" />`;
  if (f === "jsx") return `import { ${L} } from "lucide-react";\n\n<${L} size={20} />`;
  if (f === "rn") return `import { ${L} } from "lucide-react-native";\n\n<${L} size={20} color={theme.colors.icon.primary} />`;
  return svg;
}
function IconGrid() {
  const [q, setQ] = useState("");
  const [format, setFormat] = useState<IconFormat>("dx");
  const [copied, setCopied] = useState<string | null>(null);
  const list = iconNames.filter((n) => n.includes(q.trim().toLowerCase()) || (lucideNames as Record<string, string>)[n].toLowerCase().includes(q.trim().toLowerCase()));
  const label = iconFormats.find((f) => f.value === format)!.label;
  return (
    <Stack>
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-full max-w-sm"><TextField label="Search icons" leadingIcon="search" placeholder="e.g. arrow, user, chart" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <SegmentedControl label="Copy as" value={format} onChange={setFormat} options={iconFormats} size="sm" />
      </div>
      <p className="text-caption-default text-fg-secondary" aria-live="polite">{copied ? `Copied ${copied} as ${label}` : `${list.length} icons · drawn by Lucide (ISC) · click one to copy it as ${label}`}</p>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-2">
        {list.map((n) => (
          <li key={n}>
            <button
              type="button"
              title={`Lucide: ${(lucideNames as Record<string, string>)[n]}`}
              onClick={(e) => {
                const svg = (e.currentTarget.querySelector("svg")?.outerHTML ?? "").replace(/ class="[^"]*"/, "").replace(/ aria-hidden="true"| focusable="false"/g, "");
                navigator.clipboard?.writeText(iconCode(n, format, svg)).catch(() => {});
                setCopied(n);
              }}
              className="flex w-full flex-col items-center gap-2 rounded-md p-3 text-caption-default text-fg-secondary hover:bg-neutral-hover focus-visible:focus-ring"
            >
              <Icon name={n} size={24} className="text-icon-primary" />
              <span className="break-all">{n}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-body-small text-fg-secondary">
        Need an icon that isn&apos;t here? Use any of Lucide&apos;s 1,600+ icons: <code className="text-code-small">{'<Icon name={Rocket} />'}</code> with <code className="text-code-small">{'import { Rocket } from "lucide-react"'}</code>, or add it to <code className="text-code-small">icon-map.ts</code> to give it a DX name. Browse them at <a className="text-fg-brand underline" href="https://lucide.dev/icons/">lucide.dev/icons</a>.
      </p>
    </Stack>
  );
}

const MiniCard = () => (
  <div className="flex flex-col gap-3 rounded-container border border-line-default bg-surface p-4 text-fg-primary">
    <div className="flex items-center justify-between gap-2"><span className="text-label-large">Quarterly review</span><Badge tone="success">Ready</Badge></div>
    <p className="text-body-small text-fg-secondary">3 reports are ready to share with your team.</p>
    <Row><Button size="sm">Share</Button><Button size="sm" variant="secondary">Cancel</Button></Row>
  </div>
);
function ThemeMatrix() {
  const brands = [["default", "Default · Inter"], ["violet", "Violet · Manrope"], ["amber", "Amber · Poppins, pill controls"]] as const;
  const themes = ["light", "dark", "light-hc", "dark-hc"] as const;
  return (
    <div className="flex flex-col gap-6">
      {brands.map(([b, label]) => (
        <div key={b} className="flex flex-col gap-2">
          <span className="text-label-medium">{label}</span>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {themes.map((t) => (
              <div key={t} data-brand={b} data-theme={t} className="flex flex-col gap-2 rounded-container bg-canvas p-3 text-fg-primary">
                <span className="text-caption-default text-fg-secondary">{t}</span>
                <MiniCard />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
export const demos: Record<DemoName, () => ReactNode> = {
  ...demos2,
  "Button": () => (
    <Stack>
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
    </Stack>
  ),
  "Text Field": () => (
    <div className="grid gap-4 md:grid-cols-2">
      <TextField label="Email" placeholder="name@company.com" helperText="We'll never share it." />
      <TextField label="Company" defaultValue="DXFORM" error="Company name is already taken — try another." />
      <TextField label="Workspace ID" defaultValue="dx-2026" disabled helperText="Set by your admin." />
      <TextField label="Amount" leadingIcon="credit-card" placeholder="0.00" />
    </div>
  ),
  "Select": () => <div className="max-w-sm"><Select label="Time zone" placeholder="Select an option" options={[{ value: "mnl", label: "Asia/Manila" }, { value: "sgp", label: "Asia/Singapore" }, { value: "tyo", label: "Asia/Tokyo" }]} /></div>,
  "Textarea": () => <div className="max-w-md"><Textarea label="Bio" placeholder="A short introduction" helperText="Up to 160 characters." maxLength={160} /></div>,
  "Checkbox": () => (
    <Stack>
      <Checkbox label="Email me product updates" defaultChecked />
      <Checkbox label="I agree to the Terms and Privacy Policy, including how DXFORM processes my data." />
      <Checkbox label="Disabled option" disabled />
    </Stack>
  ),
  "Toggle": () => <ToggleDemo />,
  "Alert": () => (
    <Stack>
      {(["info", "success", "warning", "danger"] as const).map((t) => (
        <Alert key={t} tone={t} title={`${t[0].toUpperCase()}${t.slice(1)} alert`} onDismiss={() => {}}>Short explanation of what happened and what to do next.</Alert>
      ))}
    </Stack>
  ),
  "Progress": () => (
    <div className="flex max-w-md flex-col gap-4">
      <Progress label="Uploading files" value={60} />
      <Progress label="Storage used" value={82} tone="warning" />
      <Progress label="Import complete" value={100} tone="success" />
    </div>
  ),
  "Loading": () => (
    <Stack>
      <Row><Spinner size="sm" /><Spinner /><Spinner size="lg" /></Row>
      <div className="flex max-w-sm items-center gap-3"><Skeleton shape="circle" /><div className="flex flex-1 flex-col gap-2"><Skeleton /><Skeleton className="w-2/3" /></div></div>
    </Stack>
  ),
  "Empty State": () => <EmptyState icon="search" title="No results for “wade”" description="Check the spelling or clear the filters." actions={<Button variant="secondary">Clear filters</Button>} />,
  "Badge": () => <Row>{(["neutral", "brand", "success", "warning", "danger", "info"] as const).map((t) => <Badge key={t} tone={t}>{t[0].toUpperCase() + t.slice(1)}</Badge>)}</Row>,
  "Tabs": () => <TabsDemo />,
  "Segmented Control": () => <SegmentedDemo />,
  "Stepper": () => (
    <Stepper steps={[{ label: "Account", description: "Email and password", status: "complete" }, { label: "Company", description: "Fix 2 fields", status: "error" }, { label: "Team", description: "Invite people", status: "upcoming" }, { label: "Billing", status: "upcoming" }]} onStepClick={() => {}} />
  ),
  "Avatar": () => <Row><Avatar name="Maria Santos" size="sm" /><Avatar name="Maria Santos" /><Avatar name="Maria Santos" size="lg" /><Avatar name="Jun Cruz" /><Avatar name="Ana Reyes" /></Row>,
  "Card": () => (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Flat card" actions={<><Button size="sm">Primary</Button><Button size="sm" variant="secondary">Secondary</Button></>}>Supporting text about one subject.</Card>
      <Card title="Raised card" elevation="raised">Use on the canvas or when it needs emphasis.</Card>
    </div>
  ),
  "Kit · Stat Card": () => (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Active members" value="1,284" trend={{ direction: "positive", value: "+12%" }} context="vs. last 30 days" />
      <StatCard label="Open tickets" value="37" trend={{ direction: "negative", value: "+5" }} context="vs. last week" />
      <StatCard label="Avg. response" value="2h 10m" trend={{ direction: "neutral", value: "0%" }} context="vs. last week" />
    </div>
  ),
  "Themes & Brands": () => <ThemeMatrix />,
  "Icons": () => <IconGrid />,
};

export function Demo({ name }: { name: DemoName }) {
  const D = demos[name];
  return <D />;
}
