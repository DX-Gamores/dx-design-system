import { docFile, renderMarkdown, REPO } from "./content";
import { DocHeader, Markdown, PrevNext } from "./blocks";

/** A Start-here page rendered from a Markdown file in docs/, so the repo and the site never disagree. */
export function MdPage({ file, href, title, summary, before = "" }: { file: string; href: string; title: string; summary: string; before?: string }) {
  const body = docFile(file).replace(/^# .*\n+/, "");
  return (
    <>
      <DocHeader eyebrow="Start here" title={title} summary={summary}>
        <a href={`${REPO}/blob/main/${file}`} className="text-label-small text-fg-brand underline underline-offset-2 focus-visible:focus-ring">View {file} on GitHub</a>
      </DocHeader>
      <Markdown html={renderMarkdown(before + body)} />
      <PrevNext href={href} />
    </>
  );
}
