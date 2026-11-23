import { notFound } from "next/navigation";
import { blocks } from "@/blocks";

export const dynamicParams = false;
export const generateStaticParams = () => blocks.map((b) => ({ name: b.name }));

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const b = blocks.find((x) => x.name === name);
  return { title: b ? `${b.name} · ${b.title}` : "Block" };
}

export default async function BlockView({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const b = blocks.find((x) => x.name === name);
  if (!b) notFound();
  const { default: Block } = await b.load();
  return <Block />;
}
