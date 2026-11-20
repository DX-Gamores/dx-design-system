/**
 * @title Combobox Menu
 * @description Combobox Menu is rendered by Combobox: matching text is highlighted, descriptions and icons are optional, disabled options stay visible.
 */
"use client";
import { useState } from "react";
import { ComboboxMenu, ComboboxOption } from "@/components/ui/inputs-advanced";

const options = [
  { value: "jane", label: "Jane Cooper", description: "jane@acme.com", icon: "user" as const },
  { value: "janet", label: "Janet Reyes", description: "janet@acme.com", icon: "user" as const },
  { value: "benjamin", label: "Benjamin Jansen", description: "Deactivated", icon: "user" as const, disabled: true },
];

export default function Example() {
  const [value, setValue] = useState("jane");
  return (
    <div className="relative h-56 max-w-sm">
      <ComboboxMenu id="people-list" label="People matching “jan”">
        {options.map((o, i) => (
          <ComboboxOption key={o.value} id={`p-${o.value}`} option={o} query="jan" selected={value === o.value} active={i === 1} onPick={() => setValue(o.value)} />
        ))}
      </ComboboxMenu>
    </div>
  );
}
