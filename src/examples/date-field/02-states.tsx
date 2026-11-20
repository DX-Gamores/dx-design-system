/**
 * @title Error and disabled
 * @description Say what a valid date looks like.
 */
"use client";
import { DateField } from "@/components/ui/date";

export default function Example() {
  return (
    <div className="grid max-w-2xl gap-4 md:grid-cols-2">
      <DateField label="Start date" value={null} onChange={() => {}} error="Enter a date, like 11/18/2026." />
      <DateField label="Contract end" value={new Date(2026, 11, 31)} onChange={() => {}} disabled />
    </div>
  );
}
