import { downloads } from "@/site/downloads";

// Static files for the Downloads page, generated at build time from the repo.
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => downloads.map((d) => ({ file: d.file }));

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const d = downloads.find((x) => x.file === file)!;
  const body = d.build();
  return new Response(typeof body === "string" ? body : new Uint8Array(body), {
    headers: {
      "Content-Type": d.type,
      ...(d.type === "application/zip" ? { "Content-Disposition": `attachment; filename="${d.file}"` } : {}),
    },
  });
}
