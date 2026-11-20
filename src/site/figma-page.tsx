import Link from "next/link";
import { Alert, Badge } from "@/components/ui";
import { coded, docFrames, figmaPage, type NavItem, type Spec, specSummary } from "./content";
import { DocHeader, FigmaFrame, FigmaOutline, Panel, PrevNext, Section } from "./blocks";
import { Demo } from "./demos";
import { hasDemo } from "./demo-names";
import { extras } from "./extras";

/** A Figma page that isn't a single component (foundations, patterns, templates, themes): header, live example,
 *  page-specific content, do/don't, the Figma outline and links to the components it uses. */
export function FigmaPageView({ item, specs, eyebrow }: { item: NavItem; specs: Spec[]; eyebrow?: string }) {
  const name = item.figmaName!;
  const figma = figmaPage(name);
  const Extra = extras[name];
  const frames = docFrames(name);
  return (
    <>
      <DocHeader eyebrow={eyebrow ?? figma.eyebrow} title={item.title} summary={figma.summary} figmaId={figma.id} />

      {hasDemo(name) && (
        <Section title="Live example" description="Real components from the code kit. Use Customize in the header to switch brand, contrast and density.">
          <Panel><Demo name={name} /></Panel>
        </Section>
      )}

      {Extra && <Extra />}

      {specs.length > 0 && (
        <Section title="Components" description="Each one has its own page with live examples, code, props and accessibility notes.">
          <ul className="grid gap-3 sm:grid-cols-2">
            {specs.map((s) => (
              <li key={s.slug}>
                <Link href={`/components/${s.slug}/`} className="flex h-full flex-col gap-1 rounded-container border border-line-default bg-surface p-4 hover:border-line-hover focus-visible:focus-ring">
                  <span className="flex items-center gap-2 text-label-large">{s.n}{!coded.has(s.slug) && <Badge>Spec only</Badge>}</span>
                  <span className="text-body-small text-fg-secondary">{specSummary(s)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(frames.doDont ?? figma.doDont) && (
        <Section id="do-dont" title="Do & don’t" description="Right and wrong, next to each other — the visual guidance from the Figma page.">
          <FigmaFrame nodeId={(frames.doDont ?? figma.doDont)!.id} title={`${item.title}: do and don’t`} w={(frames.doDont ?? figma.doDont)!.w} h={(frames.doDont ?? figma.doDont)!.h} />
        </Section>
      )}

      <FigmaOutline sections={figma.sections} nodeId={figma.id} />

      {specs.length === 0 && !Extra && !hasDemo(name) && (
        <Alert tone="info" title="Visual page">This page is mostly visual in Figma. Open it in Figma (view-only works) for the full picture.</Alert>
      )}

      <p className="text-caption-default text-fg-secondary">
        Generated from the Figma file. To change this page, edit it in Figma and re-export (see{" "}
        <Link className="text-fg-brand underline" href="/contribute/workflow/">Working with one seat</Link>).
      </p>
      <PrevNext href={item.href} />
    </>
  );
}
