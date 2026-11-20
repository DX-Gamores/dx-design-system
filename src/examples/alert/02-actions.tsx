/**
 * @title With an action and dismiss
 * @description Give the next step as an action; let people dismiss messages that are only informative.
 */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/feedback";

export default function Example() {
  const [open, setOpen] = useState(true);
  return (
    <div className="max-w-2xl">
      {open ? (
        <Alert tone="warning" title="Your trial ends in 3 days" action={<Button size="sm" variant="secondary">Choose a plan</Button>} onDismiss={() => setOpen(false)}>
          Pick a plan to keep your projects and members.
        </Alert>
      ) : (
        <Button variant="ghost" onClick={() => setOpen(true)}>Show the alert again</Button>
      )}
    </div>
  );
}
