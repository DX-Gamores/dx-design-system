/**
 * @title A sidebar with a collapsible file tree
 * @description Changed files on top, the project's folders below. Folders open and close; files are links.
 * @route /editor
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
        <SiteHeader crumbs={[{ label: "components", href: "#" }, { label: "ui", href: "#" }, { label: "button.tsx" }]} />
        <PagePlaceholder title="button.tsx" />
      </SidebarInset>
    </SidebarProvider>
  );
}
