/**
 * @title Date Field
 * @description Type a date (11/18, Nov 18) or pick it from the calendar. Out-of-range days are disabled.
 */
"use client";
import { useState } from "react";
import { DateField } from "@/components/ui/date";

export default function Example() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div className="max-w-sm pb-96">
      <DateField label="Due date" value={date} onChange={setDate} min={new Date()} helperText="Dates before today are disabled." />
    </div>
  );
}
