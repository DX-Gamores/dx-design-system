"use client";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { Calendars } from "../../_parts/calendars";
import { NavUser } from "../../_parts/nav-user";

/** Always open from 1024px; hidden below. */
export function SidebarRight() {
  return (
    <aside aria-label="Calendar" className="sticky top-0 hidden h-svh border-s border-line-default lg:flex">
      <Sidebar collapsible="none" className="w-[320px]">
        <SidebarHeader className="border-b border-line-default">
          <NavUser user={{ name: "Jane Cooper", email: "jane@acme.com" }} />
        </SidebarHeader>
        <SidebarContent>
          <Calendars />
        </SidebarContent>
        <SidebarFooter className="border-t border-line-default">
          <Button variant="secondary" leadingIcon="plus" className="w-full">New calendar</Button>
        </SidebarFooter>
      </Sidebar>
    </aside>
  );
}
