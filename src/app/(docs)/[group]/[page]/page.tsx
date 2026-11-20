import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { docPages } from "@/site/content";
import { FigmaPageView } from "@/site/figma-page";

// Foundations, patterns and templates: one page per Figma page. Components have their own route (/components/<slug>/).
type Params = { group: string; page: string };
const find = (p: Params) => docPages().find((d) => d.item.href === `/${p.group}/${p.page}/`);

export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return docPages().map((d) => {
    const [, group, page] = d.item.href.split("/");
    return { group, page };
  });
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const d = find(await params);
  return d ? { title: d.item.title, description: d.figma.summary } : {};
}

export default async function FigmaMirrorPage({ params }: { params: Promise<Params> }) {
  const d = find(await params);
  if (!d) notFound();
  return <FigmaPageView item={d.item} specs={d.specs} />;
}
