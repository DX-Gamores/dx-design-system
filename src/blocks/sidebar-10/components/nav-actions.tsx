"use client";
import { useState } from "react";
import { ArrowDown, ArrowUp, Bell, Copy, CornerUpLeft, CornerUpRight, FileText, GalleryVerticalEnd, LineChart, Link, Settings2, Star, Trash, Trash2, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Popover } from "@/components/ui/overlays";

const groups: { label: string; icon: LucideIcon }[][] = [
  [{ label: "Customize page", icon: Settings2 }, { label: "Turn into wiki", icon: FileText }],
  [{ label: "Copy link", icon: Link }, { label: "Duplicate", icon: Copy }, { label: "Move to", icon: CornerUpRight }, { label: "Move to trash", icon: Trash2 }],
  [{ label: "Undo", icon: CornerUpLeft }, { label: "View analytics", icon: LineChart }, { label: "Version history", icon: GalleryVerticalEnd }, { label: "Show deleted pages", icon: Trash }, { label: "Notifications", icon: Bell }],
  [{ label: "Import", icon: ArrowUp }, { label: "Export", icon: ArrowDown }],
];

/** "Edited …", a star and a popover with the page's actions. */
export function NavActions() {
  const [starred, setStarred] = useState(false);
  return (
    <div className="flex items-center gap-1 text-body-small">
      <span className="me-1 text-fg-secondary max-md:hidden">Edited Oct 8</span>
      <button type="button" aria-pressed={starred} aria-label="Add to favorites" onClick={() => setStarred((s) => !s)}
        className="inline-flex size-8 items-center justify-center rounded-control text-icon-secondary hover:bg-neutral-hover focus-visible:focus-ring">
        <Icon name={Star} size={16} className={starred ? "fill-current text-icon-warning" : ""} />
      </button>
      <Popover
        title="Page actions"
        placement="bottom"
        width={240}
        trigger={({ ref, ...p }) => (
          <button ref={ref} type="button" {...p} aria-label="Page actions" className="inline-flex size-8 items-center justify-center rounded-control text-icon-secondary hover:bg-neutral-hover focus-visible:focus-ring">
            <Icon name="more" size={16} />
          </button>
        )}
      >
        <div className="-mx-2 flex flex-col">
          {groups.map((g, i) => (
            <ul key={i} className="flex flex-col border-line-default py-1 not-first:border-t">
              {g.map((a) => (
                <li key={a.label}>
                  <button type="button" className="flex h-8 w-full items-center gap-2 rounded-sm px-2 text-start text-body-small hover:bg-neutral-hover focus-visible:focus-ring">
                    <Icon name={a.icon} size={16} className="text-icon-secondary" />{a.label}
                  </button>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </Popover>
    </div>
  );
}
