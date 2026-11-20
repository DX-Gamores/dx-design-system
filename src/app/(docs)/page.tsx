import Link from "next/link";
import { Badge, Button, buttonClass, Icon, StatCard, type IconName } from "@/components/ui";
import { componentPages, stats, VERSION } from "@/site/content";
import { highlight } from "@/site/highlight";
import { CodeBlock } from "@/site/preview";

export const metadata = { title: { absolute: "DX Design System" } };

const install = "npx shadcn@latest add https://dx-design-system.vercel.app/r/v4/init.json https://dx-design-system.vercel.app/r/v4/button.json";

export default async function Home() {
  const s = stats();
  const cards: { icon: IconName; title: string; text: string; href: string }[] = [
    { icon: "dashboard", title: "Components", text: `${componentPages.length} components with live examples, code, props and accessibility notes.`, href: "/components/" },
    { icon: "filter", title: "Tokens", text: `${s.variables} variables. Search them and copy as CSS, Tailwind or React Native.`, href: "/tokens/" },
    { icon: "star", title: "Icons", text: `${s.icons} DX icons on Lucide, plus any of Lucide's 1,600. Copy as SVG, JSX or React Native.`, href: "/icons/" },
    { icon: "eye", title: "Themes", text: `${s.brands} brands × ${s.modes} color modes × 2 densities, contrast-checked.`, href: "/themes/" },
    { icon: "phone", title: "React Native", text: "One theme file with every token resolved. Mobile apps share tokens, not components.", href: "/docs/react-native/" },
    { icon: "send", title: "Build with AI", text: "llms.txt, Markdown pages and rules so assistants write DX code.", href: "/docs/ai/" },
  ];
  return (
    <>
      <header className="flex flex-col gap-5 pt-4">
        <Link href="/docs/changelog/" className="inline-flex w-fit items-center gap-2 rounded-full border border-line-default bg-surface px-3 py-1 text-label-small text-fg-secondary hover:bg-neutral-hover focus-visible:focus-ring">
          <Badge tone="brand">{`v${VERSION}`}</Badge> Install with one command, React Native tokens, Lucide icons <Icon name="arrow-right" size={16} />
        </Link>
        <h1 className="max-w-[18ch] text-display-large">Build DXFORM products in any brand.</h1>
        <p className="max-w-[60ch] text-body-large text-fg-secondary">
          Tokens, components and patterns from the DX Figma library, as code you own. Copy it, install it with the shadcn CLI, or download it. No Figma seat needed.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/docs/installation/" className={buttonClass()}>Get started</Link>
          <Link href="/components/" className={buttonClass({ variant: "secondary" })}>Browse components</Link>
        </div>
        <div className="max-w-3xl">
          <CodeBlock code={install} html={await highlight(install, "bash")} />
        </div>
      </header>

      <section aria-labelledby="look" className="flex flex-col gap-3">
        <h2 id="look" data-toc="See it" className="sr-only">See it</h2>
        <div className="grid gap-4 rounded-container border border-line-default bg-surface-subtle p-4 sm:p-6 md:grid-cols-3">
          <StatCard label="Active members" value="1,284" trend={{ direction: "positive", value: "+12%" }} context="vs. last 30 days" />
          <StatCard label="Open tickets" value="37" trend={{ direction: "negative", value: "+5" }} context="vs. last week" />
          <div className="flex flex-col justify-between gap-3 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)]">
            <p className="text-body-small text-fg-secondary">Switch brand, contrast and density with <strong className="text-fg-primary">Customize</strong> in the header. Everything re-skins.</p>
            <div className="flex flex-wrap gap-2"><Button size="sm" leadingIcon="plus">Invite</Button><Button size="sm" variant="secondary">Export</Button></div>
          </div>
        </div>
      </section>

      <section aria-labelledby="explore" className="flex flex-col gap-4">
        <h2 id="explore" data-toc="Explore" className="text-heading-h2">Explore</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className="flex h-full flex-col gap-2 rounded-container border border-line-default bg-surface p-4 hover:border-line-hover focus-visible:focus-ring">
                <Icon name={c.icon} className="text-icon-brand" />
                <span className="text-label-large">{c.title}</span>
                <span className="text-body-small text-fg-secondary">{c.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
