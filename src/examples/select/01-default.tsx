/**
 * @title Select
 * @description A native select: best for 5–15 known options, and it opens the system picker on phones.
 */
"use client";
import { Select } from "@/components/ui/form";

export default function Example() {
  return (
    <div className="max-w-sm">
      <Select
        label="Time zone"
        placeholder="Select a time zone"
        options={[
          { value: "mnl", label: "Asia/Manila" },
          { value: "sgp", label: "Asia/Singapore" },
          { value: "tyo", label: "Asia/Tokyo" },
        ]}
      />
    </div>
  );
}
