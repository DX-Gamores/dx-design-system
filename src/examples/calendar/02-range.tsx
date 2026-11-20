/**
 * @title Range
 * @description Pick a start date, then an end date.
 */
"use client";
import { useState } from "react";
import { Calendar, type DateRange } from "@/components/ui/date";

export default function Example() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div className="flex flex-col items-start gap-2">
      <Calendar mode="range" range={range} onRangeChange={setRange} />
      <p className="text-caption-default text-fg-secondary" aria-live="polite">
        {range.start ? `${range.start.toDateString()} → ${range.end?.toDateString() ?? "pick an end date"}` : "Click a start date, then an end date."}
      </p>
    </div>
  );
}
