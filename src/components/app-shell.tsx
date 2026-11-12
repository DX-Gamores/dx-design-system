"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./ui/icon";
import { IconButton } from "./ui/button";
import { Avatar } from "./ui/display";
import { brands, themes, densities, type Brand, type Theme, type Density } from "@dxform/tokens";

/* Figma: Skip Link + App Header + Sidebar (Expanded / Rail / Drawer) + Page Header. */
export type NavLink = { label: string; href: string; icon: IconName; count?: number; exact?: boolean };
export const starterNav: NavLink[] = [
  { label: "Dashboard", href: "/starter", icon: "dashboard", exact: true },
  { label: "Projects", href: "/starter/projects", icon: "folder" },
  { label: "Reports", href: "/starter/reports", icon: "chart" },
  { label: "Settings", href: "/starter/settings", icon: "settings" },
  { label: "Design system", href: "/", icon: "grid-view", exact: true },
];

export function AppShell({ productName = "DXFORM", nav = starterNav, userName = "Gab D", children }: { productName?: string; nav?: NavLink[]; userName?: string; children: ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[var(--ds-z-tooltip)] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:focus-ring">
        Skip to content
      </a>
      <header role="banner" className="sticky top-0 z-[var(--ds-z-sticky)] flex h-[var(--ds-layout-header-height)] items-center gap-3 border-b border-line-default bg-surface px-4">
        <IconButton icon="menu" label="Open navigation" className="md:hidden" aria-expanded={open} aria-controls="sidebar" onClick={() => setOpen(true)} />
        <span className="flex items-center gap-2 text-label-large">
          <span aria-hidden className="size-6 rounded-md bg-brand" />
          {productName}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitcher />
          <IconButton icon="bell" label="Notifications" />
          <Avatar name={userName} size="md" />
        </div>
      </header>
      <div className="flex">
        {open && <div className="fixed inset-0 z-[var(--ds-z-overlay)] bg-overlay md:hidden" onClick={() => setOpen(false)} aria-hidden />}
        <nav
          id="sidebar"
          aria-label="Main"
          className={cn(
            "fixed inset-y-0 left-0 z-[var(--ds-z-modal)] w-[288px] -translate-x-full border-r border-line-default bg-surface p-3 transition-transform duration-250 ease-enter",
            // Tablet (768–1023): a 72px icon rail (layout/sidebar-width switches to 72); desktop: the full sidebar; mobile: a drawer.
            "md:sticky md:top-[var(--ds-layout-header-height)] md:z-auto md:h-[calc(100dvh-var(--ds-layout-header-height))] md:w-[var(--ds-layout-sidebar-width)] md:translate-x-0",
            open ? "translate-x-0" : "max-md:invisible",
          )}
        >
          <div className="mb-2 flex justify-end md:hidden">
            <IconButton icon="close" label="Close navigation" onClick={() => setOpen(false)} />
          </div>
          <ul className="flex flex-col gap-1">
            {nav.map((n) => {
              const p = path.replace(/\/$/, "") || "/";
              const h = n.href.replace(/\/$/, "") || "/";
              const current = n.exact ? p === h : p === h || p.startsWith(h + "/");
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "relative flex h-10 items-center gap-3 rounded-md px-3 text-label-medium focus-visible:focus-ring md:max-lg:justify-center md:max-lg:px-0",
                      current ? "bg-selected text-fg-brand" : "text-fg-secondary hover:bg-neutral-hover hover:text-fg-primary",
                    )}
                  >
                    <Icon name={n.icon} />
                    <span className="flex-1 truncate md:max-lg:sr-only">{n.label}</span>
                    {n.count !== undefined && <span className="rounded-full bg-brand px-1.5 text-label-small text-fg-on-brand md:max-lg:sr-only">{n.count}<span className="sr-only"> unread</span></span>}
                    {n.count !== undefined && <span aria-hidden className="absolute top-2 right-3 hidden size-2 rounded-full bg-brand md:max-lg:block" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <main id="main" tabIndex={-1} className="min-w-0 flex-1 px-[var(--ds-layout-margin)] py-[var(--ds-layout-section-gap)]">
          <div className="mx-auto flex max-w-[var(--ds-layout-content-max)] flex-col gap-[var(--ds-layout-section-gap)]">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, actions, headingLevel = 1 }: { title: string; description?: string; actions?: ReactNode; headingLevel?: 1 | 2 }) {
  const H = `h${headingLevel}` as "h1";
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-1">
        <H className="text-heading-h2">{title}</H>
        {description && <p className="text-body-medium text-fg-secondary">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/** Switches the same tokens Figma switches with variable modes. Persists per browser. */
export function ThemeSwitcher() {
  const [brand, setBrand] = useState<Brand>("default");
  const [theme, setTheme] = useState<Theme>("light");
  const [density, setDensity] = useState<Density>("comfortable");
  useEffect(() => {
    const load = () => {
      try {
        const s = JSON.parse(localStorage.getItem("ds-theme") || "{}");
        if (s.brand) setBrand(s.brand);
        if (s.theme) setTheme(s.theme);
        if (s.density) setDensity(s.density);
      } catch {}
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.brand = brand;
    el.dataset.theme = theme;
    el.dataset.density = density;
    try {
      localStorage.setItem("ds-theme", JSON.stringify({ brand, theme, density }));
    } catch {}
  }, [brand, theme, density]);
  const sel = "h-control-sm rounded-control border border-line-strong bg-surface px-2 text-label-small focus-visible:focus-ring";
  return (
    <div className="hidden items-center gap-2 md:flex">
      <select aria-label="Brand" className={sel} value={brand} onChange={(e) => setBrand(e.target.value as Brand)}>
        {brands.map((b) => <option key={b} value={b}>{b}</option>)}
      </select>
      <select aria-label="Theme" className={sel} value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
        {themes.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <select aria-label="Density" className={sel} value={density} onChange={(e) => setDensity(e.target.value as Density)}>
        {densities.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
    </div>
  );
}

/** Applies the stored brand / theme / density on pages without a ThemeSwitcher (auth screens, previews)
 *  and follows changes made in other tabs or the parent docs page. */
export function ThemeSync() {
  useEffect(() => {
    const apply = () => {
      try {
        const s = JSON.parse(localStorage.getItem("ds-theme") || "{}");
        const el = document.documentElement;
        if (s.brand) el.dataset.brand = s.brand;
        if (s.theme) el.dataset.theme = s.theme;
        if (s.density) el.dataset.density = s.density;
      } catch {}
    };
    apply();
    window.addEventListener("storage", apply);
    return () => window.removeEventListener("storage", apply);
  }, []);
  return null;
}
