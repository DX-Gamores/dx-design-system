"use client";
import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes } from "react";
import { Icon } from "@/components/ui/icon";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

/** Small links near the bottom of the sidebar (support, feedback). */
export function NavSecondary({ items, ...rest }: HTMLAttributes<HTMLDivElement> & { items: { title: string; url: string; icon: LucideIcon }[] }) {
  return (
    <SidebarGroup {...rest}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton href={item.url} size="sm" tooltip={item.title}>
                <Icon name={item.icon} size={16} />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
