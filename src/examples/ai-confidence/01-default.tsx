/**
 * @title AI Confidence
 * @description How sure the AI is, in words. Low confidence asks people to check the sources.
 */
"use client";
import { AIConfidence } from "@/components/ui/patterns";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <AIConfidence level="high" />
      <AIConfidence level="medium" />
      <AIConfidence level="low" />
    </div>
  );
}
