"use client";
import { useState } from "react";
import { Bell, Check, Globe, Home, Keyboard, Link, Lock, Menu as MenuIcon, MessageCircle, Paintbrush, Settings, Video, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/nav-extra";
import { Dialog } from "@/components/ui/overlays";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";

const sections: { name: string; icon: LucideIcon }[] = [
  { name: "Notifications", icon: Bell }, { name: "Navigation", icon: MenuIcon }, { name: "Home", icon: Home }, { name: "Appearance", icon: Paintbrush },
  { name: "Messages & media", icon: MessageCircle }, { name: "Language & region", icon: Globe }, { name: "Accessibility", icon: Keyboard },
  { name: "Mark as read", icon: Check }, { name: "Audio & video", icon: Video }, { name: "Connected accounts", icon: Link },
  { name: "Privacy & visibility", icon: Lock }, { name: "Advanced", icon: Settings },
];

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Messages & media");
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open settings</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Settings" size="lg">
        <SidebarProvider className="min-h-0 bg-transparent max-md:flex-col">
          <nav aria-label="Settings sections" className="shrink-0 md:w-56 md:border-e md:border-line-default md:pe-3">
            <SidebarMenu className="max-md:flex-row max-md:overflow-x-auto max-md:pb-2">
              {sections.map((s) => (
                <SidebarMenuItem key={s.name} className="max-md:shrink-0">
                  <SidebarMenuButton isActive={s.name === active} aria-current={s.name === active ? "true" : undefined} onClick={() => setActive(s.name)} size="sm">
                    <Icon name={s.icon} size={16} /><span>{s.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </nav>
          <section aria-label={active} className="flex min-w-0 flex-1 flex-col gap-4 md:ps-6">
            <Breadcrumbs items={[{ label: "Settings", href: "#" }, { label: active }]} />
            <div aria-hidden className="flex h-[360px] flex-col gap-3 overflow-y-auto">
              {Array.from({ length: 6 }, (_, i) => <div key={i} className="aspect-video max-h-24 w-full rounded-container bg-surface-subtle" />)}
            </div>
          </section>
        </SidebarProvider>
      </Dialog>
    </>
  );
}
