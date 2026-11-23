/**
 * @title A sidebar with submenus
 * @description Each section shows its pages underneath, indented on a guide line. Good for docs with two levels.
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
