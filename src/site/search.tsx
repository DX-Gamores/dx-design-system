"use client";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui";

/** One searchable entry: a docs page or a component spec (built at build time in the docs layout). */
export type SearchEntry = { title: string; href: string; group: string; kind: "Page" | "Component"; text?: string };

const score = (e: SearchEntry, q: string) => {
  const t = e.title.toLowerCase();
  if (t === q) return 0;
  if (t.startsWith(q)) return 1;
  if (t.split(/[\s&/-]+/).some((w) => w.startsWith(q))) return 2;
  if (t.includes(q)) return 3;
  if (e.group.toLowerCase().includes(q)) return 4;
  if (e.text?.toLowerCase().includes(q)) return 5;
  return -1;
};

/** Header search button + ⌘K / Ctrl+K command palette over every page and component. */
export function DocsSearch({ index }: { index: SearchEntry[] }) {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const [mac, setMac] = useState(false);

  useEffect(() => setMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return index.filter((e) => e.kind === "Page" && e.group === "Start here");
    return index
      .map((e) => ({ e, s: score(e, query) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => a.s - b.s || a.e.title.localeCompare(b.e.title))
      .slice(0, 12)
      .map((r) => r.e);
  }, [q, index]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !open && !(e.target as HTMLElement)?.closest("input,textarea,select,[contenteditable]")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement as HTMLElement;
      d.showModal();
      input.current?.focus();
    }
    if (!open && d.open) {
      d.close();
      setQ("");
      opener.current?.focus();
    }
  }, [open]);

  const go = (e?: SearchEntry) => {
    if (!e) return;
    setOpen(false);
    router.push(e.href);
  };

  const onInputKey = (ev: React.KeyboardEvent) => {
    if (ev.key === "ArrowDown") { ev.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (ev.key === "Enter") { ev.preventDefault(); go(results[active]); }
  };

  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, listId]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search docs"
        aria-keyshortcuts="Meta+K Control+K"
        className="flex h-control-sm items-center gap-2 rounded-control border border-line-default bg-surface-subtle px-2 text-label-small text-fg-secondary hover:bg-neutral-hover hover:text-fg-primary focus-visible:focus-ring lg:w-56"
      >
        <Icon name="search" size={16} />
        <span className="hidden flex-1 text-left lg:inline">Search docs…</span>
        <kbd className="hidden rounded-sm border border-line-default bg-surface px-1.5 font-mono text-[11px] lg:inline">{mac ? "⌘" : "Ctrl"} K</kbd>
      </button>
      <dialog
        ref={ref}
        aria-label="Search docs"
        onCancel={(e) => { e.preventDefault(); setOpen(false); }}
        onClick={(e) => { if (e.target === ref.current) setOpen(false); }}
        className="mx-auto mt-[12vh] w-[calc(100%-32px)] max-w-[600px] rounded-container border border-line-default bg-surface p-0 text-fg-primary shadow-elevation-3 backdrop:bg-overlay"
      >
        <div className="flex items-center gap-2 border-b border-line-default px-4">
          <Icon name="search" size={16} className="text-icon-secondary" />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onInputKey}
            role="combobox"
            aria-label="Search pages and components"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results.length ? `${listId}-${active}` : undefined}
            aria-autocomplete="list"
            placeholder="Search pages and components…"
            style={{ boxShadow: "none" }}
            className="h-12 min-w-0 flex-1 bg-transparent text-body-medium outline-none placeholder:text-fg-placeholder"
          />
          <kbd className="rounded-sm border border-line-default px-1.5 font-mono text-[11px] text-fg-secondary">Esc</kbd>
        </div>
        <ul id={listId} role="listbox" aria-label="Results" className="max-h-[50vh] overflow-y-auto p-2">
          {!q && <li role="presentation" className="px-3 pb-1 pt-2 text-caption-default text-fg-secondary">Start here</li>}
          {results.map((r, i) => (
            <li
              key={`${r.kind}-${r.href}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseMove={() => setActive(i)}
              onClick={() => go(r)}
              className={cn("flex cursor-pointer items-center gap-3 rounded-md px-3 py-2", i === active && "bg-neutral-hover")}
            >
              <Icon name={r.kind === "Component" ? "grid-view" : "file"} size={16} className="shrink-0 text-icon-secondary" />
              <span className="min-w-0 flex-1 truncate text-label-medium">{r.title}</span>
              <span className="shrink-0 text-caption-default text-fg-secondary">{r.kind === "Component" ? `${r.group} · component` : r.group}</span>
            </li>
          ))}
          {q && !results.length && <li role="presentation" className="px-3 py-6 text-center text-body-small text-fg-secondary">No results for “{q}”.</li>}
        </ul>
        <div className="flex gap-4 border-t border-line-default px-4 py-2 text-caption-default text-fg-secondary">
          <span><kbd className="font-mono">↑ ↓</kbd> to move</span>
          <span><kbd className="font-mono">Enter</kbd> to open</span>
          <span><kbd className="font-mono">Esc</kbd> to close</span>
        </div>
      </dialog>
    </>
  );
}

/** Adds a Copy button to every code block in the page (Markdown pages, specs and hand-written blocks). */
export function useCodeCopy(dep: string) {
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    const blocks = main.querySelectorAll<HTMLPreElement>("pre:not([data-copy])");
    blocks.forEach((pre) => {
      pre.dataset.copy = "";
      pre.classList.add("group/code", "relative", "pr-16");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "Copy code");
      btn.className =
        "absolute right-2 top-2 rounded-control border border-line-default bg-surface px-2 py-1 text-label-small text-fg-secondary opacity-0 transition-opacity hover:text-fg-primary focus-visible:opacity-100 focus-visible:focus-ring group-hover/code:opacity-100 [@media(hover:none)]:opacity-100";
      btn.textContent = "Copy";
      btn.addEventListener("click", async () => {
        try {
          const copy = pre.cloneNode(true) as HTMLElement;
          copy.querySelectorAll("button").forEach((b) => b.remove());
          await navigator.clipboard.writeText((copy.textContent ?? "").replace(/\n$/, ""));
          btn.textContent = "Copied";
        } catch {
          btn.textContent = "Press Ctrl+C";
        }
        setTimeout(() => (btn.textContent = "Copy"), 1600);
      });
      pre.appendChild(btn);
    });
  }, [dep]);
}
