"use client";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Monitor, Moon, Smartphone, Tablet } from "lucide-react";
import { Icon } from "@/components/ui";

/* Preview / Code tabs for one example (shadcn style). The preview has its own viewport width and color mode,
   so you can check a component on a phone or in dark mode without changing the whole site. */

const viewports = [
  { id: "full", label: "Desktop", width: undefined, icon: Monitor },
  { id: "tablet", label: "Tablet · 834px", width: 834, icon: Tablet },
  { id: "mobile", label: "Phone · 390px", width: 390, icon: Smartphone },
] as const;

export function CopyButton({ text, label = "Copy code", className }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {});
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className={cn("inline-flex h-control-sm items-center gap-1.5 rounded-control px-2 text-label-small text-fg-secondary hover:bg-neutral-hover hover:text-fg-primary focus-visible:focus-ring", className)}
    >
      <Icon name={done ? "check" : "copy"} size={16} />
      <span aria-live="polite">{done ? "Copied" : label}</span>
    </button>
  );
}

export function ExamplePreview({ title, description, code, codeHtml, children, minHeight = 160, headingLevel = 3, frameSrc }: { title: string; description?: string; code: string; codeHtml: string; children?: ReactNode; minHeight?: number; headingLevel?: 2 | 3; frameSrc?: string }) {
  const id = useId();
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [vp, setVp] = useState<(typeof viewports)[number]["id"]>("full");
  const [mode, setMode] = useState<"inherit" | "light" | "dark">("inherit");
  const width = viewports.find((v) => v.id === vp)!.width;
  const H = `h${headingLevel}` as "h3";
  const tabBtn = (t: "preview" | "code", label: string) => (
    <button
      type="button"
      role="tab"
      id={`${id}-${t}-tab`}
      aria-selected={tab === t}
      aria-controls={`${id}-${t}`}
      tabIndex={tab === t ? 0 : -1}
      onClick={() => setTab(t)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          const next = tab === "preview" ? "code" : "preview";
          setTab(next);
          (document.getElementById(`${id}-${next}-tab`) as HTMLElement | null)?.focus();
        }
      }}
      className={cn("relative h-control-sm px-1 text-label-medium focus-visible:focus-ring", tab === t ? "text-fg-primary after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-brand" : "text-fg-secondary hover:text-fg-primary")}
    >
      {label}
    </button>
  );
  return (
    <div className="flex flex-col gap-3">
      {(title || description) && (
        <div className="flex flex-col gap-1">
          <H id={`${id}-title`} data-toc={headingLevel === 2 ? title : undefined} className="scroll-mt-24 text-heading-h4">{title}</H>
          {description && <p className="max-w-[72ch] text-body-small text-fg-secondary">{description}</p>}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line-default">
        <div role="tablist" aria-label={`${title}: preview or code`} className="flex gap-4">
          {tabBtn("preview", "Preview")}
          {tabBtn("code", "Code")}
        </div>
        <div className="ms-auto flex items-center gap-1 pb-1">
          {tab === "preview" ? (
            <>
              <div role="group" aria-label="Preview width" className="flex items-center">
                {viewports.map((v) => (
                  <button key={v.id} type="button" aria-pressed={vp === v.id} title={v.label} onClick={() => setVp(v.id)}
                    className={cn("inline-flex size-8 items-center justify-center rounded-md focus-visible:focus-ring", vp === v.id ? "bg-selected text-fg-brand" : "text-fg-secondary hover:bg-neutral-hover")}>
                    <Icon name={v.icon} size={16} label={v.label} />
                  </button>
                ))}
              </div>
              <button type="button" aria-pressed={mode === "dark"} title="Dark mode for this preview" onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
                className={cn("inline-flex size-8 items-center justify-center rounded-md focus-visible:focus-ring", mode === "dark" ? "bg-selected text-fg-brand" : "text-fg-secondary hover:bg-neutral-hover")}>
                <Icon name={Moon} size={16} label="Dark mode for this preview" />
              </button>
            </>
          ) : (
            <CopyButton text={code} />
          )}
        </div>
      </div>
      <div id={`${id}-preview`} role="tabpanel" tabIndex={0} aria-labelledby={`${id}-preview-tab`} hidden={tab !== "preview"} className="overflow-x-auto focus-visible:focus-ring rounded-container border border-line-default bg-surface-subtle">
        <div
          data-theme={mode === "inherit" ? undefined : mode}
          className="mx-auto bg-canvas text-fg-primary transition-[max-width] duration-moderate"
          style={{ maxWidth: width, minHeight }}
        >
          {frameSrc ? (
            <iframe src={frameSrc} title={`${title || "Example"} (live page)`} loading="lazy" className="block h-[560px] w-full border-0" />
          ) : (
            <div className="flex min-h-[inherit] items-center justify-center p-6 sm:p-10">
              <div className="w-full">{children}</div>
            </div>
          )}
        </div>
      </div>
      <div id={`${id}-code`} role="tabpanel" tabIndex={0} aria-labelledby={`${id}-code-tab`} hidden={tab !== "code"} className="ds-code max-h-[480px] overflow-auto rounded-container border border-line-default bg-surface-subtle" dangerouslySetInnerHTML={{ __html: codeHtml }} />
    </div>
  );
}

/** Tabs for install commands (CLI / Manual). Panels are rendered on the server and passed in. */
export function InstallTabs({ cli, manual }: { cli: ReactNode; manual: ReactNode }) {
  const id = useId();
  const [tab, setTab] = useState<"cli" | "manual">("cli");
  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" aria-label="How to install" className="flex gap-4 border-b border-line-default">
        {(["cli", "manual"] as const).map((t) => (
          <button key={t} type="button" role="tab" id={`${id}-${t}-tab`} aria-selected={tab === t} aria-controls={`${id}-${t}`} tabIndex={tab === t ? 0 : -1}
            onClick={() => setTab(t)}
            onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { const n = t === "cli" ? "manual" : "cli"; setTab(n); (document.getElementById(`${id}-${n}-tab`) as HTMLElement | null)?.focus(); } }}
            className={cn("relative h-control-sm px-1 text-label-medium focus-visible:focus-ring", tab === t ? "text-fg-primary after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-brand" : "text-fg-secondary hover:text-fg-primary")}>
            {t === "cli" ? "CLI" : "Manual"}
          </button>
        ))}
      </div>
      <div id={`${id}-cli`} role="tabpanel" aria-labelledby={`${id}-cli-tab`} hidden={tab !== "cli"}>{cli}</div>
      <div id={`${id}-manual`} role="tabpanel" aria-labelledby={`${id}-manual-tab`} hidden={tab !== "manual"}>{manual}</div>
    </div>
  );
}

/** A highlighted code block with a copy button (server passes the highlighted HTML). */
export function CodeBlock({ code, html, title }: { code: string; html: string; title?: string }) {
  return (
    <div className="relative rounded-container border border-line-default bg-surface-subtle">
      {title && <div className="border-b border-line-default px-4 py-2 text-caption-default text-fg-secondary">{title}</div>}
      <CopyButton text={code} label="Copy" className="absolute end-2 top-2 bg-surface-subtle" />
      <div className="ds-code pe-20" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
