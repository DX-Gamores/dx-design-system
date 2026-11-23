"use client";
import { AudioWaveform, Calendar, Command, Home, Inbox, Search, Settings2, Sparkles } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { NavMain } from "../../_parts/nav-main";
import { TeamSwitcher } from "../../_parts/team-switcher";

const teams = [{ name: "Acme Inc", plan: "Enterprise", logo: Command }, { name: "Acme Labs", plan: "Startup", logo: AudioWaveform }];
const items = [
  { title: "Search", url: "#", icon: Search }, { title: "Ask AI", url: "#", icon: Sparkles }, { title: "Home", url: "#", icon: Home, isActive: true },
  { title: "Inbox", url: "#", icon: Inbox }, { title: "Calendar", url: "#", icon: Calendar }, { title: "Settings", url: "#", icon: Settings2 },
];

export function SidebarLeft() {
  return (
    <Sidebar label="Workspace">
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label="Workspace" className="contents"><NavMain label="Workspace" items={items} /></nav>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
