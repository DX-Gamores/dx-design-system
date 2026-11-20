/**
 * @title Search Field
 * @description Filters as you type. Esc or the clear button empties it.
 */
"use client";
import { useState } from "react";
import { SearchField } from "@/components/ui/form";

const projects = ["Q4 launch", "Billing revamp", "Brand refresh", "Mobile onboarding", "Data warehouse"];

export default function Example() {
  const [q, setQ] = useState("");
  const hits = projects.filter((p) => p.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="grid max-w-2xl gap-4 md:grid-cols-2">
      <SearchField label="Search projects" value={q} onChange={setQ} placeholder="Search projects" />
      <ul aria-live="polite" className="flex flex-col gap-1 text-body-small">
        {hits.length ? hits.map((h) => <li key={h}>{h}</li>) : <li className="text-fg-secondary">No projects match “{q}”.</li>}
      </ul>
    </div>
  );
}
