#!/usr/bin/env node
// Builds the DX shadcn registry so any React / Next.js project can install DX as owned source:
//   npx shadcn add https://dx-design-system.vercel.app/r/v4/init.json
//   npx shadcn add @dx/button           (after adding the @dx registry to components.json)
//
//   node scripts/build-registry.mjs
// Outputs (committed; CI checks they are fresh):
//   registry.json           shadcn registry manifest (source paths), for `shadcn build` and GitHub installs
//   public/r/v4/*.json      one installable item per component, module, init and app shell, plus registry.json (index)
//
// Items
//   init            tokens (CSS, Tailwind v4 theme, TS), cn(), fonts. Install first.
//   ui-<module>     a source file from src/components/ui (components share files, e.g. form.tsx)
//   <component>     one per Figma component (63); pulls in the module that implements it
//   app-shell       AppShell, PageHeader, ThemeSwitcher (Next.js)
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const pkg = JSON.parse(read("package.json"));
const major = pkg.version.split(".")[0] === "3" ? "4" : pkg.version.split(".")[0]; // v4 is the first registry release

// Where the registry is served. One place to change when the custom domain is decided.
const HOST = process.env.DX_REGISTRY_HOST ?? "https://dx-design-system.vercel.app"; // override only for local install tests
const BASE = `${HOST}/r/v${major}`;
const url = (name) => `${BASE}/${name}.json`;

const specs = JSON.parse(read("docs/components.json"));
const coded = JSON.parse(read("src/site/coded.json")).coded;

// ---------- which file exports what (from src/components/ui/index.ts)
const index = read("src/components/ui/index.ts");
const exportFile = new Map();
for (const m of index.matchAll(/export\s*\{([^}]+)\}\s*from\s*"\.\/([\w.-]+)"/g)) {
  for (const raw of m[1].split(",")) {
    const name = raw.trim().replace(/^type\s+/, "");
    if (name) exportFile.set(name, m[2]);
  }
}

// ---------- modules: one item per src/components/ui file, with dependencies from its imports
const uiDir = "src/components/ui";
// icons.generated.tsx holds the Figma-drawn originals for reference; Icon renders Lucide (icon-map.ts), so it isn't shipped.
const skip = new Set(["index.ts", "icons.generated.tsx"]);
const moduleFiles = fs.readdirSync(path.join(root, uiDir)).filter((f) => /\.tsx?$/.test(f) && !skip.has(f)).sort();
const moduleName = (file) => `ui-${file.replace(/\.tsx?$/, "")}`;
const fileOf = (spec) => moduleFiles.find((f) => f.replace(/\.tsx?$/, "") === spec);
const npmDeps = (src) =>
  [...src.matchAll(/from\s+"([^".][^"]*)"/g)]
    .map((m) => m[1])
    .filter((s) => !s.startsWith("@/") && !s.startsWith("@dxform/") && !["react", "react-dom"].includes(s) && !s.startsWith("next/"))
    .map((s) => (s.startsWith("@") ? s.split("/").slice(0, 2).join("/") : s.split("/")[0]));

const rewrite = (src) => src.replace(/from "@dxform\/tokens"/g, 'from "@/lib/dx-tokens"');
const fileEntry = (p, type, target) => ({ path: p, type, ...(target ? { target } : {}) });

const items = [];

// init
items.push({
  name: "init",
  type: "registry:item",
  title: "DX Design System — init",
  description:
    "Installs DX tokens (CSS variables for 3 brands × 4 color modes × 2 densities, Tailwind v4 theme, shadcn/ui aliases), the cn() helper and fonts. Install this first. Set <html data-brand data-theme data-density> to switch.",
  dependencies: ["@fontsource/inter", "@fontsource/manrope", "@fontsource/poppins", "@fontsource/roboto-mono"],
  files: [
    fileEntry("src/lib/cn.ts", "registry:lib"),
    fileEntry("dist/tokens.ts", "registry:lib", "lib/dx-tokens.ts"),
    fileEntry("dist/tokens.css", "registry:file", "styles/dx-tokens.css"),
    fileEntry("dist/tailwind.css", "registry:file", "styles/dx-tailwind.css"),
  ],
  css: {
    // Brand fonts (default Inter, violet Manrope, amber Poppins) + code font. Remove the ones your brand doesn't use.
    ...Object.fromEntries(["inter", "manrope", "poppins"].flatMap((f) => [400, 500, 600, 700].map((w) => [`@import "@fontsource/${f}/${w}.css"`, {}]))),
    '@import "@fontsource/roboto-mono/400.css"': {},
    '@import "../styles/dx-tokens.css"': {},
    '@import "../styles/dx-tailwind.css"': {},
    // Unlayered and appended last, so it replaces create-next-app's Arial body rule.
    body: { background: "var(--ds-color-bg-canvas)", color: "var(--ds-color-text-primary)", "font-family": "var(--ds-font-family-body)" },
  },
  docs: 'DX installed. Set <html data-brand="default" data-theme="light" data-density="comfortable">. Docs: ' + HOST + "/start/getting-started/",
});

for (const file of moduleFiles) {
  const src = read(`${uiDir}/${file}`);
  const local = [...src.matchAll(/from\s+"\.\/([\w.-]+)"/g)].map((m) => fileOf(m[1]));
  items.push({
    name: moduleName(file),
    type: "registry:ui",
    title: `DX module · ${file}`,
    description: `Source module ${file} from src/components/ui. Installed automatically by the components that live in it.`,
    dependencies: [...new Set(npmDeps(src))],
    registryDependencies: [url("init"), ...[...new Set(local)].map((f) => url(moduleName(f)))],
    files: [fileEntry(`${uiDir}/${file}`, "registry:ui")],
  });
}

// app shell (Next.js)
const shellSrc = read("src/components/app-shell.tsx");
const shellLocal = [...shellSrc.matchAll(/from\s+"\.\/ui\/([\w.-]+)"/g)].map((m) => fileOf(m[1]));
items.push({
  name: "app-shell",
  type: "registry:component",
  title: "App shell",
  description: "AppShell (skip link, header, sidebar with nav items), PageHeader and ThemeSwitcher for Next.js App Router.",
  registryDependencies: [url("init"), ...[...new Set(shellLocal)].map((f) => url(moduleName(f)))],
  files: [fileEntry("src/components/app-shell.tsx", "registry:component")],
});

// one item per Figma component
for (const s of specs) {
  const impl = coded[s.slug];
  if (!impl) continue;
  const dep = impl.includes(":") ? url(impl.split(":")[0]) : url(moduleName(fileOf(exportFile.get(impl))));
  if (!impl.includes(":") && !exportFile.get(impl)) throw new Error(`No module exports ${impl} (${s.slug})`);
  items.push({
    name: s.slug,
    type: "registry:ui",
    title: s.n,
    description: s.d.split("\n")[0],
    registryDependencies: [dep],
    files: [],
    meta: { export: impl.split(":").pop(), figmaPage: s.page },
  });
}

// ---------- write manifest (source paths) and built items (with file contents)
const manifest = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "dx",
  homepage: HOST,
  items: items.map(({ docs, ...it }) => ({ ...it, ...(docs ? { docs } : {}) })),
};
fs.writeFileSync(path.join(root, "registry.json"), JSON.stringify(manifest, null, 2) + "\n");

const out = path.join(root, `public/r/v${major}`);
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const it of items) {
  const built = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    ...it,
    files: it.files.map((f) => ({ ...f, path: f.path.replace(/^src\/|^dist\//, ""), content: rewrite(read(f.path)) })),
  };
  fs.writeFileSync(path.join(out, `${it.name}.json`), JSON.stringify(built, null, 2) + "\n");
}
fs.writeFileSync(
  path.join(out, "registry.json"),
  JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry.json", name: "dx", homepage: HOST, items: items.map(({ files, css, docs, ...it }) => ({ ...it, files: files.map((f) => ({ path: f.path, type: f.type, ...(f.target ? { target: f.target } : {}) })) })) }, null, 2) + "\n",
);
const comps = items.filter((i) => !i.name.startsWith("ui-") && !["init", "app-shell"].includes(i.name)).length;
console.log(`✓ Registry: init + ${moduleFiles.length} modules + app-shell + ${comps} components → registry.json, public/r/v${major}/ (${BASE})`);
