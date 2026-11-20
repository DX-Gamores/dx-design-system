import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { componentPage, componentPages, specSummary } from "@/site/content";
import { ComponentPageView } from "@/site/component-page";

type Params = { slug: string };

export const dynamicParams = false;
export const generateStaticParams = (): Params[] => componentPages.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const c = componentPage((await params).slug);
  return c ? { title: c.spec.n, description: specSummary(c.spec) } : {};
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const c = componentPage((await params).slug);
  if (!c) notFound();
  return <ComponentPageView page={c} />;
}
