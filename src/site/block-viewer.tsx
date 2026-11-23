"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Code2, Eye, Monitor, Moon, Smartphone, SquareArrowOutUpRight, Tablet } from "lucide-react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui";
import { CopyButton } from "./preview";

/* One block on /blocks/: Preview (a live page in a frame, at desktop, tablet or phone width, light or dark)
   or Code (every file the block installs, with its install path). Like shadcn's block viewer, in DX tokens. */

export type BlockFile = { target: string; code: string; html: string };

const viewports = [
  { id: "desktop", label: "Desktop", width: "100%", icon: Monitor },
  { id: "tablet", label: "Tablet · 834px", width: "834px", icon: Tablet },
  { id: "phone", label: "Phone · 390px", width: "390px", icon: Smartphone },
] as const;

export function BlockViewer({ name, title, description, src, height, files, install }: {
  name: string; title: string; description: string; src: string; height: number; files: BlockFile[]; install: string;
}) {
  const id = useId();
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [vp, setVp] = useState<(typeof viewports)[number]["id"]>("desktop");
  const [dark, setDark] = useState<boolean | null>(null);
  const [file, setFile] = useState(0);
  const frame = useRef<HTMLIFrameElement>(null);

  // The frame follows the site's light/dark mode when it loads; the moon button overrides it for this block only.
  const applyTheme = () => {
    const doc = frame.current?.contentDocument;
    if (!doc || dark === null) return;
    const hc = (document.documentElement.dataset.theme ?? "").endsWith("-hc");
    doc.documentElement.dataset.theme = `${dark ? "dark" : "light"}${hc ? "-hc" : ""}`;
  };
  useEffect(applyTheme);

  const tabBtn = (t: "preview" | "code", label: string, icon: typeof Eye) => (
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
          const n = t === "preview" ? "code" : "preview";
          setTab(n);
          (document.getElementById(`${id}-${n}-tab`) as HTMLElement | null)?.focus();
        }
      }}
      className={cn("inline-flex h-7 items-center gap-1.5 rounded-sm px-2.5 text-label-small focus-visible:focus-ring", tab === t ? "bg-surface text-fg-primary shadow-elevation-1" : "text-fg-secondary hover:text-fg-primary")}
    >
      <Icon name={icon} size={16} />
      {label}
    </button>
  );

  return (
    <section id={name} aria-labelledby={`${id}-title`} className="flex scroll-mt-24 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div role="tablist" aria-label={`${name}: preview or code`} className="flex gap-0.5 rounded-control bg-surface-subtle p-0.5">
          {tabBtn("preview", "Preview", Eye)}
          {tabBtn("code", "Code", Code2)}
        </div>
        <span aria-hidden className="h-4 w-px bg-line-default max-sm:hidden" />
        <h3 id={`${id}-title`} data-toc={name} className="min-w-0 flex-1 text-label-medium">
          <a href={`#${name}`} className="rounded-sm hover:underline focus-visible:focus-ring">{title}</a>
        </h3>
        <div className="flex flex-wrap items-center gap-1">
          {tab === "preview" && (
            <>
              <div role="group" aria-label="Preview width" className="flex items-center rounded-control border border-line-default p-0.5 max-md:hidden">
                {viewports.map((v) => (
                  <button key={v.id} type="button" aria-pressed={vp === v.id} title={v.label} onClick={() => setVp(v.id)}
                    className={cn("inline-flex size-7 items-center justify-center rounded-sm focus-visible:focus-ring", vp === v.id ? "bg-selected text-fg-brand" : "text-fg-secondary hover:bg-neutral-hover")}>
                    <Icon name={v.icon} size={16} label={v.label} />
                  </button>
                ))}
              </div>
              <button type="button" aria-pressed={dark === true} title="Dark mode for this preview" onClick={() => setDark((d) => !d)}
                className={cn("inline-flex size-8 items-center justify-center rounded-control focus-visible:focus-ring", dark ? "bg-selected text-fg-brand" : "text-fg-secondary hover:bg-neutral-hover")}>
                <Icon name={Moon} size={16} label="Dark mode for this preview" />
              </button>
              <a href={src} target="_blank" rel="noreferrer" title="Open in a new tab"
                className="inline-flex size-8 items-center justify-center rounded-control text-fg-secondary hover:bg-neutral-hover focus-visible:focus-ring">
                <Icon name={SquareArrowOutUpRight} size={16} label={`Open ${name} in a new tab`} />
              </a>
            </>
          )}
          <span className="flex h-8 items-center gap-1 rounded-control border border-line-default bg-surface ps-3 max-sm:hidden">
            <code className="font-mono text-code-small text-fg-secondary">{install}</code>
            <CopyButton text={install} label="Copy" className="h-7" />
          </span>
        </div>
      </div>
      <p className="-mt-1 max-w-[72ch] text-body-small text-fg-secondary">{description}</p>

      <div id={`${id}-preview`} role="tabpanel" aria-labelledby={`${id}-preview-tab`} hidden={tab !== "preview"}
        className="overflow-hidden rounded-container border border-line-default bg-surface-subtle">
        <div className="mx-auto transition-[max-width] duration-moderate" style={{ maxWidth: viewports.find((v) => v.id === vp)!.width }}>
          <iframe ref={frame} src={src} title={`${title} (live preview)`} loading="lazy" onLoad={applyTheme}
            className={cn("block w-full border-0 bg-canvas", vp !== "desktop" && "border-x border-line-default")} style={{ height }} />
        </div>
      </div>

      <div id={`${id}-code`} role="tabpanel" aria-labelledby={`${id}-code-tab`} hidden={tab !== "code"}
        className="flex overflow-hidden rounded-container border border-line-default bg-surface-subtle max-md:flex-col" style={{ height }}>
        <div className="flex shrink-0 flex-col gap-0.5 overflow-auto border-line-default p-2 max-md:max-h-40 max-md:border-b md:w-64 md:border-e">
          <p className="px-2 py-1 text-caption-default text-fg-secondary">Files</p>
          {files.map((f, i) => (
            <button key={f.target} type="button" aria-pressed={i === file} onClick={() => setFile(i)}
              className={cn("truncate rounded-sm px-2 py-1 text-start font-mono text-code-small focus-visible:focus-ring", i === file ? "bg-selected text-fg-brand" : "text-fg-secondary hover:bg-neutral-hover hover:text-fg-primary")}>
              {f.target}
            </button>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-line-default px-4 py-1.5">
            <span className="min-w-0 flex-1 truncate font-mono text-code-small text-fg-secondary">{files[file].target}</span>
            <CopyButton text={files[file].code} />
          </div>
          <div tabIndex={0} aria-label={`Code: ${files[file].target}`} className="ds-code min-h-0 flex-1 overflow-auto focus-visible:focus-ring" dangerouslySetInnerHTML={{ __html: files[file].html }} />
        </div>
      </div>
    </section>
  );
}
