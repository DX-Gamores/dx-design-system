/**
 * @title Create and recent
 * @description Offer “Create …” for a new value, and recent picks before the user types.
 */
"use client";
import { useState } from "react";
import { Combobox, type ListOption } from "@/components/ui/inputs-advanced";

const start: ListOption[] = [
  { value: "design", label: "Design" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
];

export default function Example() {
  const [tags, setTags] = useState(start);
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="max-w-sm pb-64">
      <Combobox
        label="Team"
        options={tags}
        value={value}
        onChange={setValue}
        recent={tags.slice(0, 2)}
        onCreate={(q) => {
          const o = { value: q.toLowerCase(), label: q };
          setTags((l) => [...l, o]);
          setValue(o.value);
        }}
      />
    </div>
  );
}
