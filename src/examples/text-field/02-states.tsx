/**
 * @title Error and disabled
 * @description The error replaces the helper text and says how to fix it.
 */
"use client";
import { TextField } from "@/components/ui/form";

export default function Example() {
  return (
    <div className="grid max-w-2xl gap-4 md:grid-cols-2">
      <TextField label="Company" defaultValue="DXFORM" error="Company name is already taken. Try another." />
      <TextField label="Workspace ID" defaultValue="dx-2026" disabled helperText="Set by your admin." />
    </div>
  );
}
