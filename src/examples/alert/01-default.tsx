/**
 * @title Alert
 * @description A message about the page or a section. Four tones, always with a title that says what happened.
 */
"use client";
import { Alert } from "@/components/ui/feedback";

export default function Example() {
  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <Alert tone="info" title="Maintenance on Saturday">The workspace is read-only from 10 PM to 11 PM.</Alert>
      <Alert tone="success" title="Invoice sent">Jane will get it by email in a few minutes.</Alert>
      <Alert tone="warning" title="2 seats left">Add seats before inviting more people.</Alert>
      <Alert tone="danger" title="Payment failed">Update your card to keep your plan active.</Alert>
    </div>
  );
}
