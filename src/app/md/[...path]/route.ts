import { mdPages, mdPath, pageMarkdown } from "@/site/llms";

// Markdown twin of every docs page: /components/button/ → /md/components/button.md (for AI assistants and offline reading).
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => mdPages().map((href) => ({ path: `${mdPath(href)}.md`.split("/") }));

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const key = path.join("/").replace(/\.md$/, "");
  const href = mdPages().find((h) => mdPath(h) === key)!;
  return new Response(pageMarkdown(href), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
