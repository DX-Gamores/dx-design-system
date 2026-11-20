/**
 * @title Removable tags
 * @description Tags with a remove button named “Remove …”.
 */
"use client";
import { useState } from "react";
import { Chip } from "@/components/ui/form";

export default function Example() {
  const [tags, setTags] = useState(["Q4 launch", "Billing", "Urgent"]);
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => <Chip key={t} onRemove={() => setTags((l) => l.filter((x) => x !== t))}>{t}</Chip>)}
      {!tags.length && <span className="text-body-small text-fg-secondary">No tags</span>}
    </div>
  );
}
