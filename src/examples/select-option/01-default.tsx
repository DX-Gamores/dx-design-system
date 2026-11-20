/**
 * @title Select Option
 * @description Select Option is the list part of a custom select. It is rendered for you by Combobox; use it directly only to build a new picker.
 */
"use client";
import { useState } from "react";
import { SelectMenu, SelectOption } from "@/components/ui/inputs-advanced";

const options = [
  { value: "mnl", label: "Asia/Manila", description: "UTC+8" },
  { value: "sgp", label: "Asia/Singapore", description: "UTC+8" },
  { value: "tyo", label: "Asia/Tokyo", description: "UTC+9" },
  { value: "syd", label: "Australia/Sydney", description: "UTC+11", disabled: true },
];

export default function Example() {
  const [value, setValue] = useState("sgp");
  const [active, setActive] = useState(1);
  return (
    <div className="relative h-60 max-w-sm" onMouseLeave={() => setActive(-1)}>
      <SelectMenu id="tz-list" label="Time zone">
        {options.map((o, i) => (
          <div key={o.value} onMouseEnter={() => setActive(i)}>
            <SelectOption id={`tz-${o.value}`} option={o} selected={value === o.value} active={active === i} onPick={() => setValue(o.value)} />
          </div>
        ))}
      </SelectMenu>
    </div>
  );
}
