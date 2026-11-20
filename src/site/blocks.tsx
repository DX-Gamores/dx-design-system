import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge, Icon } from "@/components/ui";
import { coded, codeSymbol, figmaComponent, figmaUrl, neighbours, specBody, specSummary, REPO, type Spec } from "./content";

export function DocHeader({ eyebrow, title, summary, figmaId, children }: { eyebrow?: string; title: string; summary?: string; figmaId?: string; children?: ReactNode }) {
  return (
    <header className="flex flex-col gap-3 border-b border-line-default pb-8">
      {eyebrow && <p className="text-label-small tracking-wide text-fg-brand uppercase">{eyebrow}</p>}
      <h1 className="text-heading-h1">{title}</h1>
      {summary && <p className="max-w-[68ch] text-body-large text-fg-secondary">{summary}</p>}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {figmaId && <FigmaLink nodeId={figmaId} />}
        {children}
      </div>
    </header>
  );
}

export function FigmaLink({ nodeId, label = "Open in Figma" }: { nodeId?: string; label?: string }) {
  return (
    <a
      href={figmaUrl(nodeId)}
      className="inline-flex h-control-sm items-center gap-2 rounded-control border border-line-strong bg-surface px-3 text-label-small hover:bg-neutral-hover focus-visible:focus-ring"
    >
      {label} <Icon name="external-link" size={16} />
    </a>
  );
}

export const headingId = (t: string) => t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function Section({ id, title, description, children }: { id?: string; title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <section aria-labelledby={id ?? headingId(title)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id={id ?? headingId(title)} data-toc={title} className="scroll-mt-24 text-heading-h2">{title}</h2>
        {description && <p className="max-w-[68ch] text-body-medium text-fg-secondary">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export const Panel = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)] ${className}`}>{children}</div>
);

/** The section outline of the Figma page, so people know what the visual docs cover. */
export function FigmaOutline({ sections, nodeId }: { sections: string[]; nodeId: string }) {
  return (
    <Panel className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-label-large">In the Figma page</h2>
        <a href={figmaUrl(nodeId)} className="text-label-small text-fg-brand underline underline-offset-2 focus-visible:focus-ring">
          View the visual docs (view-only, no seat needed)
        </a>
      </div>
      <ol className="flex flex-wrap gap-2">
        {sections.map((s, i) => (
          <li key={s} className="rounded-full border border-line-default px-3 py-1 text-label-small text-fg-secondary">
            <span className="text-fg-brand tabular-nums">{String(i + 1).padStart(2, "0")}</span> · {s}
          </li>
        ))}
      </ol>
    </Panel>
  );
}

export function CodeStatus({ specs }: { specs: Spec[] }) {
  if (!specs.length) return null;
  const n = specs.filter((s) => coded.has(s.slug)).length;
  if (n === specs.length) return <Badge tone="success">Coded in React</Badge>;
  if (n === 0) return <Badge tone="neutral">Spec only · not coded yet</Badge>;
  return <Badge tone="warning">{`${n} of ${specs.length} coded`}</Badge>;
}

export function SpecSection({ spec, showTitle }: { spec: Spec; showTitle: boolean }) {
  return (
    <section id={spec.slug} className="flex scroll-mt-24 flex-col gap-3">
      {showTitle && (
        <div className="flex flex-wrap items-center gap-3 border-t border-line-default pt-8">
          <h2 className="text-heading-h2">{spec.n}</h2>
          {coded.has(spec.slug) ? <Badge tone="success">Coded</Badge> : <Badge tone="neutral">Spec only</Badge>}
          <span className="text-caption-default text-fg-secondary">{spec.vc} variant{spec.vc > 1 ? "s" : ""} in Figma</span>
        </div>
      )}
      {showTitle && <p className="text-body-medium text-fg-secondary">{specSummary(spec)}</p>}
      <div className="ds-prose" dangerouslySetInnerHTML={{ __html: specBody(spec.slug) }} />
      <FigmaVsCode spec={spec} />
    </section>
  );
}

export function SpecIndex({ specs }: { specs: Spec[] }) {
  if (specs.length < 2) return null;
  return (
    <nav aria-label="Components on this page" className="flex flex-wrap gap-2">
      {specs.map((s) => (
        <a key={s.slug} href={`#${s.slug}`} className="inline-flex h-control-sm items-center rounded-control bg-surface-subtle px-3 text-label-small hover:bg-neutral-hover focus-visible:focus-ring">
          {s.n}
        </a>
      ))}
    </nav>
  );
}

export function PrevNext({ href }: { href: string }) {
  const { prev, next } = neighbours(href);
  const card = "flex flex-1 flex-col gap-1 rounded-container border border-line-default bg-surface p-4 hover:border-line-hover focus-visible:focus-ring";
  return (
    <nav aria-label="Previous and next page" className="flex flex-col gap-3 border-t border-line-default pt-8 sm:flex-row">
      {prev ? (
        <Link href={prev.href} className={card}>
          <span className="text-caption-default text-fg-secondary">← Previous · {prev.group}</span>
          <span className="text-label-large">{prev.title}</span>
        </Link>
      ) : <span className="flex-1" />}
      {next ? (
        <Link href={next.href} className={`${card} sm:items-end sm:text-right`}>
          <span className="text-caption-default text-fg-secondary">Next · {next.group} →</span>
          <span className="text-label-large">{next.title}</span>
        </Link>
      ) : <span className="flex-1" />}
    </nav>
  );
}

export function Markdown({ html }: { html: string }) {
  return <div className="ds-prose" dangerouslySetInnerHTML={{ __html: html }} />;
}

/** A Figma frame as a static image (exported to public/figma/<id>.png), so it shows for everyone — no Figma login.
 *  Until a frame has been exported, a link opens it in Figma (view-only works). */
export function FigmaFrame({ nodeId, title, w, h }: { nodeId: string; title: string; w: number; h: number }) {
  const file = `/figma/${nodeId.replace(":", "-")}.png`;
  const exported = fs.existsSync(path.join(process.cwd(), "public", file));
  const base = process.env.PAGES_BASE_PATH ?? "";
  if (exported) {
    return (
      <figure className="flex flex-col gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={base + file} alt={title} width={w} height={h} loading="lazy" className="h-auto w-full rounded-container border border-line-default bg-white" />
        <figcaption className="text-caption-default text-fg-secondary">
          From the Figma file · <a href={figmaUrl(nodeId)} className="text-fg-brand underline underline-offset-2 focus-visible:focus-ring">open the frame in Figma</a>
        </figcaption>
      </figure>
    );
  }
  return (
    <a href={figmaUrl(nodeId)} className="flex items-center gap-3 rounded-container border border-dashed border-line-strong bg-surface-subtle p-4 hover:bg-neutral-hover focus-visible:focus-ring">
      <Icon name="image" size={24} className="text-icon-secondary" />
      <span className="flex flex-col">
        <span className="text-label-medium">{title}</span>
        <span className="text-caption-default text-fg-secondary">Open this frame in Figma (view-only, no seat needed) · {w}×{h}</span>
      </span>
      <Icon name="external-link" size={16} className="ms-auto text-icon-secondary" />
    </a>
  );
}

/** Figma component set next to where the code lives — the visual parity check. */
export function FigmaVsCode({ spec }: { spec: Spec }) {
  const f = figmaComponent(spec.n);
  const sym = codeSymbol(spec.slug);
  const file = sym?.includes(":") ? `src/components/${sym.split(":")[0]}.tsx` : "src/components/ui/index.ts";
  if (!f) return null;
  return (
    <details className="group rounded-container border border-line-default bg-surface">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-container px-4 py-3 text-label-medium hover:bg-neutral-hover focus-visible:focus-ring [&::-webkit-details-marker]:hidden">
        <Icon name="chevron-right" size={16} className="transition-transform duration-fast group-open:rotate-90" />
        Compare with the Figma component
        <span className="ms-auto text-caption-default font-normal text-fg-secondary">{spec.vc} variant{spec.vc > 1 ? "s" : ""}{sym ? <> · code: <code className="text-code-small">{sym.split(":").pop()}</code></> : null}</span>
      </summary>
      <div className="flex flex-col gap-3 border-t border-line-default p-4">
        <FigmaFrame nodeId={f.id} title={`${spec.n} component set in Figma`} w={f.w} h={f.h} />
        {sym && <p className="text-caption-default text-fg-secondary">Code: <a className="text-fg-brand underline underline-offset-2" href={`${REPO}/blob/main/${file}`}>{sym.split(":").pop()}</a> in <code className="text-code-small">{file}</code>. If the two disagree, Figma wins — open an issue labelled <code className="text-code-small">design-system</code>.</p>}
      </div>
    </details>
  );
}
