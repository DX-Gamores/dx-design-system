/**
 * @title Tasks table with search, filters and bulk actions
 * @description Search, status filter chips, sortable columns, row selection with a bulk-action bar that announces the count, and pagination.
 * @route /tasks
 * @height 900
 */
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "../_parts/dashboard-sidebar";
import { SiteHeader } from "../_parts/site-header";
import { TasksTable } from "./components/tasks-table";

export default function Page() {
  return (
    <SidebarProvider>
      <DashboardSidebar current="Lifecycle" />
      <SidebarInset>
        <SiteHeader crumbs={[{ label: "Lifecycle", href: "#" }, { label: "Tasks" }]} />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1"><h1 className="text-heading-h2">Tasks</h1><p className="text-body-medium text-fg-secondary">Everything the team is working on this cycle.</p></div>
            <Button leadingIcon="plus">New task</Button>
          </div>
          <TasksTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
