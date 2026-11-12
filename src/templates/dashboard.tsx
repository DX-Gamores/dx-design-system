"use client";
import { PageHeader } from "@/components/app-shell";
import { Alert, Avatar, Button, Card, Divider, Link, StatCard } from "@/components/ui";

/* Figma: _Template/Dashboard (Desktop 1440 · Tablet 834 · Mobile 390). */
const activity = [
  { name: "Jane Cooper", what: "Created project “Website redesign”", when: "Today" },
  { name: "Wade Warren", what: "Invited esther@acme.com", when: "Yesterday" },
  { name: "Esther Howard", what: "Completed 12 tasks in Mobile onboarding", when: "2 days ago" },
];

export function DashboardTemplate() {
  return (
    <>
      <PageHeader title="Dashboard" description="Welcome back, Jane. Here’s what’s happening in Acme this month."
        actions={<><Button variant="secondary" leadingIcon="download">Export</Button><Button leadingIcon="plus">New project</Button></>} />
      <Alert tone="info" title="Your trial ends in 5 days" action={<div><Link href="#" size="sm">Take action</Link></div>}>Choose a plan to keep your projects and members.</Alert>
      <section aria-label="Key numbers" className="grid gap-[var(--ds-layout-gutter)] sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active members" value="1,284" trend={{ direction: "positive", value: "+12%" }} context="vs. last 30 days" />
        <StatCard label="Open projects" value="36" trend={{ direction: "positive", value: "+3" }} context="vs. last 30 days" />
        <StatCard label="Tasks overdue" value="7" trend={{ direction: "negative", value: "−2" }} context="vs. last 30 days" />
        <StatCard label="Storage used" value="68%" trend={{ direction: "neutral", value: "0%" }} context="vs. last 30 days" />
      </section>
      <Card headingLevel={2} title="Recent activity">
        <ul className="-mt-2 flex flex-col">
          {activity.map((a, i) => (
            <li key={a.name}>
              {i > 0 && <Divider />}
              <div className="flex items-center gap-3 py-3">
                <Avatar name={a.name} decorative />
                <div className="flex min-w-0 flex-1 flex-col"><span className="text-label-medium">{a.name}</span><span className="truncate text-caption-default text-fg-secondary">{a.what}</span></div>
                <span className="shrink-0 text-caption-default text-fg-secondary">{a.when}</span>
              </div>
            </li>
          ))}
        </ul>
        <div><Link href="#" size="sm">View all activity</Link></div>
      </Card>
    </>
  );
}
