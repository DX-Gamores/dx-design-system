"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/feedback";
import { Table, type SortDir } from "@/components/ui/data";

type Field = { id: string; crop: string; area: number; stage: string; moisture: number; next: string };
const fields: Field[] = [
  { id: "F-01", crop: "Rice", area: 42, stage: "Tillering", moisture: 41, next: "Top-dress, Oct 14" },
  { id: "F-02", crop: "Rice", area: 38, stage: "Harvest", moisture: 33, next: "Harvest, today" },
  { id: "F-04", crop: "Corn", area: 55, stage: "Tasseling", moisture: 22, next: "Irrigate, today" },
  { id: "F-05", crop: "Corn", area: 47, stage: "V8", moisture: 36, next: "Fertilizer, in progress" },
  { id: "F-07", crop: "Sugarcane", area: 61, stage: "Grand growth", moisture: 19, next: "Irrigate, today" },
  { id: "F-09", crop: "Banana", area: 30, stage: "Flowering", moisture: 44, next: "Bagging, Oct 16" },
  { id: "F-11", crop: "Coffee", area: 24, stage: "Cherry", moisture: 24, next: "Irrigate, tomorrow" },
];
const moistureTone = (m: number) => (m < 25 ? "danger" : m < 35 ? "warning" : "success");
const moistureLabel = (m: number) => (m < 25 ? "Low" : m < 35 ? "Watch" : "Good");

export function FieldsTable() {
  const [sort, setSort] = useState<{ key: string; direction: SortDir } | null>({ key: "moisture", direction: "ascending" });
  return (
    <Table<Field>
      caption="Fields"
      rows={fields}
      rowKey={(f) => f.id}
      sort={sort}
      onSortChange={setSort}
      columns={[
        { key: "id", header: "Field", sortable: true, render: (f) => <a href="#" className="rounded-sm text-label-medium text-fg-brand underline-offset-2 hover:underline focus-visible:focus-ring">{f.id}</a> },
        { key: "crop", header: "Crop", sortable: true },
        { key: "area", header: "Area (ha)", numeric: true, sortable: true },
        { key: "stage", header: "Stage" },
        { key: "moisture", header: "Soil moisture", sortable: true, render: (f) => <span className="flex items-center gap-2"><span className="tabular-nums">{f.moisture}%</span><Badge tone={moistureTone(f.moisture)}>{moistureLabel(f.moisture)}</Badge></span> },
        { key: "next", header: "Next action" },
      ]}
    />
  );
}
