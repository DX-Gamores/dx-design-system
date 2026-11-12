import { notFound } from "next/navigation";
import { AcmeShell } from "@/templates/shell";
import { EmptyScreen } from "@/templates/empty";
import { scenarios } from "@/templates/empty-data";

export function generateStaticParams() { return scenarios.map((s) => ({ scenario: s.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ scenario: string }> }) {
  const { scenario } = await params; return { title: scenarios.find((s) => s.slug === scenario)?.name ?? "Empty state" };
}
export default async function Page({ params }: { params: Promise<{ scenario: string }> }) {
  const { scenario } = await params;
  const s = scenarios.find((x) => x.slug === scenario);
  if (!s) notFound();
  return <AcmeShell><EmptyScreen scenario={s} /></AcmeShell>;
}
