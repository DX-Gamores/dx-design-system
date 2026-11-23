"use client";
import { GalleryVerticalEnd, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

/** Logo, product name and a second line (plan or version) at the top of the sidebar. Links home. */
export function BrandHeader({ name = "Acme Docs", detail = "v4.0.0", logo = GalleryVerticalEnd }: { name?: string; detail?: string; logo?: LucideIcon }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton href="#" size="lg" tooltip={name}>
          <span className="grid size-8 shrink-0 place-items-center rounded-control bg-brand text-fg-on-brand"><Icon name={logo} size={16} /></span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-label-medium text-fg-primary">{name}</span>
            <span className="truncate text-caption-default">{detail}</span>
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
