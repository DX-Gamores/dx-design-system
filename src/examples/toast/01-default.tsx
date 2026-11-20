/**
 * @title Toast
 * @description A short confirmation after an action. Appears bottom-right, never takes focus, pauses on hover.
 */
"use client";
import { Button } from "@/components/ui/button";
import { ToastProvider, useToast } from "@/components/ui/overlays";

function Actions() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => toast.show({ message: "Changes saved", tone: "success" })}>Save</Button>
      <Button
        variant="secondary"
        onClick={() => toast.show({ message: "Project archived", action: { label: "Undo", onClick: () => toast.show({ message: "Project restored", tone: "success" }) } })}
      >
        Archive project
      </Button>
      <Button variant="secondary" tone="danger" onClick={() => toast.show({ message: "Upload failed. Check your connection.", tone: "danger" })}>Fail an upload</Button>
    </div>
  );
}

export default function Example() {
  return (
    <ToastProvider>
      <Actions />
    </ToastProvider>
  );
}
