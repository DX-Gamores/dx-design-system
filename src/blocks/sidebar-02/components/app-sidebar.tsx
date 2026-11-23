"use client";
import { ChevronRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarRail, useDisclosure,
} from "@/components/ui/sidebar";
import { docsNav, docsVersions } from "../../_parts/docs-nav";
import { SearchForm } from "../../_parts/search-form";
import { VersionSwitcher } from "../../_parts/version-switcher";

type Section = (typeof docsNav)[number];

function CollapsibleSection({ section }: { section: Section }) {
  const d = useDisclosure(section.items.some((i) => "isActive" in i && i.isActive) || section === docsNav[0]);
  return (
    <SidebarGroup className="py-1">
      <h2>
        <button type="button" {...d.triggerProps}
          className="flex h-8 w-full items-center justify-between rounded-control px-2 text-label-small text-fg-primary hover:bg-neutral-hover focus-visible:focus-ring">
          {section.title}
          <Icon name={ChevronRight} size={16} className={d.open ? "rotate-90 text-icon-secondary transition-transform" : "text-icon-secondary transition-transform"} />
        </button>
      </h2>
      <SidebarGroupContent {...d.contentProps}>
        <SidebarMenu>
          {section.items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton href={item.url} isActive={"isActive" in item && item.isActive} size="sm"><span>{item.title}</span></SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  return (
    <Sidebar label="Documentation">
      <SidebarHeader>
        <VersionSwitcher versions={docsVersions} />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label="Documentation" className="contents">
          {docsNav.map((s) => <CollapsibleSection key={s.title} section={s} />)}
        </nav>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
