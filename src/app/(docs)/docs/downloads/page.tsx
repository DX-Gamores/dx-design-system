import { Badge } from "@/components/ui";
import { DocHeader, Panel, PrevNext, Section } from "@/site/blocks";
import { VERSION } from "@/site/content";
import { downloadSize, downloads, downloadUrl } from "@/site/downloads";

export const metadata = { title: "Downloads" };

const base = process.env.PAGES_BASE_PATH ?? "";
const REGISTRY = "https://dx-design-system.vercel.app/r/v4";

const groups: { title: string; description: string; files: string[] }[] = [
  { title: "Tokens", description: "Generated from the Figma variables on every release. Same values in every format.", files: ["dx-tokens.css", "dx-tailwind.css", "dx-tokens.json", "dx-tokens.ts", "dx-tokens.native.ts", "dx-tokens.zip"] },
  { title: "Icons", description: "The DX icon set, drawn by Lucide. Single icons copy as SVG, JSX or React Native from the Icons page.", files: ["dx-icons-svg.zip"] },
  { title: "Starter", description: "A complete Next.js dashboard to start a project from.", files: ["dx-starter.zip"] },
];

const ai: [string, string, string][] = [
  ["llms.txt", `${base}/llms.txt`, "Index of every page with a one-line summary, for AI assistants."],
  ["llms-full.txt", `${base}/llms-full.txt`, "The whole site as one Markdown file."],
  ["Markdown pages", `${base}/md/components/button.md`, "Every page has a Markdown twin at /md/<path>.md (example: Button)."],
  ["AGENTS.dx.md", `${REGISTRY}/agents.json`, "Rules for Claude, Cursor, Copilot and Codex. Install: npx shadcn@latest add " + `${REGISTRY}/agents.json`],
  ["Registry index", `${base}/r/v4/registry.json`, "Every installable item (init, components, modules, app shell) as JSON."],
];

export default function Downloads() {
  return (
    <>
      <DocHeader eyebrow="Get started" title="Downloads" summary={`Everything in v${VERSION} as files: tokens in every format, icons, the starter app, and docs for AI assistants. No Figma seat needed.`} />
      {groups.map((g) => (
        <Section key={g.title} title={g.title} description={g.description}>
          <ul className="grid gap-3 md:grid-cols-2">
            {g.files.map((f) => {
              const d = downloads.find((x) => x.file === f)!;
              return (
                <li key={f}>
                  <Panel className="flex h-full flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-label-large">{d.title}</span>
                      <Badge>{downloadSize(d)}</Badge>
                    </div>
                    <span className="text-body-small text-fg-secondary">{d.description}</span>
                    <a className="mt-auto self-start text-label-medium text-fg-brand underline underline-offset-2 focus-visible:focus-ring" href={base + downloadUrl(f)} download>
                      {`Download ${f}`}
                    </a>
                  </Panel>
                </li>
              );
            })}
          </ul>
        </Section>
      ))}
      <Section title="For AI assistants" description="Point Claude, Cursor or Copilot at these so generated code uses DX components and tokens.">
        <ul className="flex flex-col divide-y divide-line-default rounded-container border border-line-default bg-surface">
          {ai.map(([title, href, note]) => (
            <li key={title} className="flex flex-col gap-1 p-4">
              <a className="text-label-large text-fg-brand underline underline-offset-2 focus-visible:focus-ring" href={href}>{title}</a>
              <span className="text-body-small text-fg-secondary">{note}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Offline docs" description="Each GitHub release attaches a zip of this whole site that opens without a network.">
        <p className="text-body-medium">
          <a className="text-fg-brand underline underline-offset-2 focus-visible:focus-ring" href="https://github.com/DX-Gamores/dx-design-system/releases/latest">Latest release on GitHub</a>
          <span className="text-fg-secondary"> · dx-docs-offline.zip, plus the files above</span>
        </p>
      </Section>
      <PrevNext href="/docs/downloads/" />
    </>
  );
}
