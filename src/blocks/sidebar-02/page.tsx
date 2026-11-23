/**
 * @title A sidebar with collapsible sections
 * @description Section labels open and close their links, so long navigation stays short. The section with the current page starts open.
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
