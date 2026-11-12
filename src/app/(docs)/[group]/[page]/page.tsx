import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Alert } from "@/components/ui";
import { docPages } from "@/site/content";
import { CodeStatus, DocHeader, FigmaEmbed, FigmaOutline, Panel, PrevNext, Section, SpecIndex, SpecSection } from "@/site/blocks";
import { Demo } from "@/site/demos";
import { hasDemo } from "@/site/demo-names";
import { extras } from "@/site/extras";

type Params = { group: string; page: string };
const find = (p: Params) => docPages().find((d) => d.item.href === `/${p.group}/${p.page}/`);

export function generateStaticParams(): Params[] {
  return docPages().map((d) => {
    const [, group, page] = d.item.href.split("/");
    return { group, page };
  });
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const d = find(await params);
  return d ? { title: d.item.title, description: d.figma.summary } : {};
}

export default async function FigmaMirrorPage({ params }: { params: Promise<Params> }) {
  const d = find(await params);
  if (!d) notFound();
  const { item, figma, specs } = d;
  const name = item.figmaName!;
  const Extra = extras[name];
  const single = specs.length === 1;

  return (
    <>
      <DocHeader eyebrow={figma.eyebrow} title={item.title} summary={figma.summary} figmaId={figma.id}>
        <CodeStatus specs={specs} />
      </DocHeader>

      {hasDemo(name) && (
        <Section title="Live example" description="Real components from the code kit. Use the brand, theme and density switches in the header to re-skin them.">
          <Panel><Demo name={name} /></Panel>
        </Section>
      )}

      {Extra && <Extra />}

      {figma.doDont && (
        <Section id="do-dont" title="Do & don’t" description="Right and wrong, next to each other — the visual guidance from the Figma page.">
          <FigmaEmbed nodeId={figma.doDont.id} title={`${item.title}: do and don't`} w={figma.doDont.w} h={figma.doDont.h} />
        </Section>
      )}

      <FigmaOutline sections={figma.sections} nodeId={figma.id} />

      {specs.length > 0 && (
        <div className="flex flex-col gap-8">
          {!single && (
            <Section title="Components on this page" description={`${specs.length} components, each with its own spec below.`}>
              <SpecIndex specs={specs} />
            </Section>
          )}
          {single && <h2 className="text-heading-h2">Spec</h2>}
          {specs.map((s) => <SpecSection key={s.slug} spec={s} showTitle={!single} />)}
        </div>
      )}

      {specs.length === 0 && !Extra && (
        <Alert tone="info" title="Visual page">
          This page is mostly visual in Figma. Open it in Figma (view-only works) for the full picture; it comes to the site in a later phase.
        </Alert>
      )}

      <p className="text-caption-default text-fg-secondary">
        Generated from the Figma file. Specs come from component descriptions — to change one, edit it in Figma and re-export (see{" "}
        <Link className="text-fg-brand underline" href="/start/workflow/">Working with one seat</Link>).
      </p>
      <PrevNext href={item.href} />
    </>
  );
}
