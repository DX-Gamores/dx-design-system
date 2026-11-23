"use client";
import { useState } from "react";
import { BookOpen, ChevronsUpDown } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Menu } from "@/components/ui/overlays";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

/** Product name + version picker for documentation sidebars. */
export function VersionSwitcher({ product = "Acme Docs", versions }: { product?: string; versions: string[] }) {
  const [v, setV] = useState(versions[0]);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu
          label={`Version: ${v}`}
          className="flex w-full"
          placement="bottom-start"
          items={versions.map((x) => ({ label: `v${x}`, icon: x === v ? ("check" as const) : undefined, onSelect: () => setV(x) }))}
          trigger={({ ref, ...p }) => (
            <SidebarMenuButton ref={ref as React.Ref<HTMLElement>} {...p} size="lg">
              <span className="grid size-8 shrink-0 place-items-center rounded-control bg-brand text-fg-on-brand">
                <Icon name={BookOpen} size={16} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-label-medium text-fg-primary">{product}</span>
                <span className="truncate text-caption-default">v{v}</span>
              </span>
              <Icon name={ChevronsUpDown} size={16} />
            </SidebarMenuButton>
          )}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
