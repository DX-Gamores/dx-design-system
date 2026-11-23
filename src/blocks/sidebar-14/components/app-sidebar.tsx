"use client";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub,
  SidebarMenuSubButton, SidebarMenuSubItem,
} from "@/components/ui/sidebar";

const toc = [
  { title: "Fetching data on the server", items: ["With the fetch API", "With an ORM or database"] },
  { title: "Fetching data on the client", items: ["With a data library", "With route handlers"] },
  { title: "Caching", items: ["Revalidating", "Opting out"] },
  { title: "Patterns", items: ["Parallel and sequential", "Preloading data"] },
];

export function AppSidebar() {
  return (
    <Sidebar side="right" label="On this page">
      <SidebarContent>
        <SidebarGroup>
          <nav aria-labelledby="toc-title">
            <SidebarGroupLabel as="h2" id="toc-title">On this page</SidebarGroupLabel>
            <SidebarMenu>
              {toc.map((t, i) => (
                <SidebarMenuItem key={t.title}>
                  <SidebarMenuButton href={`#s${i}`} size="sm" isActive={i === 0}><span>{t.title}</span></SidebarMenuButton>
                  <SidebarMenuSub>
                    {t.items.map((s) => (
                      <SidebarMenuSubItem key={s}><SidebarMenuSubButton href={`#s${i}`}><span>{s}</span></SidebarMenuSubButton></SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </nav>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
