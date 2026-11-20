/**
 * @title First use
 * @description The first time a list is empty, explain the value and offer the first action.
 */
"use client";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";

export default function Example() {
  return (
    <EmptyState
      icon="folder"
      title="No projects yet"
      description="Projects group your tasks, files and people. Create one to get started."
      actions={<><Button leadingIcon="plus">New project</Button><Button variant="ghost">Import</Button></>}
    />
  );
}
