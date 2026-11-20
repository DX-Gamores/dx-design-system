/**
 * @title Spinner
 * @description For short waits inside a control or a small area. Has a hidden “Loading” label.
 */
"use client";
import { Spinner } from "@/components/ui/feedback";

export default function Example() {
  return (
    <div className="flex items-center gap-6">
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" label="Loading reports" />
    </div>
  );
}
