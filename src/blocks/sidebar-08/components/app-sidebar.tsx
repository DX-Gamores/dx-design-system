"use client";
import { BookOpen, Bot, Command, Frame, LifeBuoy, Map as MapIcon, PieChart, Send, Settings2, SquareTerminal } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { BrandHeader } from "../../_parts/brand-header";
import { NavMain } from "../../_parts/nav-main";
import { NavProjects } from "../../_parts/nav-projects";
import { NavSecondary } from "../../_parts/nav-secondary";
import { NavUser } from "../../_parts/nav-user";

const data = {
  user: { name: "Jane Cooper", email: "jane@acme.com" },
  navMain: [
    { title: "Playground", url: "#", icon: SquareTerminal, isActive: true, items: [{ title: "History", url: "#" }, { title: "Starred", url: "#" }, { title: "Settings", url: "#" }] },
    { title: "Models", url: "#", icon: Bot, items: [{ title: "Genesis", url: "#" }, { title: "Explorer", url: "#" }, { title: "Quantum", url: "#" }] },
    { title: "Documentation", url: "#", icon: BookOpen, items: [{ title: "Introduction", url: "#" }, { title: "Get started", url: "#" }, { title: "Tutorials", url: "#" }] },
    { title: "Settings", url: "#", icon: Settings2, items: [{ title: "General", url: "#" }, { title: "Team", url: "#" }, { title: "Billing", url: "#" }] },
  ],
  navSecondary: [{ title: "Support", url: "#", icon: LifeBuoy }, { title: "Feedback", url: "#", icon: Send }],
  projects: [
    { name: "Design engineering", url: "#", icon: Frame },
    { name: "Sales and marketing", url: "#", icon: PieChart },
    { name: "Travel", url: "#", icon: MapIcon },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar variant="inset" label="Main navigation">
      <SidebarHeader>
        <BrandHeader name="Acme Inc" detail="Enterprise" logo={Command} />
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label="Main" className="contents">
          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
