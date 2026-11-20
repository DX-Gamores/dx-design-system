/**
 * @title Calendar Day
 * @description Calendar Day is one cell of the Calendar: today, selected, in range, outside the month and disabled (with a strike, not color alone).
 */
"use client";
import { useState } from "react";
import { Calendar } from "@/components/ui/date";

const today = new Date();
const inAWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

export default function Example() {
  const [date, setDate] = useState<Date | null>(inAWeek);
  return <Calendar value={date} onChange={setDate} isDisabled={(d) => d.getDay() === 0} />;
}
