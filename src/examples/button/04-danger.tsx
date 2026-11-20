/**
 * @title Danger
 * @description For destructive or irreversible actions. Confirm them in a Dialog and never make them the default focus.
 */
"use client";
import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button tone="danger" leadingIcon="trash">Delete project</Button>
      <Button tone="danger" variant="secondary">Revoke access</Button>
      <Button tone="danger" variant="ghost">Remove</Button>
    </div>
  );
}
