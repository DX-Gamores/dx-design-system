/**
 * @title A sidebar on the right
 * @description An "On this page" sidebar on the end side of the screen, with the toggle at the end of the header.
 * @route /docs
 */
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/components/ui/nav-extra";
import { AppSidebar } from "./components/app-sidebar";
import { PagePlaceholder } from "../_parts/page-placeholder";

export default function Page() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="sticky top-0 z-[var(--ds-z-sticky)] flex h-14 shrink-0 items-center gap-2 border-b border-line-default bg-surface px-4">
          <Breadcrumbs items={[{ label: "Building your application", href: "#" }, { label: "Data fetching" }]} />
          <SidebarTrigger label="Toggle table of contents" className="ms-auto -me-1 rotate-180" />
        </header>
        <PagePlaceholder title="Data fetching" />
      </SidebarInset>
      <AppSidebar />
    </SidebarProvider>
  );
}
