/**
 * @title Account settings with section navigation
 * @description Profile, preferences and notifications as form sections, with an in-page section list that stays in view and a sticky save bar once something changes.
 * @route /settings
 * @height 960
 */
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "../_parts/dashboard-sidebar";
import { SiteHeader } from "../_parts/site-header";
import { AccountSettings } from "./components/account-settings";

export default function Page() {
  return (
    <SidebarProvider>
      <DashboardSidebar current="Settings" variant="sidebar" />
      <SidebarInset>
        <SiteHeader crumbs={[{ label: "Settings", href: "#" }, { label: "Account" }]} />
        <AccountSettings />
      </SidebarInset>
    </SidebarProvider>
  );
}
