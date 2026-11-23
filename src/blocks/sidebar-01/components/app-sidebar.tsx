"use client";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarRail,
} from "@/components/ui/sidebar";
import { docsNav, docsVersions } from "../../_parts/docs-nav";
import { SearchForm } from "../../_parts/search-form";
import { VersionSwitcher } from "../../_parts/version-switcher";

export function AppSidebar() {
  return (
    <Sidebar label="Documentation">
      <SidebarHeader>
        <VersionSwitcher versions={docsVersions} />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label="Documentation" className="contents">
          {docsNav.map((section) => (
            <SidebarGroup key={section.title}>
              <SidebarGroupLabel as="h2">{section.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton href={item.url} isActive={"isActive" in item && item.isActive} size="sm">
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
