/**
 * @title Stat Card
 * @description A key number with its trend and context, for dashboards.
 */
"use client";
import { StatCard } from "@/components/ui/display";

export default function Example() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Active members" value="1,284" trend={{ direction: "positive", value: "+12%" }} context="vs. last 30 days" />
      <StatCard label="Open tickets" value="37" trend={{ direction: "negative", value: "+5" }} context="vs. last week" />
      <StatCard label="Avg. response" value="2h 10m" trend={{ direction: "neutral", value: "0%" }} context="vs. last week" />
    </div>
  );
}
