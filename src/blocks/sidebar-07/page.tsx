/**
 * @title A sidebar that collapses to icons
 * @description Workspace switcher, collapsible sections, projects and an account menu. Collapses to a 72px icon rail (Ctrl/⌘ + B); a drawer on phones.
 * @route /dashboard
 */
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { SiteHeader } from "../_parts/site-header";
import { PagePlaceholder } from "../_parts/page-placeholder";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader crumbs={[{ label: "Building your application", href: "#" }, { label: "Data fetching" }]} />
        <PagePlaceholder title="Data fetching" />
      </SidebarInset>
    </SidebarProvider>
  );
}
