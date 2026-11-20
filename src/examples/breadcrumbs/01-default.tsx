/**
 * @title Breadcrumbs
 * @description Where this page sits in the hierarchy. The last item is the current page, not a link.
 */
"use client";
import { Breadcrumbs } from "@/components/ui/nav-extra";

export default function Example() {
  return <Breadcrumbs items={[{ label: "Settings", href: "#" }, { label: "Workspace", href: "#" }, { label: "Team members" }]} />;
}
