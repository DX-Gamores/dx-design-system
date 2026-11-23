/**
 * @title An inset sidebar with secondary navigation
 * @description The page sits in a raised card beside the sidebar. Main sections, projects, support links and the account menu.
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
        <SiteHeader crumbs={[{ label: "Projects", href: "#" }, { label: "Design engineering" }]} />
        <PagePlaceholder title="Design engineering" />
      </SidebarInset>
    </SidebarProvider>
  );
}
