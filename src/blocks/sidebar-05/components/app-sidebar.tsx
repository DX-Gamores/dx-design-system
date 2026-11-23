"use client";
import { Minus, Plus } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub,
  SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail, useDisclosure,
} from "@/components/ui/sidebar";
import { BrandHeader } from "../../_parts/brand-header";
import { docsNav } from "../../_parts/docs-nav";
import { SearchForm } from "../../_parts/search-form";

type Section = (typeof docsNav)[number];

function NavSection({ section }: { section: Section }) {
  const d = useDisclosure(section.items.some((i) => "isActive" in i && i.isActive));
  return (
    <SidebarMenuItem>
      <SidebarMenuButton {...d.triggerProps} size="sm" className="text-label-medium text-fg-primary">
        <span className="flex-1">{section.title}</span>
        <Icon name={d.open ? Minus : Plus} size={16} className="text-icon-secondary" />
      </SidebarMenuButton>
      <SidebarMenuSub {...d.contentProps}>
        {section.items.map((item) => (
          <SidebarMenuSubItem key={item.title}>
            <SidebarMenuSubButton href={item.url} isActive={"isActive" in item && item.isActive}><span>{item.title}</span></SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  return (
    <Sidebar label="Documentation">
      <SidebarHeader>
        <BrandHeader />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <nav aria-label="Documentation">
            <SidebarMenu>{docsNav.map((s) => <NavSection key={s.title} section={s} />)}</SidebarMenu>
          </nav>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
