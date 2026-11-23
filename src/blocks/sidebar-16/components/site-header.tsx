"use client";
import { Breadcrumbs } from "@/components/ui/nav-extra";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchForm } from "../../_parts/search-form";

/** Full-width header above the sidebar. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-[var(--ds-z-sticky)] flex h-(--header-height) w-full items-center gap-2 border-b border-line-default bg-surface px-4">
      <SidebarTrigger className="-ms-1" />
      <span aria-hidden className="mx-1 h-4 w-px bg-line-default" />
      <Breadcrumbs items={[{ label: "Building your application", href: "#" }, { label: "Data fetching" }]} />
      <SearchForm placeholder="Search…" className="ms-auto w-full max-w-56 max-sm:hidden" />
    </header>
  );
}
