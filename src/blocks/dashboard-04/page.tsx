/**
 * @title Project overview
 * @description One project at a glance: owner and team, overall progress, milestones as a stepper, workload per person, and recent activity.
 * @route /projects/[id]
 * @height 960
 */
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/feedback";
import { DashboardSidebar } from "../_parts/dashboard-sidebar";
import { SiteHeader } from "../_parts/site-header";
import { ProjectSummary } from "./components/project-summary";
import { Milestones } from "./components/milestones";
import { Activity } from "./components/activity";

export default function Page() {
  return (
    <SidebarProvider>
      <DashboardSidebar current="Projects" />
      <SidebarInset>
        <SiteHeader crumbs={[{ label: "Projects", href: "#" }, { label: "Website redesign" }]} actions={<><Button size="sm" variant="secondary" leadingIcon="share">Share</Button><Button size="sm" leadingIcon="plus">New task</Button></>} />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2"><h1 className="text-heading-h2">Website redesign</h1><Badge tone="success">On track</Badge></div>
            <p className="max-w-[72ch] text-body-medium text-fg-secondary">New marketing site on the DX design system: content model, page templates and a launch in March.</p>
          </div>
          <ProjectSummary />
          <div className="grid gap-4 lg:grid-cols-5">
            <Milestones />
            <Activity />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
