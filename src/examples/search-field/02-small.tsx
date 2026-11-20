/**
 * @title Small
 * @description For toolbars above tables.
 */
"use client";
import { useState } from "react";
import { SearchField } from "@/components/ui/form";

export default function Example() {
  const [q, setQ] = useState("");
  return (
    <div className="max-w-xs">
      <SearchField label="Search members" value={q} onChange={setQ} size="sm" placeholder="Search members" />
    </div>
  );
}
