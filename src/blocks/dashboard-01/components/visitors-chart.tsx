"use client";
import { useState } from "react";
import { SegmentedControl } from "@/components/ui/navigation";
import { AreaChart } from "../../_parts/area-chart";

const all = Array.from({ length: 90 }, (_, i) => {
  const d = new Date(2026, 6, 1 + i);
  const wave = Math.sin(i / 6) * 90 + Math.cos(i / 13) * 60;
  return { label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), values: [Math.round(260 + wave + (i % 7) * 12), Math.round(180 + wave * 0.6 + (i % 5) * 10)] };
});
const ranges = { "90d": 90, "30d": 30, "7d": 7 } as const;

export function VisitorsChart() {
  const [range, setRange] = useState<keyof typeof ranges>("90d");
  return (
    <section aria-labelledby="visitors-title" className="flex flex-col gap-4 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="visitors-title" className="text-heading-h4">Total visitors</h2>
          <p className="text-body-small text-fg-secondary">Desktop and mobile, last {ranges[range]} days</p>
        </div>
        <div className="[&_[role=radio]]:min-w-fit">
          <SegmentedControl label="Time range" value={range} onChange={setRange}
            options={[{ value: "90d", label: "90 days" }, { value: "30d", label: "30 days" }, { value: "7d", label: "7 days" }]} />
        </div>
      </div>
      <AreaChart title={`Visitors per day, last ${ranges[range]} days`} series={["Desktop", "Mobile"]} data={all.slice(-ranges[range])} />
    </section>
  );
}
