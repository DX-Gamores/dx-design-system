/**
 * @title Sizes
 * @description Large 48, Medium 40 (default) and Small 32. Density can shrink each size by one step.
 */
"use client";
import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="lg">Large</Button>
      <Button>Medium</Button>
      <Button size="sm">Small</Button>
    </div>
  );
}
