import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Badge, Icon } from "@/components/ui";
import { examples } from "@/examples";
import { a11y } from "./a11y";
import { releases } from "./changelog";
import componentData from "./component-data.json";
import { coded, docFrames, figmaComponent, figmaPage, figmaUrl, REPO, specBody, specSummary, type ComponentPage } from "./content";
import { DocHeader, FigmaFrame, Panel, PrevNext, Section } from "./blocks";
import { highlight } from "./highlight";
import { rnPath } from "./token-paths";
import { CodeBlock, CopyButton, ExamplePreview, InstallTabs } from "./preview";
import registry from "../../registry.json";

type Prop = { name: string; type: string; required: boolean; default?: string; description?: string };
type Data = { export: string; file: string; importPath: string; props: Prop[]; extends: string[]; tokens: { token: string; via: string }[] };
const data = componentData as Record<string, Data>;
const REGISTRY = "https://dx-design-system.vercel.app/r/v4";
const base = process.env.PAGES_BASE_PATH ?? "";

/** Example source as shown on the site: without the doc comment and the "use client" line. */
function exampleSource(file: string) {
  return fs
    .readFileSync(path.join(process.cwd(), "src/examples", file), "utf8")
    .replace(/^\/\*\*[\s\S]*?\*\/\s*/, "")
    .replace(/^"use client";\s*/m, "")
    .trim();
}

const tokenCss = (t: string) => (t.startsWith("text-style:") ? `.ds-${t.slice(11)}` : `var(${t})`);

function installPanels(slug: string, d: Data) {
  const items = registry.items as { name: string; files: { path: string }[]; dependencies?: string[]; registryDependencies?: string[] }[];
  const mod = items.find((i) => i.name === `ui-${path.basename(d.file, ".tsx")}`) ?? items.find((i) => i.name === "app-shell");
  const deps = new Set<string>();
  const files: string[] = [];
  const walk = (name: string) => {
    const it = items.find((i) => i.name === name);
    if (!it || files.includes(it.files[0]?.path)) return;
    it.files.forEach((f) => files.push(f.path));
    it.dependencies?.forEach((x) => deps.add(x));
    it.registryDependencies?.forEach((u) => walk(u.split("/").pop()!.replace(/\.json$/, "")));
  };
  if (mod) walk(mod.name);
  return { files: files.filter(Boolean), deps: [...deps] };
}

export async function ComponentPageView({ page }: { page: ComponentPage }) {
  const { spec, slug, category, figmaPage: figmaPageName, siblings } = page;
  const d = data[slug];
  const ex = examples[slug] ?? [];
  const fig = figmaPage(figmaPageName);
  const frames = docFrames(figmaPageName);
  const figComp = figmaComponent(spec.n);
  const acc = a11y[slug];
  const isCoded = coded.has(slug);
  const mentions = releases.filter((r) => new RegExp(`\\b${spec.n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(`${r.title} ${r.notes}`));
  const when = spec.d.match(/WHEN:\s*([^\n]+)/)?.[1];

  const exHtml = await Promise.all(ex.map(async (e) => { const code = exampleSource(e.file); return { ...e, code, html: await highlight(code) }; }));
  const [first, ...rest] = exHtml;

  const cliCmd = `npx shadcn@latest add @dx/${slug}`;
  const urlCmd = `npx shadcn@latest add ${REGISTRY}/${slug}.json`;
  const importLine = d ? `import { ${d.export} } from "${d.importPath}";` : "";
  const inst = d ? installPanels(slug, d) : { files: [], deps: [] };
  const manualSteps = d
    ? [
        inst.deps.length ? `npm i ${inst.deps.join(" ")}` : null,
        `# Copy into your project (same paths):\n${inst.files.map((f) => `#   ${f.replace(/^src\//, "")}`).join("\n")}`,
      ].filter(Boolean).join("\n\n")
    : "";

  return (
    <>
      <DocHeader eyebrow={`Components · ${category.title}`} title={spec.n} summary={specSummary(spec)}>
        {isCoded ? <Badge tone="success">Stable</Badge> : <Badge>Spec only</Badge>}
        <Badge>{`${spec.vc} variant${spec.vc === 1 ? "" : "s"} in Figma`}</Badge>
        <a href={figmaUrl(figComp?.id ?? fig?.id)} className="inline-flex h-control-sm items-center gap-1.5 rounded-control border border-line-strong bg-surface px-3 text-label-small hover:bg-neutral-hover focus-visible:focus-ring">
          Figma <Icon name="external-link" size={16} />
        </a>
        {d && (
          <a href={`${REPO}/blob/main/${d.file}`} className="inline-flex h-control-sm items-center gap-1.5 rounded-control border border-line-strong bg-surface px-3 text-label-small hover:bg-neutral-hover focus-visible:focus-ring">
            Source <Icon name="external-link" size={16} />
          </a>
        )}
        <a href={`${process.env.PAGES_BASE_PATH ?? ""}/md/components/${slug}.md`} className="inline-flex h-control-sm items-center gap-1.5 rounded-control border border-line-strong bg-surface px-3 text-label-small hover:bg-neutral-hover focus-visible:focus-ring">
          Markdown <Icon name="file" size={16} />
        </a>
      </DocHeader>

      {first && <h2 id="preview" data-toc="Preview" className="sr-only">Preview</h2>}
      {first && (
        <ExamplePreview title="" code={first.code} codeHtml={first.html} minHeight={220} frameSrc={first.preview && base + first.preview}>
          {!first.preview && <first.Component />}
        </ExamplePreview>
      )}

      {d && (
        <Section title="Installation" description="Copies the source into components/ui/ in your project, with the files it needs. Install @dx/init once first.">
          <InstallTabs
            cli={
              <div className="flex flex-col gap-3">
                <CodeBlock code={cliCmd} html={await highlight(cliCmd, "bash")} />
                <p className="text-body-small text-fg-secondary">
                  Needs the <code className="text-code-small">@dx</code> registry in <code className="text-code-small">components.json</code> (<Link className="text-fg-brand underline underline-offset-2" href="/docs/installation/">setup</Link>). Without it:
                </p>
                <CodeBlock code={urlCmd} html={await highlight(urlCmd, "bash")} />
              </div>
            }
            manual={<CodeBlock code={manualSteps} html={await highlight(manualSteps, "bash")} />}
          />
        </Section>
      )}

      {d && (
        <Section title="Usage">
          <CodeBlock code={importLine} html={await highlight(importLine)} />
        </Section>
      )}

      {rest.length > 0 && (
        <Section title="Examples" description="Every example is real code from src/examples. Use the width and dark-mode buttons to check it on a phone or at night.">
          <div className="flex flex-col gap-10">
            {rest.map((e) => (
              <ExamplePreview key={e.file} title={e.title} description={e.description} code={e.code} codeHtml={e.html} frameSrc={e.preview && base + e.preview}>
                {!e.preview && <e.Component />}
              </ExamplePreview>
            ))}
          </div>
        </Section>
      )}

      {when && (
        <Section title="When to use">
          <p className="max-w-[72ch] text-body-medium">{when}</p>
        </Section>
      )}

      {(frames.anatomy || frames.states) && (
        <Section title="Anatomy" description={`From the ${figmaPageName} page in Figma.`}>
          {frames.anatomy && <FigmaFrame nodeId={frames.anatomy.id} title={`${figmaPageName}: anatomy`} w={frames.anatomy.w} h={frames.anatomy.h} />}
          {frames.states && <FigmaFrame nodeId={frames.states.id} title={`${figmaPageName}: states`} w={frames.states.w} h={frames.states.h} />}
        </Section>
      )}

      {(frames.doDont ?? fig?.doDont) && (
        <Section id="do-dont" title="Do & don’t">
          <FigmaFrame nodeId={(frames.doDont ?? fig.doDont)!.id} title={`${figmaPageName}: do and don’t`} w={(frames.doDont ?? fig.doDont)!.w} h={(frames.doDont ?? fig.doDont)!.h} />
        </Section>
      )}

      {d && (
        <Section title="API" description={`Props of ${d.export}, read from its TypeScript types.${d.extends.length ? " It also takes the native HTML attributes of the element it renders." : ""}`}>
          {d.props.length ? (
            <div className="overflow-x-auto rounded-container border border-line-default">
              <table className="w-full text-body-small">
                <caption className="sr-only">{`${d.export} props`}</caption>
                <thead className="bg-surface-subtle text-left text-label-small">
                  <tr><th scope="col" className="px-3 py-2">Prop</th><th scope="col" className="px-3 py-2">Type</th><th scope="col" className="px-3 py-2">Default</th></tr>
                </thead>
                <tbody>
                  {d.props.map((p) => (
                    <tr key={p.name} className="border-t border-line-default align-top">
                      <td className="px-3 py-2"><code className="text-code-small">{p.name}</code>{p.required && <span className="ms-1 text-caption-default text-fg-danger">required</span>}{p.description && <p className="mt-1 text-caption-default text-fg-secondary">{p.description}</p>}</td>
                      <td className="px-3 py-2"><code className="text-code-small break-words text-fg-secondary">{p.type}</code></td>
                      <td className="px-3 py-2">{p.default ? <code className="text-code-small">{p.default}</code> : <span className="text-fg-secondary">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-body-medium text-fg-secondary">{d.export} is used through its parent component; see the examples above.</p>
          )}
        </Section>
      )}

      {d && d.tokens.length > 0 && (
        <Section title="Tokens" description="DX tokens this component reads. Re-brand it by changing these at the Brand or Semantic tier, never in the component.">
          <div className="overflow-x-auto rounded-container border border-line-default">
            <table className="w-full text-body-small">
              <caption className="sr-only">{`Tokens used by ${spec.n}`}</caption>
              <thead className="bg-surface-subtle text-left text-label-small">
                <tr><th scope="col" className="px-3 py-2">CSS</th><th scope="col" className="px-3 py-2">Tailwind</th><th scope="col" className="px-3 py-2">React Native</th></tr>
              </thead>
              <tbody>
                {d.tokens.map((t) => (
                  <tr key={t.token} className="border-t border-line-default">
                    <td className="px-3 py-1.5"><span className="flex items-center gap-1"><code className="text-code-small">{tokenCss(t.token)}</code><CopyButton text={tokenCss(t.token)} label="Copy" className="ms-auto" /></span></td>
                    <td className="px-3 py-1.5"><code className="text-code-small text-fg-secondary">{t.via.startsWith("var(") ? "—" : t.via}</code></td>
                    <td className="px-3 py-1.5"><code className="text-code-small text-fg-secondary">{rnPath(t.token) ?? "—"}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {acc && (
        <Section title="Accessibility" description={acc.pattern ? `Follows the WAI-ARIA ${acc.pattern} pattern. Checked with axe (WCAG 2.2 AA) in light and dark on every build.` : "Checked with axe (WCAG 2.2 AA) in light and dark on every build."}>
          {acc.keyboard.length > 0 && (
            <div className="overflow-x-auto rounded-container border border-line-default">
              <table className="w-full text-body-small">
                <caption className="sr-only">Keyboard</caption>
                <thead className="bg-surface-subtle text-left text-label-small"><tr><th scope="col" className="w-48 px-3 py-2">Key</th><th scope="col" className="px-3 py-2">Does</th></tr></thead>
                <tbody>{acc.keyboard.map(([k, v]) => <tr key={k} className="border-t border-line-default"><td className="px-3 py-2"><kbd className="rounded-sm border border-line-default bg-surface px-1.5 font-mono text-code-small">{k}</kbd></td><td className="px-3 py-2">{v}</td></tr>)}</tbody>
              </table>
            </div>
          )}
          <ul className="flex list-disc flex-col gap-1 ps-6 text-body-medium">{[...acc.aria, ...(acc.notes ?? [])].map((a) => <li key={a} className="max-w-[72ch]">{a}</li>)}</ul>
        </Section>
      )}

      {d && d.tokens.some((t) => rnPath(t.token)) && (
        <Section title="Mobile" description="React Native apps share DX tokens, not components. Build the native equivalent from the same theme values.">
          <CodeBlock
            code={`import { createTheme } from "./tokens.native";\nconst theme = createTheme({ brand: "default", mode: "light" });\n\n// ${spec.n}\n${d.tokens.filter((t) => rnPath(t.token)).slice(0, 8).map((t) => `${rnPath(t.token)}  // ${tokenCss(t.token)}`).join("\n")}`}
            html={await highlight(`import { createTheme } from "./tokens.native";\nconst theme = createTheme({ brand: "default", mode: "light" });\n\n// ${spec.n}\n${d.tokens.filter((t) => rnPath(t.token)).slice(0, 8).map((t) => `${rnPath(t.token)}  // ${tokenCss(t.token)}`).join("\n")}`, "ts")}
          />
          <p className="text-body-small text-fg-secondary"><Link className="text-fg-brand underline underline-offset-2" href="/docs/react-native/">React Native setup</Link></p>
        </Section>
      )}

      <Section title="Figma spec" description="The component's properties and notes as written in Figma.">
        <Panel>
          <div className="ds-prose" dangerouslySetInnerHTML={{ __html: specBody(slug) }} />
        </Panel>
      </Section>

      {siblings.length > 0 && (
        <Section title="Related" description={`Also on the ${figmaPageName} page in Figma.`}>
          <ul className="flex flex-wrap gap-2">
            {siblings.map((s) => (
              <li key={s.slug}><Link href={`/components/${s.slug}/`} className="inline-flex h-control-sm items-center rounded-control border border-line-default bg-surface px-3 text-label-small hover:bg-neutral-hover focus-visible:focus-ring">{s.n}</Link></li>
            ))}
          </ul>
        </Section>
      )}

      {mentions.length > 0 && (
        <Section title="Changelog">
          <ul className="flex flex-col gap-2">{mentions.map((r) => <li key={r.v} className="text-body-small"><Badge>{`v${r.v}`}</Badge> <span className="ms-2">{r.title}</span></li>)}</ul>
        </Section>
      )}

      <PrevNext href={page.href} />
    </>
  );
}
