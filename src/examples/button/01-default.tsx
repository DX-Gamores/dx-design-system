/**
 * @title Button
 * @description One Primary per view, Secondary for supporting actions, Ghost for low-emphasis actions.
 */
"use client";
import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Save changes</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="ghost">Skip for now</Button>
    </div>
  );
}
