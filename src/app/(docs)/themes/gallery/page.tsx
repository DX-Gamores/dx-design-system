import Link from "next/link";
import { Badge } from "@/components/ui";
import { DocHeader, PrevNext, Section } from "@/site/blocks";
import { CopyButton } from "@/site/preview";
import { builtInBrands, gallery } from "@/site/theme-presets";

export const metadata = { title: "Brand gallery" };

const radius = { none: "square", sm: "small", md: "medium", lg: "large", xl: "x-large", full: "pill" } as const;

function Swatches({ steps, label }: { steps: string[]; label: string }) {
  return (
    <div className="flex h-6 overflow-hidden rounded-sm border border-line-default" role="img" aria-label={`${label}: ${steps[1]} to ${steps[9]}`}>
      {steps.map((s, i) => <span key={i} className="flex-1" style={{ background: s }} />)}
    </div>
  );
}

export default function Page() {
  return (
    <>
      <DocHeader eyebrow="Themes" title="Brand gallery" summary={`Brands made with the theme builder, ready to install, plus the three built into DX. Every one passes the 27-pair contrast audit in light, dark and both high-contrast modes.`} />
      <Section title="Gallery brands" description="Install one into a DX project with the CLI, then set data-brand on <html>.">
        <ul className="grid gap-4 md:grid-cols-2">
          {gallery.map((g) => {
            const cmd = `npx shadcn@latest add @dx/theme-${g.slug}`;
            return (
              <li key={g.slug} className="flex flex-col gap-3 rounded-container border border-line-default bg-surface p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-heading-h4">{g.name}</h3>
                  <Badge tone="success">{g.passed}/{g.total} contrast checks</Badge>
                </div>
                {g.comment && <p className="text-body-small text-fg-secondary">{g.comment.replace(/ Edit on the site:.*$/, "")}</p>}
                <Swatches steps={g.ramps.primary} label="Primary" />
                <Swatches steps={g.ramps.accent} label="Accent" />
                <Swatches steps={g.ramps.neutral} label="Neutral" />
                <p className="text-body-small text-fg-secondary">{g.input.headingFont}{g.input.bodyFont !== g.input.headingFont ? ` / ${g.input.bodyFont}` : ""} · {radius[g.input.radiusControl]} controls · {radius[g.input.radiusContainer]} cards · {g.input.density}</p>
                <div className="flex items-center gap-1 rounded-control border border-line-default bg-surface-subtle ps-3">
                  <code className="min-w-0 flex-1 truncate font-mono text-code-small">{cmd}</code>
                  <CopyButton text={cmd} label="Copy" />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-label-medium">
                  <Link href={`/themes/builder/?brand=${g.slug}`} className="rounded-sm text-fg-brand underline underline-offset-2 focus-visible:focus-ring">Open in the builder</Link>
                  <Link href={`/view/dashboard-01/?brand=${g.slug}`} className="rounded-sm text-fg-brand underline underline-offset-2 focus-visible:focus-ring">See it on a dashboard</Link>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>
      <Section title="Built-in brands" description="Shipped in @dx/init. Switch with data-brand, or try them on this site with Customize.">
        <ul className="grid gap-4 md:grid-cols-3">
          {builtInBrands.map((b) => (
            <li key={b.slug} className="flex flex-col gap-3 rounded-container border border-line-default bg-surface p-4">
              <h3 className="text-heading-h4">{b.name}</h3>
              <Swatches steps={b.ramps.primary} label="Primary" />
              <Swatches steps={b.ramps.neutral} label="Neutral" />
              <p className="text-body-small text-fg-secondary">{b.font} · <code className="font-mono text-code-small">data-brand=&quot;{b.slug}&quot;</code></p>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Add a brand">
        <p className="max-w-[68ch] text-body-medium text-fg-secondary">
          Make it in the <Link href="/themes/builder/" className="rounded-sm text-fg-brand underline underline-offset-2 focus-visible:focus-ring">theme builder</Link>, then choose <strong>Add to the gallery</strong>. That opens a pull request with <code className="font-mono text-code-medium">themes/&lt;brand&gt;.json</code>; the build checks contrast and publishes <code className="font-mono text-code-medium">@dx/theme-&lt;brand&gt;</code> when it merges.
        </p>
      </Section>
      <PrevNext href="/themes/gallery/" />
    </>
  );
}
