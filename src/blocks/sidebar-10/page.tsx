/**
 * @title A workspace sidebar with page actions in a popover
 * @description Notes-app layout: workspace switcher, quick links with an unread count, favorites, nested workspace pages, and the page's own actions in a popover in the header.
 * @route /notes
 */
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/components/ui/nav-extra";
import { AppSidebar } from "./components/app-sidebar";
import { NavActions } from "./components/nav-actions";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-[var(--ds-z-sticky)] flex h-14 shrink-0 items-center gap-2 bg-canvas px-4">
          <SidebarTrigger className="-ms-1" />
          <span aria-hidden className="mx-1 h-4 w-px bg-line-default" />
          <Breadcrumbs items={[{ label: "Personal life", href: "#" }, { label: "Project management and task tracking" }]} />
          <div className="ms-auto"><NavActions /></div>
        </header>
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-10">
          <h1 className="text-heading-h1">Project management and task tracking</h1>
          <div aria-hidden className="flex flex-col gap-3">
            {Array.from({ length: 10 }, (_, i) => <div key={i} className="h-4 rounded-sm bg-surface-subtle" style={{ width: `${55 + ((i * 29) % 45)}%` }} />)}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
