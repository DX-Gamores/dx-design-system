/**
 * @title Skeleton
 * @description Placeholders shaped like the content that is loading. Use for loads over ~300 ms.
 */
"use client";
import { Skeleton } from "@/components/ui/feedback";

export default function Example() {
  return (
    <div aria-busy="true" className="flex max-w-sm flex-col gap-4">
      <span className="sr-only">Loading members…</span>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton shape="circle" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton />
            <Skeleton className="w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
