"use client";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Menu } from "@/components/ui/overlays";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";
import { BrandHeader } from "../../_parts/brand-header";
import { docsNav } from "../../_parts/docs-nav";

function UpgradeCard() {
  return (
    <div className="flex flex-col gap-2 rounded-container border border-line-default bg-surface-subtle p-3">
      <p className="text-label-medium">Get the Pro plan</p>
      <p className="text-caption-default text-fg-secondary">Private projects, single sign-on and priority support.</p>
      <Button size="sm" className="w-full">Upgrade</Button>
    </div>
  );
}

export function AppSidebar() {
  return (
    <Sidebar label="Documentation">
      <SidebarHeader>
        <BrandHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <nav aria-label="Documentation">
            <SidebarMenu>
              {docsNav.map((section) => (
                <SidebarMenuItem key={section.title}>
                  <Menu
                    label={`${section.title} pages`}
                    className="flex w-full"
                    placement="bottom-start"
                    items={section.items.map((i) => ({ label: i.title, icon: "isActive" in i && i.isActive ? ("check" as const) : undefined }))}
                    trigger={({ ref, ...p }) => (
                      <SidebarMenuButton ref={ref as React.Ref<HTMLElement>} {...p}>
                        <span className="flex-1">{section.title}</span>
                        <Icon name={ChevronRight} size={16} className="text-icon-secondary" />
                      </SidebarMenuButton>
                    )}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </nav>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UpgradeCard />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
