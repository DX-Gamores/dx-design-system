"use client";
import { ChevronsUpDown } from "lucide-react";
import { Avatar } from "@/components/ui/display";
import { Icon } from "@/components/ui/icon";
import { Menu } from "@/components/ui/overlays";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

/** The signed-in person at the bottom of the sidebar, with an account menu. */
export function NavUser({ user }: { user: { name: string; email: string } }) {
  const { isMobile, state } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menu
          label={`Account menu for ${user.name}`}
          className="flex w-full"
          placement={!isMobile && state === "collapsed" ? "right-end" : "top-start"}
          items={[
            { label: "Profile", icon: "user" },
            { label: "Billing", icon: "credit-card" },
            { label: "Notifications", icon: "bell" },
            { label: "Sign out", icon: "sign-out", separatorBefore: true },
          ]}
          trigger={({ ref, ...p }) => (
            <SidebarMenuButton ref={ref as React.Ref<HTMLElement>} {...p} size="lg" tooltip={user.name}>
              <Avatar name={user.name} decorative />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-label-medium text-fg-primary">{user.name}</span>
                <span className="truncate text-caption-default">{user.email}</span>
              </span>
              <Icon name={ChevronsUpDown} size={16} />
            </SidebarMenuButton>
          )}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
