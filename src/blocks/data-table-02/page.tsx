/**
 * @title Invoices table with column picker and row actions
 * @description Choose which columns to show, a "More" menu on each row, status badges, a totals row and export. Scrolls sideways inside its frame on small screens.
 * @route /invoices
 * @height 820
 */
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "../_parts/dashboard-sidebar";
import { SiteHeader } from "../_parts/site-header";
import { InvoicesTable } from "./components/invoices-table";

export default function Page() {
  return (
    <SidebarProvider>
      <DashboardSidebar current="Reports" />
      <SidebarInset>
        <SiteHeader crumbs={[{ label: "Reports", href: "#" }, { label: "Invoices" }]} />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <h1 className="text-heading-h2">Invoices</h1>
          <InvoicesTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
