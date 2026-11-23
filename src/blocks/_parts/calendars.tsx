"use client";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/date";
import { Icon } from "@/components/ui/icon";
import { SidebarGroup, SidebarGroupContent, useDisclosure } from "@/components/ui/sidebar";

const groups = [
  { name: "My calendars", items: ["Personal", "Work", "Family"] },
  { name: "Favorites", items: ["Holidays", "Birthdays"] },
  { name: "Other", items: ["Travel", "Reminders", "Deadlines"] },
];
const dot = ["bg-brand", "bg-cat-teal-solid", "bg-cat-amber-solid", "bg-cat-red-solid", "bg-cat-lime-solid", "bg-cat-green-solid", "bg-cat-sky-solid", "bg-cat-orange-solid"];

function CalendarGroup({ name, items, offset }: { name: string; items: string[]; offset: number }) {
  const d = useDisclosure(true);
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(items.map((i, k) => [i, k < 2])));
  return (
    <SidebarGroup className="py-1">
      <h3>
        <button type="button" {...d.triggerProps} className="flex h-8 w-full items-center justify-between rounded-control px-2 text-label-small text-fg-primary hover:bg-neutral-hover focus-visible:focus-ring">
          {name}
          <Icon name={ChevronRight} size={16} className={d.open ? "rotate-90 text-icon-secondary transition-transform" : "text-icon-secondary transition-transform"} />
        </button>
      </h3>
      <SidebarGroupContent {...d.contentProps}>
        <ul className="flex flex-col">
          {items.map((it, k) => (
            <li key={it}>
              <label className="flex h-8 cursor-pointer items-center gap-2 rounded-control px-2 text-body-small hover:bg-neutral-hover has-focus-visible:focus-ring">
                <input type="checkbox" checked={on[it]} onChange={(e) => setOn((o) => ({ ...o, [it]: e.target.checked }))} className="size-4 accent-[var(--ds-color-bg-brand)] outline-none" />
                <span aria-hidden className={`size-2 rounded-full ${dot[(offset + k) % dot.length]}`} />
                {it}
              </label>
            </li>
          ))}
        </ul>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

/** A month calendar and a list of calendars you can show or hide. */
export function Calendars() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <>
      <div className="flex justify-center px-2 [&>div]:border-0 [&>div]:shadow-none [&>div]:bg-transparent">
        <Calendar value={date} onChange={setDate} />
      </div>
      <div role="separator" className="mx-3 h-px bg-line-default" />
      <section aria-label="Calendars">
        {groups.map((g, i) => <CalendarGroup key={g.name} {...g} offset={i * 3} />)}
      </section>
    </>
  );
}
