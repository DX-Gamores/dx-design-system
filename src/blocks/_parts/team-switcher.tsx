"use client";
import { useState } from "react";
import { ChevronsUpDown, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Menu } from "@/components/ui/overlays";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

export type Team = { name: string; plan: string; logo: LucideIcon };

/** Workspace switcher at the top of the sidebar. */
export function TeamSwitcher({ teams }: { teams: Team[] }) {
  const { isMobile, state } = useSidebar();
  const [active, setActive] = useState(teams[0]);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu
          label="Switch workspace"
          className="flex w-full"
          placement={!isMobile && state === "collapsed" ? "right-end" : "bottom-start"}
          items={[
            ...teams.map((t) => ({ label: t.name, onSelect: () => setActive(t) })),
            { label: "Add workspace", icon: "plus" as const, separatorBefore: true },
          ]}
          trigger={({ ref, ...p }) => (
            <SidebarMenuButton ref={ref as React.Ref<HTMLElement>} {...p} size="lg" tooltip={active.name}>
              <span className="grid size-8 shrink-0 place-items-center rounded-control bg-brand text-fg-on-brand">
                <Icon name={active.logo} size={16} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-label-medium text-fg-primary">{active.name}</span>
                <span className="truncate text-caption-default">{active.plan}</span>
              </span>
              <Icon name={ChevronsUpDown} size={16} />
            </SidebarMenuButton>
          )}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
