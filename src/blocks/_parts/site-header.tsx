"use client";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/nav-extra";
import { SidebarTrigger } from "@/components/ui/sidebar";

/** The bar above the page: sidebar toggle, breadcrumbs and optional actions on the end side. */
export function SiteHeader({ crumbs, actions }: { crumbs: { label: string; href?: string }[]; actions?: ReactNode }) {
  return (
    <header className="sticky top-0 z-[var(--ds-z-sticky)] flex h-14 shrink-0 items-center gap-2 border-b border-line-default bg-surface px-4 md:rounded-t-[inherit]">
      <SidebarTrigger className="-ms-1" />
      <span aria-hidden className="mx-1 h-4 w-px bg-line-default" />
      <Breadcrumbs items={crumbs} />
      {actions && <div className="ms-auto flex items-center gap-2">{actions}</div>}
    </header>
  );
}
