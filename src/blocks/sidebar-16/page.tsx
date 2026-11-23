/**
 * @title A sidebar under a sticky site header
 * @description A full-width header with the toggle, breadcrumbs and search stays on top; the sidebar sits below it.
 * @route /dashboard
 */
"use client";
import type { CSSProperties } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { SiteHeader } from "./components/site-header";
import { PagePlaceholder } from "../_parts/page-placeholder";

export default function Page() {
  return (
    <SidebarProvider className="flex-col" style={{ "--header-height": "56px" } as CSSProperties}>
      <SiteHeader />
      <div className="flex flex-1">
        <AppSidebar />
        <SidebarInset>
          <PagePlaceholder title="Data fetching" />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
