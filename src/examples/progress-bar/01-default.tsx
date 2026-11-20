/**
 * @title Progress Bar
 * @description Shows how far a task has got. Tone shows status; the label and percentage carry the meaning.
 */
"use client";
import { Progress } from "@/components/ui/feedback";

export default function Example() {
  return (
    <div className="flex max-w-md flex-col gap-4">
      <Progress label="Uploading files" value={60} />
      <Progress label="Storage used" value={82} tone="warning" />
      <Progress label="Import complete" value={100} tone="success" />
      <Progress label="Sync failed" value={35} tone="danger" />
    </div>
  );
}
