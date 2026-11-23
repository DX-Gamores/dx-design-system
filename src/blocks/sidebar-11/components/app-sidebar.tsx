"use client";
import { ChevronRight, File, Folder } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuBadge, SidebarMenuButton,
  SidebarMenuItem, SidebarMenuSub, SidebarRail, useDisclosure,
} from "@/components/ui/sidebar";

type Node = string | [string, ...Node[]];
const changes = [{ file: "README.md", state: "M" }, { file: "api/hello/route.ts", state: "U" }, { file: "app/layout.tsx", state: "M" }];
const tree: Node[] = [
  ["app", ["api", ["hello", "route.ts"]], "page.tsx", "layout.tsx", ["blog", "page.tsx"]],
  ["components", ["ui", "button.tsx", "card.tsx"], "header.tsx", "footer.tsx"],
  ["lib", ["util.ts"]],
  ["public", "favicon.ico", "vercel.svg"],
  ".eslintrc.json", ".gitignore", "next.config.js", "tailwind.config.js", "package.json", "README.md",
];
const stateLabel = { M: "modified", U: "untracked" } as const;

function TreeNode({ node }: { node: Node }) {
  const isFolder = Array.isArray(node);
  const [name, ...children] = isFolder ? node : [node];
  const d = useDisclosure(name === "components" || name === "ui");
  if (!isFolder) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton href="#" size="sm" isActive={name === "button.tsx"}>
          <Icon name={File} size={16} /><span>{name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }
  return (
    <SidebarMenuItem>
      <SidebarMenuButton size="sm" {...d.triggerProps}>
        <Icon name={ChevronRight} size={16} className={d.open ? "rotate-90 transition-transform" : "transition-transform"} />
        <Icon name={Folder} size={16} />
        <span>{name}</span>
      </SidebarMenuButton>
      <SidebarMenuSub {...d.contentProps} className="me-0 pe-0">
        {children.map((c, i) => <TreeNode key={i} node={c as Node} />)}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  return (
    <Sidebar label="Files">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel as="h2">Changes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {changes.map((c) => (
                <SidebarMenuItem key={c.file}>
                  <SidebarMenuButton href="#" size="sm"><Icon name={File} size={16} /><span>{c.file}</span></SidebarMenuButton>
                  <SidebarMenuBadge label={stateLabel[c.state as keyof typeof stateLabel]} className="top-1.5">{c.state}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel as="h2">Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <nav aria-label="Files">
              <SidebarMenu>{tree.map((n, i) => <TreeNode key={i} node={n} />)}</SidebarMenu>
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
