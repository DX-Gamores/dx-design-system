"use client";
import { useState } from "react";
import { ArchiveX, File, Inbox, Send, Trash2, type LucideIcon } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Toggle } from "@/components/ui/form";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInput, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar } from "@/components/ui/display";
import { Menu } from "@/components/ui/overlays";

const folders: { title: string; icon: LucideIcon; count?: number }[] = [
  { title: "Inbox", icon: Inbox, count: 6 },
  { title: "Drafts", icon: File },
  { title: "Sent", icon: Send },
  { title: "Junk", icon: ArchiveX },
  { title: "Trash", icon: Trash2 },
];
const mails = [
  { name: "William Smith", subject: "Weekly sync notes", date: "09:34", unread: true, teaser: "Here are the notes from this week's sync. Highlights: launch date confirmed, two open risks." },
  { name: "Alice Smith", subject: "Re: Project update", date: "Yesterday", unread: true, teaser: "Thanks for the update. The progress looks great; let's review the open items on Friday." },
  { name: "Bob Johnson", subject: "Weekend plans", date: "2 days ago", teaser: "Anyone up for a hike on Saturday? The weather looks clear and the trail is open again." },
  { name: "Emily Davis", subject: "Re: Question about the budget", date: "2 days ago", unread: true, teaser: "I've reviewed the budget numbers you sent. A few line items need another look." },
  { name: "Michael Wilson", subject: "Important announcement", date: "1 week ago", teaser: "Please join us for an all-hands meeting this Friday at 3 pm in the main room." },
  { name: "Sarah Brown", subject: "Re: Feedback on proposal", date: "1 week ago", teaser: "Thank you for the feedback on the proposal. I've made the changes you suggested." },
];

export function AppSidebar() {
  const [folder, setFolder] = useState("Inbox");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const list = unreadOnly ? mails.filter((m) => m.unread) : mails;
  return (
    <Sidebar collapsible="icon" label="Mail">
      <div className="flex h-full min-h-0">
        {/* The rail: always visible, even when the sidebar is collapsed. */}
        <div className="flex w-(--sidebar-width-icon) shrink-0 flex-col border-e border-line-default group-data-[collapsible=icon]/sidebar:border-e-0">
          <nav aria-label="Folders" className="contents">
            <SidebarContent className="px-4 py-3">
              <SidebarMenu>
                {folders.map((f) => (
                  <SidebarMenuItem key={f.title}>
                    <SidebarMenuButton isActive={folder === f.title} tooltip={f.title} aria-pressed={folder === f.title} onClick={() => setFolder(f.title)}
                      className="size-10! p-2.5!">
                      <Icon name={f.icon} />
                      <span>{f.title}{f.count ? `, ${f.count} unread` : ""}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </nav>
          <SidebarFooter className="items-center px-4">
            <Menu
              label="Account menu for Jane Cooper"
              placement="right-end"
              items={[{ label: "Profile", icon: "user" }, { label: "Settings", icon: "settings" }, { label: "Sign out", icon: "sign-out", separatorBefore: true }]}
              trigger={({ ref, ...p }) => (
                <button ref={ref} type="button" {...p} aria-label="Account menu for Jane Cooper" className="rounded-full focus-visible:focus-ring">
                  <Avatar name="Jane Cooper" size="lg" decorative />
                </button>
              )}
            />
          </SidebarFooter>
        </div>
        {/* The list: hidden when collapsed. */}
        <section aria-label={`${folder} messages`} className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]/sidebar:hidden">
          <SidebarHeader className="gap-3 border-b border-line-default">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-label-large">{folder}</h2>
              <Toggle label="Unread only" checked={unreadOnly} onChange={setUnreadOnly} />
            </div>
            <label className="sr-only" htmlFor="mail-search">Search messages</label>
            <SidebarInput id="mail-search" type="search" placeholder="Search messages" />
          </SidebarHeader>
          <ul className="min-h-0 flex-1 overflow-y-auto">
            {list.map((m) => (
              <li key={m.subject} className="border-b border-line-default last:border-b-0">
                <a href="#" className="flex flex-col gap-1 p-4 hover:bg-neutral-hover focus-visible:focus-ring">
                  <span className="flex items-center gap-2">
                    {m.unread && <span className="size-2 rounded-full bg-brand" aria-hidden />}
                    <span className="flex-1 truncate text-label-medium">{m.name}{m.unread && <span className="sr-only"> (unread)</span>}</span>
                    <span className="shrink-0 text-caption-default text-fg-secondary">{m.date}</span>
                  </span>
                  <span className="truncate text-body-small">{m.subject}</span>
                  <span className="line-clamp-2 text-caption-default text-fg-secondary">{m.teaser}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Sidebar>
  );
}
