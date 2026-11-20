/**
 * @title Confirm a destructive action
 * @description Danger tone, small size, a specific title and consequence. Cancel gets focus first.
 */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/overlays";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button tone="danger" variant="secondary" onClick={() => setOpen(true)}>Delete project</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        tone="danger"
        title="Delete “Q4 launch”?"
        description="This deletes 24 tasks and their files for everyone. You can't undo this."
        primaryLabel="Delete project"
        onPrimary={() => setOpen(false)}
      />
    </>
  );
}
