/**
 * @title Icon Button
 * @description Icon-only actions in toolbars and rows. The label is required: it becomes the accessible name.
 */
"use client";
import { IconButton } from "@/components/ui/button";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <IconButton icon="edit" label="Edit" />
      <IconButton icon="copy" label="Duplicate" variant="secondary" />
      <IconButton icon="more" label="More actions" variant="ghost" />
      <IconButton icon="trash" label="Delete" variant="ghost" tone="danger" />
    </div>
  );
}
