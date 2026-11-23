/**
 * @title A left and a right sidebar
 * @description Workspace navigation on the left, a calendar panel on the right (from 1024px). The left one collapses; the right one stays.
 * @route /notes
 */
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarLeft } from "./components/sidebar-left";
import { SidebarRight } from "./components/sidebar-right";
import { SiteHeader } from "../_parts/site-header";
import { PagePlaceholder } from "../_parts/page-placeholder";

export default function Page() {
  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <SiteHeader crumbs={[{ label: "Personal life", href: "#" }, { label: "Weekly plan" }]} />
        <PagePlaceholder title="Weekly plan" />
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  );
}
