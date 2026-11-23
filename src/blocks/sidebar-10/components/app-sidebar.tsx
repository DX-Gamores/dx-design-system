"use client";
import {
  AudioWaveform, Blocks, Calendar, ChevronRight, Command, FileText, Home, Inbox, MessageCircleQuestion, Search, Settings2, Sparkles, Star, Trash2, type LucideIcon,
} from "lucide-react";
import { Icon } from "@/components/ui/icon";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail, useDisclosure,
} from "@/components/ui/sidebar";
import { NavSecondary } from "../../_parts/nav-secondary";
import { TeamSwitcher } from "../../_parts/team-switcher";

const teams = [{ name: "Acme Inc", plan: "Enterprise", logo: Command }, { name: "Acme Labs", plan: "Startup", logo: AudioWaveform }];
const quick: { title: string; icon: LucideIcon; isActive?: boolean; badge?: string }[] = [
  { title: "Search", icon: Search }, { title: "Ask AI", icon: Sparkles }, { title: "Home", icon: Home, isActive: true }, { title: "Inbox", icon: Inbox, badge: "10" },
];
const favorites = ["Project management and task tracking", "Family recipe collection", "Fitness tracker and workout routines", "Book notes and reading list", "Travel itinerary"];
const workspaces = [
  { name: "Personal life", pages: ["Daily journal", "Health and wellness", "Personal goals"] },
  { name: "Professional development", pages: ["Career objectives", "Skills acquisition", "Networking contacts"] },
  { name: "Creative projects", pages: ["Writing ideas", "Art and design portfolio", "Music composition"] },
  { name: "Home management", pages: ["Household budget", "Home maintenance", "Family calendar"] },
];
const secondary = [{ title: "Calendar", url: "#", icon: Calendar }, { title: "Settings", url: "#", icon: Settings2 }, { title: "Templates", url: "#", icon: Blocks }, { title: "Trash", url: "#", icon: Trash2 }, { title: "Help", url: "#", icon: MessageCircleQuestion }];

function Workspace({ name, pages }: { name: string; pages: string[] }) {
  const d = useDisclosure(name === "Personal life");
  return (
    <SidebarMenuItem>
      <SidebarMenuButton {...d.triggerProps}>
        <Icon name={ChevronRight} size={16} className={d.open ? "rotate-90 transition-transform" : "transition-transform"} />
        <span>{name}</span>
      </SidebarMenuButton>
      <SidebarMenuSub {...d.contentProps}>
        {pages.map((p) => (
          <SidebarMenuSubItem key={p}>
            <SidebarMenuSubButton href="#"><Icon name={FileText} size={16} className="text-icon-secondary" /><span>{p}</span></SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  return (
    <Sidebar label="Workspace" className="border-r-0">
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
        <SidebarMenu>
          {quick.map((q) => (
            <SidebarMenuItem key={q.title}>
              <SidebarMenuButton href="#" isActive={q.isActive} size="sm">
                <Icon name={q.icon} size={16} /><span>{q.title}</span>
              </SidebarMenuButton>
              {q.badge && <SidebarMenuBadge label="unread" className="top-1.5">{q.badge}</SidebarMenuBadge>}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label="Pages" className="contents">
          <SidebarGroup>
            <SidebarGroupLabel as="h2">Favorites</SidebarGroupLabel>
            <SidebarMenu>
              {favorites.map((f) => (
                <SidebarMenuItem key={f}>
                  <SidebarMenuButton href="#" size="sm"><Icon name={Star} size={16} /><span>{f}</span></SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel as="h2">Workspaces</SidebarGroupLabel>
            <SidebarMenu>{workspaces.map((w) => <Workspace key={w.name} {...w} />)}</SidebarMenu>
          </SidebarGroup>
          <NavSecondary items={secondary} className="mt-auto" />
        </nav>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
