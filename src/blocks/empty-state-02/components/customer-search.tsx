"use client";
import { useState } from "react";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip, SearchField } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";

export function CustomerSearch() {
  const [q, setQ] = useState("harbour labs");
  const [filters, setFilters] = useState(["Active", "Enterprise"]);
  const cleared = !q && !filters.length;
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-72"><SearchField label="Search customers" value={q} onChange={setQ} onClear={() => setQ("")} /></div>
        {filters.map((f) => <Chip key={f} onRemove={() => setFilters((x) => x.filter((y) => y !== f))}>{f}</Chip>)}
      </div>
      <section aria-live="polite" className="flex flex-col items-center gap-4 rounded-container border border-line-default bg-surface px-6 py-14 text-center">
        {cleared ? (
          <p className="text-body-medium text-fg-secondary">Showing all 248 customers.</p>
        ) : (
          <>
            <span className="grid size-12 place-items-center rounded-full bg-surface-subtle text-icon-primary"><Icon name={SearchX} /></span>
            <h2 className="text-heading-h4">No customers match {q ? <>“{q}”</> : "these filters"}</h2>
            <div className="flex max-w-sm flex-col gap-1 text-body-small text-fg-secondary">
              <p>Try one of these:</p>
              <ul className="list-inside list-disc text-start">
                <li>Check the spelling — did you mean <button type="button" onClick={() => setQ("harbor labs")} className="rounded-sm text-fg-brand underline underline-offset-2 focus-visible:focus-ring">harbor labs</button>?</li>
                <li>Remove a filter, or search all plans</li>
                <li>Search by email or customer ID</li>
              </ul>
            </div>
            <Button variant="secondary" onClick={() => { setQ(""); setFilters([]); }}>Clear search and filters</Button>
          </>
        )}
      </section>
    </>
  );
}
