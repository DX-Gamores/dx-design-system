/**
 * @title Slider
 * @description Pick a value in a range by dragging, clicking the rail or using the arrow keys.
 */
"use client";
import { useState } from "react";
import { Slider } from "@/components/ui/inputs-advanced";

export default function Example() {
  const [volume, setVolume] = useState(40);
  return (
    <div className="max-w-md">
      <Slider label="Volume" value={volume} onChange={setVolume} format={(n) => `${n}%`} />
    </div>
  );
}
