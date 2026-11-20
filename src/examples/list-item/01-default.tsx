/**
 * @title List Item
 * @description A row in a list: leading avatar or icon, title, description, meta and an action.
 */
"use client";
import { Avatar } from "@/components/ui/display";
import { Badge } from "@/components/ui/feedback";
import { List, ListItem } from "@/components/ui/data";
import { Menu } from "@/components/ui/overlays";

const members = [
  { name: "Jane Cooper", email: "jane@acme.com", status: "Active" },
  { name: "Esther Howard", email: "esther@acme.com", status: "Active" },
  { name: "Cameron Williamson", email: "cameron@acme.com", status: "Invited" },
];

export default function Example() {
  return (
    <List label="Team members" className="rounded-container border border-line-default bg-surface">
      {members.map((m) => (
        <ListItem
          key={m.email}
          title={m.name}
          description={m.email}
          leading={<Avatar name={m.name} decorative />}
          meta={<Badge tone={m.status === "Active" ? "success" : "warning"}>{m.status}</Badge>}
          action={<Menu label={`More actions for ${m.name}`} items={[{ label: "Edit role", icon: "edit" }, { label: "Remove", icon: "trash", tone: "danger", separatorBefore: true }]} />}
        />
      ))}
    </List>
  );
}
