/**
 * @title Menu Item
 * @description One action in a Menu: optional icon and shortcut, danger tone, disabled, and a separator before it.
 */
"use client";
import { Menu } from "@/components/ui/overlays";

export default function Example() {
  return (
    <div className="pb-56">
      <Menu
        label="File actions"
        items={[
          { label: "Rename", icon: "edit", shortcut: "R" },
          { label: "Duplicate", icon: "copy", shortcut: "D" },
          { label: "Move to…", icon: "folder", disabled: true },
          { label: "Delete", icon: "trash", tone: "danger", separatorBefore: true },
        ]}
      />
    </div>
  );
}
