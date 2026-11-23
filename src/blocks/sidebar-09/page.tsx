/**
 * @title Nested sidebars: an icon rail and a list
 * @description A mail-style layout: folders in a 72px rail, the messages of the selected folder in a panel next to it. Collapsing hides the panel and keeps the rail.
 * @route /inbox
 */
"use client";
import type { CSSProperties } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { SiteHeader } from "../_parts/site-header";

export default function Page() {
  return (
    <SidebarProvider style={{ "--sidebar-width": "360px" } as CSSProperties}>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader crumbs={[{ label: "All inboxes", href: "#" }, { label: "Inbox" }]} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <h1 className="text-heading-h2">Weekly sync notes</h1>
          <div aria-hidden className="flex flex-col gap-3">
            {Array.from({ length: 12 }, (_, i) => <div key={i} className="h-4 rounded-sm bg-surface-subtle" style={{ width: `${60 + ((i * 37) % 40)}%` }} />)}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
