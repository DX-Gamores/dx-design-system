/**
 * @title Textarea
 * @description Multi-line text. Say the limit in the helper text; maxLength enforces it.
 */
"use client";
import { Textarea } from "@/components/ui/form";

export default function Example() {
  return (
    <div className="max-w-md">
      <Textarea label="Bio" placeholder="A short introduction" helperText="Up to 160 characters." maxLength={160} />
    </div>
  );
}
