import Link from "next/link";
import type { ReactNode } from "react";
import { Badge, Icon } from "@/components/ui";
import { coded, figmaUrl, neighbours, specBody, specSummary, type Spec } from "./content";

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

export function Section({ id, title, description, children }: { id?: string; title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-heading-h2">{title}</h2>
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
