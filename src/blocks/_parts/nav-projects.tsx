"use client";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Menu } from "@/components/ui/overlays";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

/** A list of projects, each with a "More" menu. Hidden in the icon rail. */
export function NavProjects({ projects }: { projects: { name: string; url: string; icon: LucideIcon }[] }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]/sidebar:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((p) => (
          <SidebarMenuItem key={p.name}>
            <SidebarMenuButton href={p.url}>
              <Icon name={p.icon} />
              <span>{p.name}</span>
            </SidebarMenuButton>
            <div className="absolute end-1 top-2 group-data-[collapsible=icon]/sidebar:hidden">
              <Menu
                label={`More actions for ${p.name}`}
                placement="bottom-end"
                items={[{ label: "View project", icon: "folder" }, { label: "Share", icon: "share" }, { label: "Delete project", icon: "trash", tone: "danger", separatorBefore: true }]}
                trigger={({ ref, ...t }) => <SidebarMenuAction ref={ref} {...t} label={`More actions for ${p.name}`} showOnHover className="static" />}
              />
            </div>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-fg-secondary">
            <Icon name="more" />
            <span>More projects</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
