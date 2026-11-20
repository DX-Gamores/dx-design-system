"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Chip, SearchField } from "@/components/ui";

export type IndexEntry = { slug: string; name: string; summary: string; category: string; coded: boolean };

/** All components, A–Z, with a text filter and category chips. */
export function ComponentIndex({ entries, categories }: { entries: IndexEntry[]; categories: string[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return entries.filter((e) => (!cat || e.category === cat) && (!t || e.name.toLowerCase().includes(t) || e.summary.toLowerCase().includes(t)));
  }, [entries, q, cat]);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="max-w-sm"><SearchField label="Filter components" value={q} onChange={setQ} placeholder="Filter components" /></div>
        <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
          <Chip selected={cat === null} onToggle={() => setCat(null)}>All</Chip>
          {categories.map((c) => <Chip key={c} selected={cat === c} onToggle={(on) => setCat(on ? c : null)}>{c}</Chip>)}
        </div>
        <p className="text-caption-default text-fg-secondary" aria-live="polite">{`${list.length} of ${entries.length} components`}</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((e) => (
          <li key={e.slug}>
            <Link href={`/components/${e.slug}/`} className="flex h-full flex-col gap-1.5 rounded-container border border-line-default bg-surface p-4 hover:border-line-hover focus-visible:focus-ring">
              <span className="flex items-center gap-2">
                <span className="text-label-large">{e.name}</span>
                {!e.coded && <Badge>Spec only</Badge>}
              </span>
              <span className="text-body-small text-fg-secondary">{e.summary}</span>
              <span className="mt-auto pt-1 text-caption-default text-fg-secondary">{e.category}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
