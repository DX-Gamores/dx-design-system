"use client";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import {
  SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton,
  SidebarMenuSubItem, useDisclosure, useSidebar,
} from "@/components/ui/sidebar";

export type NavItem = { title: string; url: string; icon: LucideIcon; isActive?: boolean; items?: { title: string; url: string; isActive?: boolean }[] };

/** Main navigation: rows that open to show their pages. In the icon rail a row expands the sidebar first. */
export function NavMain({ label = "Platform", items }: { label?: string; items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (item.items?.length ? <NavMainGroup key={item.title} item={item} /> : (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton href={item.url} isActive={item.isActive} tooltip={item.title}>
              <Icon name={item.icon} />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavMainGroup({ item }: { item: NavItem }) {
  const d = useDisclosure(item.isActive);
  const { state, setOpen, isMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.title}
        {...d.triggerProps}
        onClick={() => { if (state === "collapsed" && !isMobile) { setOpen(true); d.setOpen(true); } else d.triggerProps.onClick(); }}
      >
        <Icon name={item.icon} />
        <span className="flex-1">{item.title}</span>
        <Icon name={ChevronRight} size={16} className={d.open ? "rotate-90 transition-transform" : "transition-transform"} />
      </SidebarMenuButton>
      <SidebarMenuSub {...d.contentProps}>
        {item.items!.map((sub) => (
          <SidebarMenuSubItem key={sub.title}>
            <SidebarMenuSubButton href={sub.url} isActive={sub.isActive}><span>{sub.title}</span></SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}
