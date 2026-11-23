"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, IconButton } from "@/components/ui";
import type { NavGroup } from "./content";
import { Customize, DarkModeToggle } from "./customize";
import { DocsSearch, useCodeCopy, type SearchEntry } from "./search";

/* Docs layout (shadcn sidebar pattern, DX tokens): sticky header with section links, search and Customize;
   grouped, collapsible sidebar; content; "On this page" rail. The sidebar becomes a sheet below 1024px. */

const sections = [
  { label: "Docs", href: "/docs/" },
  { label: "Components", href: "/components/" },
  { label: "Blocks", href: "/blocks/" },
  { label: "Tokens", href: "/tokens/" },
  { label: "Themes", href: "/themes/" },
  { label: "Icons", href: "/icons/" },
];

const norm = (p: string) => (p.endsWith("/") ? p : p + "/");

function OnThisPage({ path }: { path: string }) {
  const [items, setItems] = useState<{ id: string; text: string; level: number }[]>([]);
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    const hs = [...main.querySelectorAll<HTMLElement>("h2[id], h3[id][data-toc]")].filter((h) => h.offsetParent !== null && !h.closest("[role=tabpanel][hidden]"));
    setItems(hs.map((h) => ({ id: h.id, text: h.dataset.toc || h.textContent || "", level: h.tagName === "H3" ? 3 : 2 })));
    const io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setActive(vis.target.id);
    }, { rootMargin: "-80px 0px -70% 0px" });
    hs.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [path]);
  if (items.length < 2) return null;
  return (
    <nav aria-label="On this page" className="flex flex-col gap-2">
      <p className="text-label-small text-fg-primary">On this page</p>
      <ul className="flex flex-col gap-1 border-s border-line-default">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "location" : undefined}
              className={cn("-ms-px block border-s py-0.5 text-body-small hover:text-fg-primary focus-visible:focus-ring", i.level === 3 ? "ps-6" : "ps-3", active === i.id ? "border-brand text-fg-brand" : "border-transparent text-fg-secondary")}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function DocsShell({ nav, searchIndex, version, repo, figma, syncedAt, parity, children }: { nav: NavGroup[]; searchIndex: SearchEntry[]; version: string; repo: string; figma: string; syncedAt: string; parity: string; children: ReactNode }) {
  const path = usePathname();
  const wide = norm(path).startsWith("/blocks/") || norm(path) === "/themes/builder/"; // previews need the room
  useCodeCopy(path);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [closed, setClosed] = useState<Set<string>>(new Set());
  const query = q.trim().toLowerCase();
  const groups = nav
    .map((g) => ({ ...g, items: g.items.filter((i) => !query || i.title.toLowerCase().includes(query) || g.title.toLowerCase().includes(query)) }))
    .filter((g) => g.items.length);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    listRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest" });
  }, [path]);
  useEffect(() => setOpen(false), [path]);
  const section = sections.find((s) => norm(path).startsWith(s.href))?.href;
  const ghostLink = "inline-flex h-control-sm items-center gap-1 rounded-control px-2 text-label-small text-fg-secondary hover:bg-neutral-hover hover:text-fg-primary focus-visible:focus-ring";

  return (
    <div className="min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[var(--ds-z-tooltip)] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:focus-ring">
        Skip to content
      </a>
      <header role="banner" className="sticky top-0 z-[var(--ds-z-sticky)] flex h-[var(--ds-layout-header-height)] items-center gap-2 border-b border-line-default bg-surface/95 px-4 backdrop-blur">
        <IconButton icon="menu" label="Open navigation" variant="ghost" size="sm" className="lg:hidden" aria-expanded={open} aria-controls="docs-nav" onClick={() => setOpen(true)} />
        <Link href="/" className="flex items-center gap-2 rounded-md text-label-large focus-visible:focus-ring">
          <span aria-hidden className="size-6 rounded-md bg-brand" />
          <span className="whitespace-nowrap max-sm:sr-only">DX Design System</span>
        </Link>
        <span className="hidden rounded-full bg-surface-subtle px-2 py-0.5 text-label-small text-fg-secondary sm:inline">v{version}</span>
        <nav aria-label="Sections" className="ms-4 hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <Link key={s.href} href={s.href} aria-current={section === s.href ? "page" : undefined}
              className={cn("rounded-control px-2 py-1 text-label-medium focus-visible:focus-ring", section === s.href ? "text-fg-primary" : "text-fg-secondary hover:text-fg-primary")}>
              {s.label}
            </Link>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-1">
          <DocsSearch index={searchIndex} />
          <Customize />
          <DarkModeToggle />
          <a href={repo} aria-label="GitHub repository" className={cn(ghostLink, "max-sm:hidden")}>GitHub <Icon name="external-link" size={16} /></a>
          <a href={figma} aria-label="Figma library" className={cn(ghostLink, "max-md:hidden")}>Figma <Icon name="external-link" size={16} /></a>
        </div>
      </header>
      <div className={cn("mx-auto flex", !wide && "max-w-[1440px]")}>
        {open && <div className="fixed inset-0 z-[var(--ds-z-overlay)] bg-overlay lg:hidden" onClick={() => setOpen(false)} aria-hidden />}
        <nav
          id="docs-nav"
          aria-label="Documentation"
          className={cn(
            "fixed inset-y-0 left-0 z-[var(--ds-z-modal)] flex w-[288px] -translate-x-full flex-col border-r border-line-default bg-surface transition-transform duration-moderate ease-enter",
            "lg:sticky lg:top-[var(--ds-layout-header-height)] lg:z-auto lg:h-[calc(100dvh-var(--ds-layout-header-height))] lg:w-[256px] lg:translate-x-0 lg:border-r-0 lg:bg-transparent",
            open ? "translate-x-0" : "max-lg:invisible",
          )}
        >
          <div className="flex items-center gap-2 p-3 pb-2">
            <label className="flex h-control-sm min-w-0 flex-1 items-center gap-2 rounded-control border border-line-strong bg-surface px-2 focus-within:focus-ring">
              <Icon name="search" size={16} className="text-icon-secondary" />
              <span className="sr-only">Filter pages</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter pages" className="min-w-0 flex-1 bg-transparent text-body-small outline-none placeholder:text-fg-placeholder" />
            </label>
            <IconButton icon="close" label="Close navigation" variant="ghost" size="sm" className="lg:hidden" onClick={() => setOpen(false)} />
          </div>
          <div ref={listRef} className="flex-1 overflow-y-auto px-3 pb-6">
            {groups.map((g) => {
              const isOpen = query !== "" || !closed.has(g.slug);
              return (
                <div key={g.slug} className="mt-3 first:mt-1">
                  <h2>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`nav-${g.slug}`}
                      onClick={() => setClosed((c) => { const n = new Set(c); if (n.has(g.slug)) n.delete(g.slug); else n.add(g.slug); return n; })}
                      className="flex h-8 w-full items-center justify-between rounded-md px-3 text-label-small font-semibold text-fg-primary hover:bg-neutral-hover focus-visible:focus-ring"
                    >
                      {g.title}
                      <Icon name="chevron-down" size={16} className={cn("text-icon-secondary transition-transform duration-fast", !isOpen && "-rotate-90")} />
                    </button>
                  </h2>
                  <ul id={`nav-${g.slug}`} hidden={!isOpen} className="flex flex-col">
                    {g.items.map((i) => {
                      const current = norm(path) === i.href;
                      return (
                        <li key={i.href}>
                          <Link
                            href={i.href}
                            aria-current={current ? "page" : undefined}
                            className={cn(
                              "flex h-8 items-center gap-2 rounded-md px-3 text-label-medium focus-visible:focus-ring",
                              current ? "bg-selected text-fg-brand" : "text-fg-secondary hover:bg-neutral-hover hover:text-fg-primary",
                            )}
                          >
                            <span className="truncate">{i.title}</span>
                            {i.status === "planned" && <span className="ms-auto rounded-full bg-surface-subtle px-1.5 text-caption-default text-fg-secondary">Spec</span>}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
            {!groups.length && <p className="px-3 py-4 text-body-small text-fg-secondary">No pages match “{q}”.</p>}
          </div>
          <div className="border-t border-line-default p-3">
            <Link href="/starter/" className="flex h-8 items-center gap-2 rounded-md px-3 text-label-medium text-fg-secondary hover:bg-neutral-hover hover:text-fg-primary focus-visible:focus-ring">
              <Icon name="dashboard" size={16} /> Open the starter app
            </Link>
          </div>
        </nav>
        <main id="main" tabIndex={-1} className="min-w-0 flex-1 px-[var(--ds-layout-margin)] py-[var(--ds-layout-section-gap)] outline-none">
          <div className={cn("mx-auto flex flex-col gap-10", wide ? "max-w-[1280px]" : "max-w-[860px]")}>
            {children}
            <footer className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line-default pt-4 text-caption-default text-fg-secondary">
              <span>v{version}</span><span aria-hidden>·</span>
              <span>Synced from Figma {new Date(syncedAt + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span><span aria-hidden>·</span>
              <span>Figma ↔ code parity {parity}</span><span aria-hidden>·</span>
              <a href={repo} className="rounded-sm underline underline-offset-2 hover:text-fg-primary focus-visible:focus-ring">Source on GitHub</a>
            </footer>
          </div>
        </main>
        <aside className={cn("sticky top-[var(--ds-layout-header-height)] hidden h-[calc(100dvh-var(--ds-layout-header-height))] w-[224px] shrink-0 overflow-y-auto py-[var(--ds-layout-section-gap)] pe-6", !wide && "xl:block")}>
          <OnThisPage path={path} />
        </aside>
      </div>
    </div>
  );
}
