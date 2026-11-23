/**
 * @title Team and billing settings
 * @description Tabs for General, Members and Billing: workspace details, a members table with roles and invites, the current plan with usage, and invoices.
 * @route /settings/team
 * @height 900
 */
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "../_parts/dashboard-sidebar";
import { SiteHeader } from "../_parts/site-header";
import { TeamSettings } from "./components/team-settings";

export default function Page() {
  return (
    <SidebarProvider>
      <DashboardSidebar current="Team" />
      <SidebarInset>
        <SiteHeader crumbs={[{ label: "Settings", href: "#" }, { label: "Team" }]} />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <h1 className="text-heading-h2">Team settings</h1>
          <TeamSettings />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
