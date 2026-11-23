/**
 * @title Field operations dashboard
 * @description For agriculture and field teams: today's weather, alerts that need action, task progress by crew, and a table of fields with crop, stage and moisture.
 * @route /operations
 * @height 960
 */
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/feedback";
import { DashboardSidebar } from "../_parts/dashboard-sidebar";
import { SiteHeader } from "../_parts/site-header";
import { Weather } from "./components/weather";
import { CrewProgress } from "./components/crew-progress";
import { FieldsTable } from "./components/fields-table";

export default function Page() {
  return (
    <SidebarProvider>
      <DashboardSidebar current="Projects" variant="sidebar" />
      <SidebarInset>
        <SiteHeader crumbs={[{ label: "Operations", href: "#" }, { label: "North farm" }]} actions={<Button size="sm" leadingIcon="plus">Log activity</Button>} />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-heading-h2">North farm</h1>
            <p className="text-body-medium text-fg-secondary">12 fields · 486 ha · Season 2026 B</p>
          </div>
          <section aria-label="Alerts" className="grid gap-3 lg:grid-cols-2">
            <Alert tone="warning" title="Irrigation needed in 3 fields">Soil moisture in F-04, F-07 and F-11 is below 25%.</Alert>
            <Alert tone="info" title="Rain expected Thursday">Hold spraying in the east block until Friday.</Alert>
          </section>
          <div className="grid gap-4 lg:grid-cols-3">
            <Weather />
            <CrewProgress />
          </div>
          <FieldsTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
