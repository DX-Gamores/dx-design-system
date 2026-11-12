import Link from "next/link";
import { nav, specs, coded } from "@/site/content";
import { DocHeader, Panel, PrevNext } from "@/site/blocks";
import { Demo } from "@/site/demos";
import { hasDemo } from "@/site/demo-names";

export const metadata = { title: "Component gallery" };

// Every coded component on one page, in Figma's order. Use it to check a brand, theme or density change at a glance.
export default function Gallery() {
  const groups = nav.filter((g) => !["start", "foundations"].includes(g.slug));
  const total = specs.filter((s) => coded.has(s.slug)).length;
  return (
    <>
      <DocHeader eyebrow="Start here" title="Component gallery" summary={`All ${total} coded components, live, in the same order as the Figma file. Switch brand, theme and density in the header to re-skin everything at once.`} />
      {groups.map((g) => (
        <section key={g.slug} className="flex flex-col gap-6">
          <h2 className="border-b border-line-default pb-2 text-heading-h2">{g.title}</h2>
          {g.items.filter((i) => hasDemo(i.figmaName!)).map((i) => (
            <div key={i.href} className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-heading-h4">{i.title}</h3>
                <Link href={i.href} className="text-label-small text-fg-brand underline underline-offset-2 focus-visible:focus-ring">Spec & guidance →</Link>
              </div>
              <Panel><Demo name={i.figmaName as never} /></Panel>
            </div>
          ))}
        </section>
      ))}
      <PrevNext href="/start/gallery/" />
    </>
  );
}
