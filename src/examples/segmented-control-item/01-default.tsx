/**
 * @title Segmented Control Item
 * @description One option of a Segmented Control: text, icon, or icon-only with a label.
 */
"use client";
import { useState } from "react";
import { SegmentedControl } from "@/components/ui/navigation";

export default function Example() {
  const [view, setView] = useState("list");
  const [range, setRange] = useState("30d");
  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl
        label="View"
        value={view}
        onChange={setView}
        options={[{ value: "list", label: "List", icon: "list-view" }, { value: "board", label: "Board", icon: "grid-view" }, { value: "calendar", label: "Calendar", icon: "calendar" }]}
      />
      <SegmentedControl
        label="Period"
        size="sm"
        value={range}
        onChange={setRange}
        options={[{ value: "7d", label: "7 days" }, { value: "30d", label: "30 days" }, { value: "q", label: "Quarter" }, { value: "y", label: "Year" }]}
      />
    </div>
  );
}
