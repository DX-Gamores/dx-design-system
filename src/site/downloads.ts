// Everything on the Downloads page, built from the repo at build time (no hand-made zips to go stale).
// Served at /downloads/<file> by src/app/downloads/[file]/route.ts.
import fs from "node:fs";
import path from "node:path";
import * as lucide from "lucide-static";
import lucideNames from "./lucide-names.json";
import { zip, type ZipEntry } from "./zip";

const root = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(root, p));
const VERSION: string = JSON.parse(read("package.json").toString()).version;
const HOST = "https://dx-design-system.vercel.app";

const walk = (dir: string): string[] =>
  fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((e) => {
    const p = `${dir}/${e.name}`;
    return e.isDirectory() ? walk(p) : [p];
  });

/** DX icon name → SVG (Lucide, ISC), without Lucide's class attribute. */
export function iconSvg(name: string) {
  const exp = (lucideNames as Record<string, string>)[name];
  const svg = (lucide as unknown as Record<string, string>)[exp];
  return svg.replace(/\s*class="[^"]*"/, "").trim() + "\n";
}

const licence = `Icons are drawn by Lucide (https://lucide.dev), ISC licence:
Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT).
All other copyright (c) for Lucide are held by Lucide Contributors 2022.
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted,
provided that the above copyright notice and this permission notice appear in all copies.
`;

const starterReadme = `# DX starter (v${VERSION})

A sidebar dashboard built only from DX tokens and components (Next.js App Router, Tailwind CSS v4).

1. npx create-next-app@latest my-app --ts --tailwind --app --src-dir --import-alias "@/*"
2. Copy the src/ folder from this zip over my-app/src/ (it adds components/, lib/, styles/, app/starter/ and app/fonts.ts).
3. npm i lucide-react @fontsource/inter @fontsource/manrope @fontsource/poppins @fontsource/roboto-mono
4. In src/app/globals.css, after @import "tailwindcss"; add:
     @import "../styles/dx-tokens.css";
     @import "../styles/dx-tailwind.css";
5. In tsconfig.json → compilerOptions.paths add: "@dxform/tokens": ["./src/lib/dx-tokens.ts"]
6. In src/app/layout.tsx: import "./fonts"; and set <html data-brand="default" data-theme="light" data-density="comfortable">
7. npm run dev → http://localhost:3000/starter

Prefer the CLI for single components: ${HOST}/start/cli/
`;

type Download = { file: string; title: string; description: string; type: string; build: () => Buffer | string };

export const downloads: Download[] = [
  { file: "dx-tokens.css", title: "CSS variables", description: "Every token: 3 brands × 4 color modes × 2 densities, motion, layout, text-style classes and shadcn aliases.", type: "text/css", build: () => read("dist/tokens.css") },
  { file: "dx-tailwind.css", title: "Tailwind v4 theme", description: "@theme mapping and utilities (bg-surface, text-fg-secondary, rounded-control, text-heading-h1). Import after the CSS variables.", type: "text/css", build: () => read("dist/tailwind.css") },
  { file: "dx-tokens.json", title: "Design tokens (DTCG)", description: "W3C Design Tokens format with every Figma mode, for Style Dictionary, Terrazzo, Tokens Studio or your own build.", type: "application/json", build: () => read("tokens/tokens.json") },
  { file: "dx-tokens.ts", title: "TypeScript helpers", description: "Brand, theme and density lists, chart colors as CSS variables, readToken().", type: "text/plain", build: () => read("dist/tokens.ts") },
  { file: "dx-tokens.native.ts", title: "React Native theme", description: "Every token resolved to hex and numbers, createTheme({ brand, mode, density }). No dependencies.", type: "text/plain", build: () => read("dist/tokens.native.ts") },
  {
    file: "dx-tokens.zip",
    title: "All tokens",
    description: "The five files above in one zip.",
    type: "application/zip",
    build: () =>
      zip([
        { name: "dx-tokens/tokens.css", data: read("dist/tokens.css") },
        { name: "dx-tokens/tailwind.css", data: read("dist/tailwind.css") },
        { name: "dx-tokens/tokens.json", data: read("tokens/tokens.json") },
        { name: "dx-tokens/tokens.ts", data: read("dist/tokens.ts") },
        { name: "dx-tokens/tokens.native.ts", data: read("dist/tokens.native.ts") },
      ]),
  },
  {
    file: "dx-icons-svg.zip",
    title: "Icons (SVG)",
    description: "The DX icon set as 24×24 SVG files with 2px stroke in currentColor, named as in code (check.svg, arrow-right.svg).",
    type: "application/zip",
    build: () => zip([...Object.keys(lucideNames).map((n) => ({ name: `dx-icons/${n}.svg`, data: iconSvg(n) })), { name: "dx-icons/LICENSE.txt", data: licence }]),
  },
  {
    file: "dx-starter.zip",
    title: "Starter app",
    description: "Sidebar dashboard (app shell, stat cards, chart, members, empty states) with every DX component. Steps in README.md.",
    type: "application/zip",
    build: () => {
      const files: ZipEntry[] = [
        ...walk("src/components").filter((f) => !f.endsWith("icons.generated.tsx")).map((f) => ({ name: `dx-starter/${f}`, data: read(f) })),
        ...walk("src/app/starter").map((f) => ({ name: `dx-starter/${f}`, data: read(f) })),
        { name: "dx-starter/src/app/fonts.ts", data: read("src/app/fonts.ts") },
        { name: "dx-starter/src/lib/cn.ts", data: read("src/lib/cn.ts") },
        { name: "dx-starter/src/lib/dx-tokens.ts", data: read("dist/tokens.ts") },
        { name: "dx-starter/src/styles/dx-tokens.css", data: read("dist/tokens.css") },
        { name: "dx-starter/src/styles/dx-tailwind.css", data: read("dist/tailwind.css") },
        { name: "dx-starter/README.md", data: starterReadme },
      ];
      return zip(files);
    },
  },
];

export const downloadUrl = (file: string) => `/downloads/${file}`;
export const downloadSize = (d: Download) => {
  const b = Buffer.byteLength(d.build());
  return b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;
};
