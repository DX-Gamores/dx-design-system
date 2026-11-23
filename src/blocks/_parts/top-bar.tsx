"use client";
import { Gauge } from "lucide-react";
import { Avatar } from "@/components/ui/display";
import { Icon } from "@/components/ui/icon";
import { Menu } from "@/components/ui/overlays";

const links = ["Overview", "Customers", "Products", "Settings"];

/** A header-only app layout: logo, top navigation and the account menu. */
export function TopBar({ current = "Overview" }: { current?: string }) {
  return (
    <header className="sticky top-0 z-[var(--ds-z-sticky)] border-b border-line-default bg-surface">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 md:px-6">
        <a href="#" className="flex items-center gap-2 rounded-sm text-label-large focus-visible:focus-ring">
          <span className="grid size-7 place-items-center rounded-control bg-brand text-fg-on-brand"><Icon name={Gauge} size={16} /></span>
          Acme
        </a>
        <nav aria-label="Main" className="max-md:hidden">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l}>
                <a href="#" aria-current={l === current ? "page" : undefined}
                  className="flex h-8 items-center rounded-control px-3 text-label-medium text-fg-secondary hover:bg-neutral-hover hover:text-fg-primary focus-visible:focus-ring aria-[current=page]:text-fg-primary">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ms-auto">
          <Menu
            label="Account menu for Jane Cooper"
            items={[{ label: "Profile", icon: "user" }, { label: "Settings", icon: "settings" }, { label: "Sign out", icon: "sign-out", separatorBefore: true }]}
            trigger={({ ref, ...p }) => (
              <button ref={ref} type="button" {...p} aria-label="Account menu for Jane Cooper" className="rounded-full focus-visible:focus-ring">
                <Avatar name="Jane Cooper" decorative />
              </button>
            )}
          />
        </div>
      </div>
    </header>
  );
}
