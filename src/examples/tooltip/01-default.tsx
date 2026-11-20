/**
 * @title Tooltip
 * @description A short label on hover and focus. Never the only place for important information.
 */
"use client";
import { Button, IconButton } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/overlays";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3 py-8">
      {(["top", "bottom", "left", "right"] as const).map((p) => (
        <Tooltip key={p} content={`Tooltip on the ${p}`} placement={p}>
          <Button variant="secondary" size="sm">{p}</Button>
        </Tooltip>
      ))}
      <Tooltip content="Delete member">
        <IconButton icon="trash" label="Delete Jane Cooper" variant="ghost" />
      </Tooltip>
    </div>
  );
}
