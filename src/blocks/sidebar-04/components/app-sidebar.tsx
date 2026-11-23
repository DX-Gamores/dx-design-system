"use client";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail,
} from "@/components/ui/sidebar";
import { BrandHeader } from "../../_parts/brand-header";
import { docsNav } from "../../_parts/docs-nav";

export function AppSidebar() {
  return (
    <Sidebar label="Documentation" variant="floating">
      <SidebarHeader>
        <BrandHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <nav aria-label="Documentation">
            <SidebarMenu className="gap-2">
              {docsNav.map((section) => (
                <SidebarMenuItem key={section.title}>
                  <SidebarMenuButton href={section.url} size="sm" className="text-label-medium text-fg-primary"><span>{section.title}</span></SidebarMenuButton>
                  <SidebarMenuSub>
                    {section.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton href={item.url} isActive={"isActive" in item && item.isActive}><span>{item.title}</span></SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </nav>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
