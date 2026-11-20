/**
 * @title Combobox
 * @description Type to filter a long list. Arrow keys move, Enter picks, Esc closes.
 */
"use client";
import { useState } from "react";
import { Combobox } from "@/components/ui/inputs-advanced";

const people = [
  { value: "jane", label: "Jane Cooper", description: "jane@acme.com", icon: "user" as const },
  { value: "esther", label: "Esther Howard", description: "esther@acme.com", icon: "user" as const },
  { value: "cameron", label: "Cameron Williamson", description: "cameron@acme.com", icon: "user" as const },
  { value: "brooklyn", label: "Brooklyn Simmons", description: "brooklyn@acme.com", icon: "user" as const },
  { value: "leslie", label: "Leslie Alexander", description: "Deactivated", icon: "user" as const, disabled: true },
];

export default function Example() {
  const [value, setValue] = useState<string | null>("esther");
  return (
    <div className="max-w-sm pb-64">
      <Combobox label="Assignee" options={people} value={value} onChange={setValue} helperText="Type a name or email" showKeyboardHint />
    </div>
  );
}
