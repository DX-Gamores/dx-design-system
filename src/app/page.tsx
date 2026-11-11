"use client";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Alert, Badge, Button, Card, EmptyState, SegmentedControl, StatCard, Avatar, IconButton } from "@/components/ui";
import { dataviz } from "@dxform/tokens";

// Starter dashboard: replace the content, keep the structure. Every colour, size and font is a token.
const data = { week: [42, 55, 61, 74], month: [180, 210, 260, 290], quarter: [610, 700, 820, 905] };
const members = [
  { name: "Maria Santos", email: "maria@dxform.ph", role: "Admin", status: "Active" },
  { name: "Mark Reyes", email: "mark@dxform.ph", role: "Editor", status: "Active" },
  { name: "Ana Lim", email: "ana@dxform.ph", role: "Viewer", status: "Invited" },
];

export default function Dashboard() {
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("week");
  const vals = data[period];
  const max = Math.max(...vals);
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A starter page built only from DX Design System tokens and components."
        actions={
          <>
            <Button variant="secondary" leadingIcon="download">Export</Button>
            <Button leadingIcon="plus">New project</Button>
          </>
        }
      />
      <Alert tone="info" title="This is the Next.js starter">
        Change brand, theme and density in the header — the same switches as the Figma variable modes.
      </Alert>
      <div className="grid gap-[var(--ds-layout-gutter)] sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active members" value="1,284" trend={{ direction: "positive", value: "+12%" }} context="vs. last 30 days" />
        <StatCard label="Projects" value="86" trend={{ direction: "neutral", value: "±0%" }} context="vs. last 30 days" />
        <StatCard label="Open issues" value="23" trend={{ direction: "negative", value: "+4" }} context="since Monday" />
        <StatCard label="Uptime" value="99.98%" context="this quarter" />
      </div>
      <div className="grid gap-[var(--ds-layout-gutter)] lg:grid-cols-3">
        <Card title="Sign-ups" className="lg:col-span-2">
          <SegmentedControl
            label="Period"
            value={period}
            onChange={setPeriod}
            options={[
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
              { value: "quarter", label: "Quarter" },
            ]}
          />
          <svg viewBox="0 0 400 180" role="img" aria-label={`Sign-ups per ${period}: ${vals.join(", ")}`} className="w-full">
            {[0, 1, 2, 3].map((g) => (
              <line key={g} x1="0" x2="400" y1={20 + g * 45} y2={20 + g * 45} stroke={g === 3 ? dataviz.axis : dataviz.gridline} />
            ))}
            {vals.map((v, i) => {
              const h = (v / max) * 125;
              return (
                <g key={i}>
                  <rect x={30 + i * 95} y={155 - h} width="44" height={h} rx="4" fill={dataviz.series[0]} />
                  <text x={52 + i * 95} y={150 - h} textAnchor="middle" className="text-label-small" fill="var(--ds-color-text-primary)">{v}</text>
                </g>
              );
            })}
          </svg>
        </Card>
        <Card title="Members" actions={<Button variant="secondary" size="sm">View all</Button>}>
          <ul className="flex flex-col divide-y divide-[var(--ds-color-border-default)]">
            {members.map((m) => (
              <li key={m.email} className="flex items-center gap-3 py-[var(--ds-padding-row)]">
                <Avatar name={m.name} decorative />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-label-medium">{m.name}</p>
                  <p className="truncate text-caption-default text-fg-secondary">{m.email}</p>
                </div>
                <Badge tone={m.status === "Active" ? "success" : "warning"}>{m.status}</Badge>
                <IconButton icon="more" size="sm" label={`More actions for ${m.name}`} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card>
        <EmptyState icon="folder" title="No reports yet" description="Reports you create will show up here." actions={<Button leadingIcon="plus">Create report</Button>} />
      </Card>
    </>
  );
}
