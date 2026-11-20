/**
 * @title AI Label
 * @description Marks content an AI made or a person edited, in words.
 */
"use client";
import { AILabel } from "@/components/ui/display";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <AILabel />
      <AILabel type="edited" />
    </div>
  );
}
