/**
 * @title Divider
 * @description Separates groups of content. Prefer spacing; use a divider when groups need a clear boundary.
 */
"use client";
import { Divider } from "@/components/ui/data";

export default function Example() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex max-w-sm flex-col gap-3 rounded-container border border-line-default bg-surface p-4">
        <span className="text-label-medium">Account</span>
        <Divider />
        <span className="text-label-medium">Security</span>
      </div>
      <div className="flex h-8 items-center gap-3 text-label-medium">
        Edit<Divider orientation="vertical" />Share<Divider orientation="vertical" />Archive
      </div>
    </div>
  );
}
