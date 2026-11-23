"use client";
import { AudioWaveform, BookOpen, Bot, Command, Frame, GalleryVerticalEnd, Map as MapIcon, PieChart, Settings2, SquareTerminal } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { NavMain } from "../../_parts/nav-main";
import { NavProjects } from "../../_parts/nav-projects";
import { NavUser } from "../../_parts/nav-user";
import { TeamSwitcher } from "../../_parts/team-switcher";

const data = {
  user: { name: "Jane Cooper", email: "jane@acme.com" },
  teams: [
    { name: "Acme Inc", plan: "Enterprise", logo: GalleryVerticalEnd },
    { name: "Acme Labs", plan: "Startup", logo: AudioWaveform },
    { name: "Field Ops", plan: "Free", logo: Command },
  ],
  navMain: [
    { title: "Playground", url: "#", icon: SquareTerminal, isActive: true, items: [{ title: "History", url: "#" }, { title: "Starred", url: "#" }, { title: "Settings", url: "#" }] },
    { title: "Models", url: "#", icon: Bot, items: [{ title: "Genesis", url: "#" }, { title: "Explorer", url: "#" }, { title: "Quantum", url: "#" }] },
    { title: "Documentation", url: "#", icon: BookOpen, items: [{ title: "Introduction", url: "#" }, { title: "Get started", url: "#" }, { title: "Tutorials", url: "#" }, { title: "Changelog", url: "#" }] },
    { title: "Settings", url: "#", icon: Settings2, items: [{ title: "General", url: "#" }, { title: "Team", url: "#" }, { title: "Billing", url: "#" }, { title: "Limits", url: "#" }] },
  ],
  projects: [
    { name: "Design engineering", url: "#", icon: Frame },
    { name: "Sales and marketing", url: "#", icon: PieChart },
    { name: "Travel", url: "#", icon: MapIcon },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" label="Main navigation">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label="Main" className="contents">
          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
