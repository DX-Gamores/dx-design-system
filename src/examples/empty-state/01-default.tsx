/**
 * @title Empty State
 * @description Says why there is nothing here and what to do next.
 */
"use client";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";

export default function Example() {
  return (
    <EmptyState
      icon="search"
      title="No results for “wade”"
      description="Check the spelling or clear the filters."
      actions={<Button variant="secondary">Clear filters</Button>}
    />
  );
}
