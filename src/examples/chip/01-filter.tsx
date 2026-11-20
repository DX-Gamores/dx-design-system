/**
 * @title Filter chips
 * @description Toggle filters on and off. Each is a toggle button (aria-pressed).
 */
"use client";
import { useState } from "react";
import { Chip } from "@/components/ui/form";

const teams = ["Design", "Web", "Mobile", "Data"];

export default function Example() {
  const [selected, setSelected] = useState(new Set(["Design"]));
  const toggle = (t: string, on: boolean) =>
    setSelected((s) => {
      const next = new Set(s);
      if (on) next.add(t);
      else next.delete(t);
      return next;
    });
  return (
    <div role="group" aria-label="Filter by team" className="flex flex-wrap gap-2">
      {teams.map((t) => <Chip key={t} selected={selected.has(t)} onToggle={(on) => toggle(t, on)}>{t}</Chip>)}
      <Chip onToggle={() => {}} disabled>Archived</Chip>
    </div>
  );
}
