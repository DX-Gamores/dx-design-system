/**
 * @title Error
 * @description The message says how to fix it.
 */
"use client";
import { Textarea } from "@/components/ui/form";

export default function Example() {
  return (
    <div className="max-w-md">
      <Textarea label="Reason for the change" error="Tell reviewers why this change is needed." />
    </div>
  );
}
