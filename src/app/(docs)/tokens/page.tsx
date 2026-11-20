import Link from "next/link";
import { DocHeader, PrevNext, Section } from "@/site/blocks";
import { BRANDS, MODES, tokenRows } from "@/site/token-data";
import { TokenExplorer } from "@/site/token-explorer";

export const metadata = { title: "Token explorer", description: "Search every DX design token and copy it as CSS, Tailwind, React Native or a raw value." };

export default function TokensPage() {
  const rows = tokenRows();
  const count = (t: string) => rows.filter((r) => r.tier === t).length;
  return (
    <>
      <DocHeader
        eyebrow="Tokens"
        title="Token explorer"
        summary={`All ${rows.length} variables from the Figma file. Pick a brand and color mode to see real values; copy any token in the format your project uses.`}
      />
      <Section title="Tiers" description="Components only ever read Semantic and Component tokens. Brands change the Brand tier; Primitives are the raw palette.">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Primitive", "color/blue/600", "Raw palette value. Hidden from pickers."],
            ["Brand", "brand/primary/600", "Swapped per client brand."],
            ["Semantic", "color/bg/brand", "Named by purpose; has light, dark and high-contrast values."],
            ["Component", "button/primary/bg", "What a component reads."],
          ].map(([t, ex, note], i) => (
            <li key={t} className="flex flex-col gap-1 rounded-container border border-line-default bg-surface p-4">
              <span className="text-caption-default text-fg-secondary">{`Tier ${i + 1} · ${count(t)} tokens`}</span>
              <span className="text-label-large">{t}</span>
              <code className="text-code-small">{ex}</code>
              <span className="text-body-small text-fg-secondary">{note}</span>
            </li>
          ))}
        </ol>
      </Section>
      <Section title="Explore" description="Foundation covers spacing, radius, type, motion, layout and effects.">
        <TokenExplorer rows={rows} brands={BRANDS} modes={MODES} />
      </Section>
      <p className="text-body-small text-fg-secondary">
        Need all of them as a file? <Link className="text-fg-brand underline underline-offset-2" href="/docs/downloads/">Downloads</Link> has CSS, Tailwind, DTCG JSON, TypeScript and React Native.
      </p>
      <PrevNext href="/tokens/" />
    </>
  );
}
