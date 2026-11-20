/**
 * @title Range with inputs
 * @description Two thumbs for a minimum and maximum. The number boxes mean dragging is never required.
 */
"use client";
import { useState } from "react";
import { RangeSlider } from "@/components/ui/inputs-advanced";

const peso = (n: number) => `₱${n.toLocaleString("en-PH")}`;

export default function Example() {
  const [price, setPrice] = useState<[number, number]>([2000, 8000]);
  return (
    <div className="max-w-md">
      <RangeSlider label="Price" value={price} onChange={setPrice} min={0} max={10000} step={500} format={peso} showInputs />
    </div>
  );
}
