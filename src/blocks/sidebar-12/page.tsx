/**
 * @title A sidebar with a calendar
 * @description Account menu on top, a month calendar, and calendars you can show or hide. A wider sidebar (320px) so the calendar fits.
 * @route /calendar
 */
"use client";
import type { CSSProperties } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { SiteHeader } from "../_parts/site-header";

export default function Page() {
  return (
    <SidebarProvider style={{ "--sidebar-width": "320px" } as CSSProperties}>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader crumbs={[{ label: "Calendar", href: "#" }, { label: "October 2026" }]} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <h1 className="text-heading-h2">October 2026</h1>
          <div aria-hidden className="grid flex-1 grid-cols-7 gap-px overflow-hidden rounded-container border border-line-default bg-line-default">
            {Array.from({ length: 35 }, (_, i) => <div key={i} className="min-h-20 bg-surface p-2 text-caption-default text-fg-secondary">{((i + 27) % 31) + 1}</div>)}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
