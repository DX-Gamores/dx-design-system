"use client";
import { BarChart3, Camera, Database, FileText, FolderKanban, Gauge, HelpCircle, LayoutDashboard, ListChecks, Search, Settings, Users } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarRail,
} from "@/components/ui/sidebar";
import { BrandHeader } from "./brand-header";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

const main = [
  { title: "Dashboard", icon: LayoutDashboard }, { title: "Lifecycle", icon: ListChecks }, { title: "Analytics", icon: BarChart3 },
  { title: "Projects", icon: FolderKanban }, { title: "Team", icon: Users },
];
const documents = [{ title: "Data library", icon: Database }, { title: "Reports", icon: FileText }, { title: "Capture", icon: Camera }];
const secondary = [{ title: "Settings", url: "#", icon: Settings }, { title: "Get help", url: "#", icon: HelpCircle }, { title: "Search", url: "#", icon: Search }];

/** The app sidebar the dashboard, settings and table blocks share. Pass the current page's title. */
export function DashboardSidebar({ current = "Dashboard", variant = "inset" }: { current?: string; variant?: "sidebar" | "inset" }) {
  return (
    <Sidebar collapsible="icon" variant={variant} label="Main navigation">
      <SidebarHeader>
        <BrandHeader name="Acme Inc" detail="Workspace" logo={Gauge} />
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label="Main" className="contents">
          <SidebarGroup>
            <SidebarMenu>
              {main.map((m) => (
                <SidebarMenuItem key={m.title}>
                  <SidebarMenuButton href="#" isActive={m.title === current} tooltip={m.title}><Icon name={m.icon} /><span>{m.title}</span></SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel as="h2">Documents</SidebarGroupLabel>
            <SidebarMenu>
              {documents.map((m) => (
                <SidebarMenuItem key={m.title}>
                  <SidebarMenuButton href="#" isActive={m.title === current} tooltip={m.title}><Icon name={m.icon} /><span>{m.title}</span></SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <NavSecondary items={secondary.map((s) => ({ ...s }))} className="mt-auto" />
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: "Jane Cooper", email: "jane@acme.com" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
