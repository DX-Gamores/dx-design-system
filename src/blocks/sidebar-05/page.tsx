/**
 * @title A sidebar with collapsible submenus and search
 * @description Search on top; each section opens with a plus and closes with a minus. Only the section you're in starts open.
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
