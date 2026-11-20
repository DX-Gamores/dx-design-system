/**
 * @title Slider Thumb
 * @description The draggable handle of Slider and Range Slider: role=slider with the formatted value as its text.
 */
"use client";
import { useState } from "react";
import { Slider } from "@/components/ui/inputs-advanced";

export default function Example() {
  const [v, setV] = useState(70);
  return (
    <div className="grid max-w-2xl gap-8 md:grid-cols-2">
      <Slider label="Opacity" value={v} onChange={setV} format={(n) => `${n}%`} showMinMax />
      <Slider label="Locked by admin" value={30} onChange={() => {}} disabled />
    </div>
  );
}
