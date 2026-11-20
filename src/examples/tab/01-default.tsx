/**
 * @title Tab
 * @description One tab in Tabs: label, optional count, and the selected indicator.
 */
"use client";
import { useState } from "react";
import { Tabs } from "@/components/ui/navigation";

export default function Example() {
  const [tab, setTab] = useState("members");
  return (
    <Tabs
      label="Member views"
      value={tab}
      onChange={setTab}
      tabs={[
        { id: "members", label: "Members", count: 12, panel: <p className="text-fg-secondary">12 people have access to this workspace.</p> },
        { id: "invites", label: "Invites", count: 2, panel: <p className="text-fg-secondary">2 invitations are waiting for a reply.</p> },
        { id: "roles", label: "Roles", panel: <p className="text-fg-secondary">Owner, Admin, Member and Viewer.</p> },
      ]}
    />
  );
}
