import { notFound } from "next/navigation";
import { DocHeader, PrevNext } from "@/site/blocks";
import { BlockViewer } from "@/site/block-viewer";
import { blockCategories, blockFiles, blocksIn, installCommand } from "@/site/blocks-data";

export const dynamicParams = false;
export const generateStaticParams = () => blockCategories.map((c) => ({ category: c.id }));

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return { title: `${blockCategories.find((c) => c.id === category)?.title ?? "Blocks"} · Blocks` };
}

export default async function BlockCategory({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = blockCategories.find((c) => c.id === category);
  if (!cat) notFound();
  const list = blocksIn(cat.id);
  const base = process.env.PAGES_BASE_PATH ?? "";
  const withFiles = await Promise.all(list.map(async (b) => ({ ...b, files: await blockFiles(b.name) })));
  return (
    <>
      <DocHeader eyebrow="Blocks" title={cat.title} summary={`${cat.description} ${list.length} block${list.length === 1 ? "" : "s"}.`} />
      <h2 className="sr-only">{cat.title} blocks</h2>
      {withFiles.map((b) => (
        <BlockViewer key={b.name} name={b.name} title={b.title} description={b.description} src={`${base}/view/${b.name}/`} height={b.height} files={b.files} install={installCommand(b.name)} />
      ))}
      <PrevNext href={`/blocks/${cat.id}/`} />
    </>
  );
}
