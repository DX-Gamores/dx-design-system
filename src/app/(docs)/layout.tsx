import { DocsShell } from "@/site/docs-shell";
import { FIGMA_FILE, REPO, VERSION, componentPages, flatNav, meta, nav } from "@/site/content";
import type { SearchEntry } from "@/site/search";
import parity from "@/site/parity.json";

/** Search index: every page in the sidebar; components carry their description so “dropdown” finds Select and Menu. */
function searchIndex(): SearchEntry[] {
  return flatNav.map((i) => {
    const c = componentPages.find((p) => p.href === i.href);
    return c
      ? { title: i.title, href: i.href, group: c.category.title, kind: "Component" as const, text: c.spec.d.slice(0, 240) }
      : { title: i.title, href: i.href, group: i.group, kind: "Page" as const };
  });
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsShell nav={nav} searchIndex={searchIndex()} version={VERSION} repo={REPO} figma={FIGMA_FILE} syncedAt={meta.syncedAt} parity={`${parity.coded}/${parity.specs}`}>
      {children}
    </DocsShell>
  );
}
