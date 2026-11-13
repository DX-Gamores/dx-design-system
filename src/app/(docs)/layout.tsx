import { DocsShell } from "@/site/docs-shell";
import { FIGMA_FILE, REPO, VERSION, flatNav, meta, nav, specs } from "@/site/content";
import type { SearchEntry } from "@/site/search";
import parity from "@/site/parity.json";

/** Search index: every page in the sidebar plus every component spec (linked to its section on the page). */
function searchIndex(): SearchEntry[] {
  const pages: SearchEntry[] = flatNav.map((i) => ({ title: i.title, href: i.href, group: i.group, kind: "Page" }));
  const comps: SearchEntry[] = specs.flatMap((s) => {
    const page = flatNav.find((i) => i.figmaName === s.page);
    return page ? [{ title: s.n, href: `${page.href}#${s.slug}`, group: page.title, kind: "Component" as const, text: s.d.slice(0, 240) }] : [];
  });
  return [...pages, ...comps];
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsShell nav={nav} searchIndex={searchIndex()} version={VERSION} repo={REPO} figma={FIGMA_FILE} syncedAt={meta.syncedAt} parity={`${parity.coded}/${parity.specs}`}>
      {children}
    </DocsShell>
  );
}
