import fs from "node:fs";
import path from "node:path";
import { blockCategories, blocks } from "@/blocks";
import { highlight } from "./highlight";
import type { BlockFile } from "./block-viewer";

export { blockCategories, blocks };
export const blocksIn = (category: string) => blocks.filter((b) => b.category === category);
export const installCommand = (name: string) => `npx shadcn@latest add @dx/${name}`;

/** The files a block installs, exactly as the registry serves them (imports already point at @/components/…). */
export async function blockFiles(name: string): Promise<BlockFile[]> {
  const item = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/r/v4", `${name}.json`), "utf8")) as { files: { target: string; content: string }[] };
  return Promise.all(item.files.map(async (f) => ({ target: f.target, code: f.content, html: await highlight(f.content, f.target.endsWith(".ts") ? "ts" : "tsx") })));
}
