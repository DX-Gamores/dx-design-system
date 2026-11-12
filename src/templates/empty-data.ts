import type { IconName } from "@/components/ui/icon";

/* The nine full-screen empty scenarios from Figma (Starter & Empty States), as plain data
   so both the screens and the docs can use them. */
type Page = { title: string; description: string; primary?: string };
const projects: Page = { title: "Projects", description: "Everything your team is working on.", primary: "New project" };
const reports: Page = { title: "Reports", description: "Trends across projects and members." };

export type Scenario = {
  slug: string; name: string; when: string; page: Page; toolbar?: "search" | "filters";
  icon: IconName; title: string; description: string; actions: { label: string; variant?: "primary" | "secondary" | "link" }[];
};
export const scenarios: Scenario[] = [
  { slug: "first-use", name: "First use", when: "Nothing has been created yet", page: projects, icon: "folder", title: "No projects yet", description: "Create a project to start organizing your team’s work.", actions: [{ label: "Create project" }, { label: "Import from CSV", variant: "secondary" }] },
  { slug: "no-search-results", name: "No search results", when: "A search matched nothing", page: projects, toolbar: "search", icon: "search", title: "No results for “wade”", description: "Check the spelling or try a different word.", actions: [{ label: "Clear search", variant: "secondary" }] },
  { slug: "no-filter-results", name: "No filter results", when: "Filters exclude everything", page: projects, toolbar: "filters", icon: "filter", title: "No projects match these filters", description: "Remove a filter or clear them all.", actions: [{ label: "Clear filters", variant: "secondary" }] },
  { slug: "all-caught-up", name: "All caught up", when: "Work is done — a good empty", page: { title: "Inbox", description: "Mentions, invites and approvals." }, icon: "check-circle", title: "You’re all caught up", description: "New notifications will show up here.", actions: [] },
  { slug: "couldnt-load", name: "Couldn’t load", when: "The request failed", page: projects, icon: "alert-triangle", title: "Couldn’t load projects", description: "Check your connection and try again.", actions: [{ label: "Try again", variant: "secondary" }] },
  { slug: "offline", name: "Offline", when: "No network", page: { ...projects, primary: undefined }, icon: "globe", title: "You’re offline", description: "We’ll reload this page as soon as you’re back online.", actions: [{ label: "Try again", variant: "secondary" }] },
  { slug: "no-permission", name: "No permission", when: "The person can’t see this", page: reports, icon: "lock", title: "You don’t have access to Reports", description: "Ask a workspace admin to give you access.", actions: [{ label: "Request access" }, { label: "Go to dashboard", variant: "secondary" }] },
  { slug: "not-set-up", name: "Not set up", when: "A feature needs connecting first", page: { title: "Calendar", description: "Plan around your team’s schedule." }, icon: "calendar", title: "Connect a calendar to see events", description: "Sync Google or Outlook — it takes about a minute.", actions: [{ label: "Connect calendar" }, { label: "Learn more", variant: "link" }] },
  { slug: "upgrade-required", name: "Upgrade required", when: "The plan doesn’t include it", page: reports, icon: "star", title: "Reports are on the Pro plan", description: "Upgrade to see trends, exports and scheduled reports.", actions: [{ label: "Upgrade plan" }, { label: "Compare plans", variant: "secondary" }] },
];
