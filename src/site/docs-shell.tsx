"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, IconButton } from "@/components/ui";
import { ThemeSwitcher } from "@/components/app-shell";
import type { NavGroup } from "./content";

/* Docs layout: Skip Link + App Header + grouped Sidebar (same groups and order as the Figma file). */
export function DocsShell({ nav, version, repo, figma, children }: { nav: NavGroup[]; version: string; repo: string; figma: string; children: ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const groups = nav
    .map((g) => ({ ...g, items: g.items.filter((i) => !query || i.title.toLowerCase().includes(query) || g.title.toLowerCase().includes(query)) }))
    .filter((g) => g.items.length);
  const norm = (p: string) => (p.endsWith("/") ? p : p + "/");
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    listRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest" });
  }, [path]);

  return (
    <div className="min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[var(--ds-z-tooltip)] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:focus-ring">
        Skip to content
      </a>
      <header role="banner" className="sticky top-0 z-[var(--ds-z-sticky)] flex h-[var(--ds-layout-header-height)] items-center gap-3 border-b border-line-default bg-surface px-4">
        <IconButton icon="menu" label="Open navigation" className="lg:hidden" aria-expanded={open} aria-controls="docs-nav" onClick={() => setOpen(true)} />
        <Link href="/" className="flex items-center gap-2 rounded-md text-label-large focus-visible:focus-ring">
          <span aria-hidden className="size-6 rounded-md bg-brand" />
          <span>DX Design System</span>
        </Link>
        <span className="hidden rounded-full bg-surface-subtle px-2 py-0.5 text-label-small text-fg-secondary sm:inline">v{version}</span>
        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitcher />
          <a href={figma} className="hidden h-control-sm items-center gap-1 rounded-control px-2 text-label-small text-fg-secondary hover:bg-neutral-hover hover:text-fg-primary focus-visible:focus-ring sm:flex">
            Figma <Icon name="external-link" size={16} />
          </a>
          <a href={repo} className="hidden h-control-sm items-center gap-1 rounded-control px-2 text-label-small text-fg-secondary hover:bg-neutral-hover hover:text-fg-primary focus-visible:focus-ring sm:flex">
            GitHub <Icon name="external-link" size={16} />
          </a>
        </div>
      </header>
      <div className="flex">
        {open && <div className="fixed inset-0 z-[var(--ds-z-overlay)] bg-overlay lg:hidden" onClick={() => setOpen(false)} aria-hidden />}
        <nav
          id="docs-nav"
          aria-label="Design system"
          className={cn(
            "fixed inset-y-0 left-0 z-[var(--ds-z-modal)] flex w-[288px] -translate-x-full flex-col border-r border-line-default bg-surface transition-transform duration-250 ease-enter",
            "lg:sticky lg:top-[var(--ds-layout-header-height)] lg:z-auto lg:h-[calc(100dvh-var(--ds-layout-header-height))] lg:w-[272px] lg:translate-x-0",
            open ? "translate-x-0" : "max-lg:invisible",
          )}
        >
          <div className="flex items-center gap-2 p-3 pb-2">
            <label className="flex h-control-sm min-w-0 flex-1 items-center gap-2 rounded-control border border-line-strong bg-surface px-2 focus-within:focus-ring">
              <Icon name="search" size={16} className="text-icon-secondary" />
              <span className="sr-only">Filter pages</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter pages" className="min-w-0 flex-1 bg-transparent text-body-small outline-none placeholder:text-fg-placeholder" />
            </label>
            <IconButton icon="close" label="Close navigation" className="lg:hidden" onClick={() => setOpen(false)} />
          </div>
          <div ref={listRef} className="flex-1 overflow-y-auto px-3 pb-6">
            {groups.map((g) => (
              <div key={g.slug} className="mt-4 first:mt-1">
                <h2 className="px-3 pb-1 text-caption-default font-semibold tracking-wide text-fg-secondary uppercase">{g.title}</h2>
                <ul className="flex flex-col">
                  {g.items.map((i) => {
                    const current = norm(path) === i.href;
                    return (
                      <li key={i.href}>
                        <Link
                          href={i.href}
                          aria-current={current ? "page" : undefined}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex h-8 items-center rounded-md px-3 text-label-medium focus-visible:focus-ring",
                            current ? "bg-selected text-fg-brand" : "text-fg-secondary hover:bg-neutral-hover hover:text-fg-primary",
                          )}
                        >
                          <span className="truncate">{i.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            {!groups.length && <p className="px-3 py-4 text-body-small text-fg-secondary">No pages match “{q}”.</p>}
          </div>
          <div className="border-t border-line-default p-3">
            <Link href="/starter/" className="flex h-8 items-center gap-2 rounded-md px-3 text-label-medium text-fg-secondary hover:bg-neutral-hover hover:text-fg-primary focus-visible:focus-ring">
              <Icon name="dashboard" size={16} /> Open the starter app
            </Link>
          </div>
        </nav>
        <main id="main" tabIndex={-1} className="min-w-0 flex-1 px-[var(--ds-layout-margin)] py-[var(--ds-layout-section-gap)] outline-none">
          <div className="mx-auto flex max-w-[960px] flex-col gap-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
