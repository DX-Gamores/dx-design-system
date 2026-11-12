import { notFound } from "next/navigation";
import { AcmeShell } from "@/templates/shell";
import { MembersTemplate, type MembersState } from "@/templates/members";

const states = ["empty", "loading", "error"] as const;
export function generateStaticParams() { return states.map((state) => ({ state })); }
export async function generateMetadata({ params }: { params: Promise<{ state: string }> }) { const { state } = await params; return { title: `Members · ${state}` }; }

export default async function Page({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  if (!states.includes(state as never)) notFound();
  return <AcmeShell><MembersTemplate state={state as MembersState} /></AcmeShell>;
}
