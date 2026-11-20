import { categories, coded, componentPages, specSummary } from "@/site/content";
import { DocHeader, PrevNext } from "@/site/blocks";
import { ComponentIndex } from "@/site/component-index";

export const metadata = { title: "Components" };

export default function Components() {
  const entries = componentPages.map((c) => ({ slug: c.slug, name: c.spec.n, summary: specSummary(c.spec), category: c.category.title, coded: coded.has(c.slug) }));
  const used = categories.map((c) => c.title).filter((t) => entries.some((e) => e.category === t));
  return (
    <>
      <DocHeader
        eyebrow="Components"
        title="Components"
        summary={`All ${entries.length} components from the Figma library, coded in React. Each page has live examples with code, install commands, props, tokens and accessibility notes.`}
      />
      <ComponentIndex entries={entries} categories={used} />
      <PrevNext href="/components/" />
    </>
  );
}
