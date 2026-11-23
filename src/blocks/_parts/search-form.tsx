"use client";
import { useId } from "react";
import { Icon } from "@/components/ui/icon";
import { SidebarInput } from "@/components/ui/sidebar";

/** A search box for the sidebar header. */
export function SearchForm({ placeholder = "Search the docs…", className }: { placeholder?: string; className?: string }) {
  const id = useId();
  return (
    <form role="search" className={className} onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">Search</label>
      <div className="relative">
        <Icon name="search" size={16} className="pointer-events-none absolute start-2.5 top-1/2 -translate-y-1/2 text-icon-secondary" />
        <SidebarInput id={id} type="search" placeholder={placeholder} className="ps-8" />
      </div>
    </form>
  );
}
