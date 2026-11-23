"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, StatCard } from "@/components/ui/display";
import { Tabs } from "@/components/ui/navigation";
import { BarChart } from "../../_parts/bar-chart";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const revenue = months.map((label, i) => ({ label, value: 1800 + ((i * 2731) % 4200) }));
const sales = [
  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00" },
  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00" },
  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00" },
  { name: "William Kim", email: "will@email.com", amount: "+$99.00" },
  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00" },
];

function OverviewPanel() {
  return (
    <div className="flex flex-col gap-4">
      <section aria-label="Key numbers" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total revenue" value="$45,231.89" trend={{ direction: "positive", value: "+20.1%" }} context="from last month" />
        <StatCard label="Subscriptions" value="+2,350" trend={{ direction: "positive", value: "+180.1%" }} context="from last month" />
        <StatCard label="Sales" value="+12,234" trend={{ direction: "positive", value: "+19%" }} context="from last month" />
        <StatCard label="Active now" value="+573" trend={{ direction: "neutral", value: "+201" }} context="since last hour" />
      </section>
      <div className="grid gap-4 lg:grid-cols-7">
        <section aria-labelledby="rev-title" className="flex min-w-0 flex-col gap-4 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)] lg:col-span-4">
          <h2 id="rev-title" className="text-heading-h4">Revenue by month</h2>
          <BarChart title="Revenue by month, 2026, in US dollars" data={revenue} format={(n) => `$${n.toLocaleString("en-US")}`} />
        </section>
        <section aria-labelledby="sales-title" className="flex min-w-0 flex-col gap-4 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)] lg:col-span-3">
          <div className="flex flex-col gap-1">
            <h2 id="sales-title" className="text-heading-h4">Recent sales</h2>
            <p className="text-body-small text-fg-secondary">You made 265 sales this month.</p>
          </div>
          <ul className="flex flex-col gap-5">
            {sales.map((s) => (
              <li key={s.email} className="flex items-center gap-3">
                <Avatar name={s.name} size="lg" decorative />
                <span className="flex min-w-0 flex-1 flex-col"><span className="truncate text-label-medium">{s.name}</span><span className="truncate text-caption-default text-fg-secondary">{s.email}</span></span>
                <span className="text-label-medium tabular-nums">{s.amount}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

const soon = (what: string) => <p className="rounded-container border border-dashed border-line-strong p-10 text-center text-body-small text-fg-secondary">{what} go here.</p>;

export function Overview() {
  const [tab, setTab] = useState("overview");
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-heading-h2">Dashboard</h1>
        <div className="flex gap-2"><Button variant="secondary" leadingIcon="calendar">Jan 20 – Feb 9, 2026</Button><Button leadingIcon="download">Download</Button></div>
      </div>
      <Tabs label="Dashboard views" value={tab} onChange={setTab}
        tabs={[
          { id: "overview", label: "Overview", panel: <OverviewPanel /> },
          { id: "analytics", label: "Analytics", panel: soon("Analytics") },
          { id: "reports", label: "Reports", count: 3, panel: soon("Reports") },
        ]} />
    </>
  );
}
