/**
 * @title A sidebar with submenus as dropdowns
 * @description Sections open a menu of their pages beside the sidebar instead of expanding in place. An upgrade card sits at the bottom.
 * @route /docs
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
