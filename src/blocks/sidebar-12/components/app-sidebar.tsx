"use client";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { Calendars } from "../../_parts/calendars";
import { NavUser } from "../../_parts/nav-user";

export function AppSidebar() {
  return (
    <Sidebar label="Calendar">
      <SidebarHeader className="border-b border-line-default">
        <NavUser user={{ name: "Jane Cooper", email: "jane@acme.com" }} />
      </SidebarHeader>
      <SidebarContent>
        <Calendars />
      </SidebarContent>
      <SidebarFooter className="border-t border-line-default">
        <Button variant="secondary" leadingIcon="plus" className="w-full">New calendar</Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
