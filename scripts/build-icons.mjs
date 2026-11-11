#!/usr/bin/env node
// Turns figma/icons.json (exported from the Icons page) into a typed React icon set.
//   node scripts/build-icons.mjs  →  src/components/ui/icons.generated.tsx
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const icons = JSON.parse(fs.readFileSync(path.join(root, "figma/icons.json"), "utf8"));
const key = (n) => n.toLowerCase().replace(/\s+/g, "-");
const jsx = (svg) =>
  svg
    .replace(/stroke-width/g, "strokeWidth")
    .replace(/stroke-linecap/g, "strokeLinecap")
    .replace(/stroke-linejoin/g, "strokeLinejoin")
    .replace(/fill-rule/g, "fillRule")
    .replace(/clip-rule/g, "clipRule")
    .replace(/\s+/g, " ")
    .trim();

const names = Object.keys(icons).map(key);
let out = `// Generated from the Figma Icons page by scripts/build-icons.mjs. Do not edit by hand.\n// 24×24 grid, 2px round stroke, colour = currentColor.\nimport type { ReactElement } from "react";\n\nexport const iconNames = ${JSON.stringify(names)} as const;\nexport type IconName = (typeof iconNames)[number];\n\nexport const iconPaths: Record<IconName, ReactElement> = {\n`;
for (const [n, svg] of Object.entries(icons)) out += `  "${key(n)}": <>${jsx(svg)}</>,\n`;
out += "};\n";
fs.mkdirSync(path.join(root, "src/components/ui"), { recursive: true });
fs.writeFileSync(path.join(root, "src/components/ui/icons.generated.tsx"), out);
console.log(`✓ ${names.length} icons → src/components/ui/icons.generated.tsx`);
