/**
 * @title Composable sidebar
 * @preview /view/sidebar-07/
 * @description Build your own sidebar from parts: SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton and SidebarInset. Collapses to a 72px icon rail with Ctrl/⌘ + B. All 16 sidebar layouts are on the Blocks page.
 */
"use client";
import { Folder, LayoutDashboard, Settings, Users } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", icon: LayoutDashboard, active: true },
  { title: "Projects", icon: Folder },
  { title: "Members", icon: Users },
  { title: "Settings", icon: Settings },
];

// app/(app)/layout.tsx — npx shadcn@latest add @dx/sidebar-07 for a complete one.
export default function Example() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" label="Main navigation">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel as="h2">Acme</SidebarGroupLabel>
            <nav aria-label="Main">
              <SidebarMenu>
                {items.map((i) => (
                  <SidebarMenuItem key={i.title}>
                    <SidebarMenuButton href="#" isActive={i.active} tooltip={i.title}>
                      <Icon name={i.icon} />
                      <span>{i.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b border-line-default px-4"><SidebarTrigger /></header>
        <div className="p-6"><h1 className="text-heading-h2">Dashboard</h1></div>
      </SidebarInset>
    </SidebarProvider>
  );
}
