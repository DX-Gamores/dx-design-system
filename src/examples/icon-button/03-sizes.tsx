/**
 * @title Sizes
 * @description Square: 48, 40 and 32px.
 */
"use client";
import { IconButton } from "@/components/ui/button";

export default function Example() {
  return (
    <div className="flex items-center gap-3">
      <IconButton icon="plus" label="Add" size="lg" />
      <IconButton icon="plus" label="Add" />
      <IconButton icon="plus" label="Add" size="sm" />
    </div>
  );
}
