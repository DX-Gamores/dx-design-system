/**
 * @title Small
 * @description For dense forms and toolbars.
 */
"use client";
import { TextField } from "@/components/ui/form";

export default function Example() {
  return (
    <div className="max-w-xs">
      <TextField label="Project code" size="sm" placeholder="e.g. Q4-OPS" />
    </div>
  );
}
