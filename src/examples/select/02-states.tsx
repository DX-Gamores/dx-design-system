/**
 * @title Helper text and error
 * @description Explain the choice, or say what to fix.
 */
"use client";
import { Select } from "@/components/ui/form";

const roles = [{ value: "admin", label: "Admin" }, { value: "editor", label: "Editor" }, { value: "viewer", label: "Viewer" }];

export default function Example() {
  return (
    <div className="grid max-w-2xl gap-4 md:grid-cols-2">
      <Select label="Role" options={roles} defaultValue="editor" helperText="Editors can change content but not billing." />
      <Select label="Approver" options={roles} placeholder="Choose a role" error="Choose who approves requests." />
    </div>
  );
}
