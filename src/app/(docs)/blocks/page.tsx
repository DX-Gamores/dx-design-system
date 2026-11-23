import Link from "next/link";
import { DocHeader, PrevNext, Section } from "@/site/blocks";
import { CodeBlock } from "@/site/preview";
import { highlight } from "@/site/highlight";
import { blockCategories, blocks, blocksIn } from "@/site/blocks-data";

export const metadata = { title: "Blocks" };

const setup = `{
  "registries": {
    "@dx": "https://dx-design-system.vercel.app/r/v4/{name}.json"
  }
}`;

export default async function BlocksIndex() {
  return (
    <>
      <DocHeader
        eyebrow="Blocks"
        title="Blocks"
        summary={`${blocks.length} ready-made screens and sections built from DX components and tokens. Preview each one at desktop, tablet and phone width, read its code, and add it to your project with one command. The code is yours to change.`}
      />
      <Section title="Install a block" description="Blocks install with the shadcn CLI, like components. Add the DX registry to components.json once, then add any block by name. A block brings the components it uses.">
        <CodeBlock title="components.json" code={setup} html={await highlight(setup, "json")} />
        <CodeBlock code="npx shadcn@latest add @dx/sidebar-07" html={await highlight("npx shadcn@latest add @dx/sidebar-07", "bash")} />
        <p className="max-w-[68ch] text-body-medium text-fg-secondary">
          The page goes to <code className="font-mono text-code-medium">app/&lt;route&gt;/page.tsx</code> and its parts to <code className="font-mono text-code-medium">components/</code>. New to DX? Start with <Link href="/docs/installation/" className="rounded-sm text-fg-brand underline underline-offset-2 focus-visible:focus-ring">Installation</Link>.
        </p>
      </Section>
      <Section title="Browse by type">
        <ul className="grid gap-4 sm:grid-cols-2">
          {blockCategories.map((c) => (
            <li key={c.id}>
              <Link href={`/blocks/${c.id}/`} className="flex h-full flex-col gap-1 rounded-container border border-line-default bg-surface p-4 hover:bg-neutral-hover focus-visible:focus-ring">
                <span className="flex items-center justify-between gap-2 text-label-large">{c.title}<span className="rounded-full bg-surface-subtle px-2 text-label-small text-fg-secondary">{blocksIn(c.id).length}</span></span>
                <span className="text-body-small text-fg-secondary">{c.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <PrevNext href="/blocks/" />
    </>
  );
}
