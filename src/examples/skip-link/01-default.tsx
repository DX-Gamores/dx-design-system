/**
 * @title Skip Link
 * @preview /templates/app-shell/
 * @description The first focusable element on every page: press Tab on the frame to see it. It jumps to the main content.
 */
"use client";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

// app/(app)/layout.tsx — wraps every signed-in page. The sidebar marks the current page with aria-current.
export default function Example() {
  return (
    <AppShell
      productName="Acme"
      userName="Jane Cooper"
      nav={[
        { label: "Dashboard", href: "/", icon: "dashboard", exact: true },
        { label: "Projects", href: "/projects", icon: "folder" },
        { label: "Members", href: "/members", icon: "user" },
        { label: "Inbox", href: "/inbox", icon: "mail", count: 3 },
        { label: "Settings", href: "/settings", icon: "settings" },
      ]}
    >
      <PageHeader title="Members" description="Manage who can access the Acme workspace." actions={<Button leadingIcon="plus">Invite member</Button>} />
    </AppShell>
  );
}
