"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { AppShell, type NavLink } from "@/components/app-shell";

/* Figma: _Template/Starter — App shell + Auth shell. Every template sits in one of these.
   Copy this file (and the screen you need) into your app, then replace "Acme" and the nav. */

export const acmeNav: NavLink[] = [
  { label: "Dashboard", href: "/templates/dashboard", icon: "dashboard" },
  { label: "Projects", href: "/templates/empty/first-use", icon: "folder" },
  { label: "Members", href: "/templates/members", icon: "user" },
  { label: "Inbox", href: "/templates/empty/all-caught-up", icon: "mail", count: 4 },
  { label: "Reports", href: "/templates/empty/upgrade-required", icon: "chart" },
  { label: "Settings", href: "/templates/settings", icon: "settings" },
];

export function AcmeShell({ children }: { children: ReactNode }) {
  return <AppShell productName="Acme" nav={acmeNav} userName="Jane Cooper">{children}</AppShell>;
}

/** Auth shell: brand panel on the start side (hidden under 1024px), the form on the end side. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-canvas lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-brand p-12 text-fg-on-brand lg:flex">
        <span className="flex items-center gap-2 text-label-large"><span aria-hidden className="size-6 rounded-md bg-[var(--ds-color-text-on-brand)]" />Acme</span>
        <div className="flex max-w-md flex-col gap-3">
          <p className="text-display-large">Plan, track and ship work together.</p>
          <p className="text-body-large">Projects, members and reports in one calm workspace.</p>
        </div>
        <span className="text-caption-default">© 2026 Acme</span>
      </aside>
      <main id="main" className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="flex w-full max-w-[400px] flex-col gap-6">
          <Link href="/templates/sign-in" className="flex items-center gap-2 text-label-large lg:hidden"><span aria-hidden className="size-6 rounded-md bg-brand" />Acme</Link>
          {children}
        </div>
      </main>
    </div>
  );
}

/** The dashed content slot in the starter shells — replace it with your page. */
export function ContentSlot({ label = "Content slot — replace with your page" }: { label?: string }) {
  return <div className="grid min-h-80 place-items-center rounded-container border-2 border-dashed border-line-strong text-body-small text-fg-secondary">{label}</div>;
}
