/**
 * @title Menu
 * @description A list of actions behind a button. A letter jumps to an item; Esc closes and returns focus.
 */
"use client";
import { useState } from "react";
import { Menu } from "@/components/ui/overlays";

export default function Example() {
  const [last, setLast] = useState("—");
  return (
    <div className="flex flex-col gap-3 pb-56">
      <div className="flex items-center gap-3">
        <span className="text-body-medium">Esther Howard</span>
        <Menu
          label="More actions for Esther Howard"
          items={[
            { label: "Edit role", icon: "edit", shortcut: "E", onSelect: () => setLast("Edit role") },
            { label: "Copy email", icon: "copy", onSelect: () => setLast("Copy email") },
            { label: "Resend invite", icon: "send", disabled: true },
            { label: "Remove from workspace", icon: "trash", tone: "danger", separatorBefore: true, onSelect: () => setLast("Remove") },
          ]}
        />
      </div>
      <p className="text-caption-default text-fg-secondary" aria-live="polite">Last action: {last}</p>
    </div>
  );
}
