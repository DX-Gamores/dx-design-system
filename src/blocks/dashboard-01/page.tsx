/**
 * @title Dashboard with key numbers, a chart and a table
 * @description An inset sidebar app: four key numbers with trends, visitors over time with a range switch, and a sortable table of documents.
 * @route /dashboard
 * @height 900
 */
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/display";
import { DashboardSidebar } from "../_parts/dashboard-sidebar";
import { SiteHeader } from "../_parts/site-header";
import { VisitorsChart } from "./components/visitors-chart";
import { DocumentsTable } from "./components/documents-table";

export default function Page() {
  return (
    <SidebarProvider>
      <DashboardSidebar current="Dashboard" />
      <SidebarInset>
        <SiteHeader crumbs={[{ label: "Dashboard" }]} actions={<Button size="sm" leadingIcon="plus">Quick create</Button>} />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <h1 className="text-heading-h2">Dashboard</h1>
          <section aria-label="Key numbers" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total revenue" value="$1,250.00" trend={{ direction: "positive", value: "+12.5%" }} context="Trending up this month" />
            <StatCard label="New customers" value="1,234" trend={{ direction: "negative", value: "−20%" }} context="Down this period" />
            <StatCard label="Active accounts" value="45,678" trend={{ direction: "positive", value: "+12.5%" }} context="Strong retention" />
            <StatCard label="Growth rate" value="4.5%" trend={{ direction: "positive", value: "+4.5%" }} context="Meets projections" />
          </section>
          <VisitorsChart />
          <DocumentsTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
