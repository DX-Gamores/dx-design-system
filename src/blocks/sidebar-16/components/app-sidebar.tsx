"use client";
import { BookOpen, Bot, Frame, LifeBuoy, Map as MapIcon, PieChart, Send, Settings2, SquareTerminal } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { NavMain } from "../../_parts/nav-main";
import { NavProjects } from "../../_parts/nav-projects";
import { NavSecondary } from "../../_parts/nav-secondary";
import { NavUser } from "../../_parts/nav-user";

const navMain = [
  { title: "Playground", url: "#", icon: SquareTerminal, isActive: true, items: [{ title: "History", url: "#" }, { title: "Starred", url: "#" }, { title: "Settings", url: "#" }] },
  { title: "Models", url: "#", icon: Bot, items: [{ title: "Genesis", url: "#" }, { title: "Explorer", url: "#" }] },
  { title: "Documentation", url: "#", icon: BookOpen, items: [{ title: "Introduction", url: "#" }, { title: "Tutorials", url: "#" }] },
  { title: "Settings", url: "#", icon: Settings2, items: [{ title: "General", url: "#" }, { title: "Team", url: "#" }] },
];
const projects = [{ name: "Design engineering", url: "#", icon: Frame }, { name: "Sales and marketing", url: "#", icon: PieChart }, { name: "Travel", url: "#", icon: MapIcon }];
const secondary = [{ title: "Support", url: "#", icon: LifeBuoy }, { title: "Feedback", url: "#", icon: Send }];

export function AppSidebar() {
  return (
    <Sidebar label="Main navigation" className="top-(--header-height)! h-[calc(100svh-var(--header-height))]!">
      <SidebarContent>
        <nav aria-label="Main" className="contents">
          <NavMain items={navMain} />
          <NavProjects projects={projects} />
          <NavSecondary items={secondary} className="mt-auto" />
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: "Jane Cooper", email: "jane@acme.com" }} />
      </SidebarFooter>
    </Sidebar>
  );
}
