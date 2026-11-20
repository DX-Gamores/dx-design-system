/**
 * @title Calendar
 * @description An inline calendar for picking one date. Arrow keys move by day and week, Page Up/Down by month.
 */
"use client";
import { useState } from "react";
import { Calendar } from "@/components/ui/date";

export default function Example() {
  const [date, setDate] = useState<Date | null>(new Date());
  return (
    <div className="flex flex-col items-start gap-2">
      <Calendar value={date} onChange={setDate} />
      <p className="text-caption-default text-fg-secondary" aria-live="polite">{date ? date.toDateString() : "No date"}</p>
    </div>
  );
}
