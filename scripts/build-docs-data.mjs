#!/usr/bin/env node
// Data for the component pages, read from the code itself so the docs can't drift from it.
//   node scripts/build-docs-data.mjs
// Outputs (committed; CI checks they are fresh):
//   src/site/component-data.json   per component: export, import path, props (from the TypeScript types), DX tokens it uses
//   src/examples/index.ts          every example in src/examples/<slug>/*.tsx, with its title and description
//   src/site/redirects.json        v3 URL → v4 URL (used by next.config.mjs on Vercel and checked by the tests)
//   src/blocks/index.ts            every block in src/blocks/<name>/page.tsx, with its title, description and route
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const specs = JSON.parse(read("docs/components.json"));
const coded = JSON.parse(read("src/site/coded.json")).coded;

// ---------- where each export lives
const index = read("src/components/ui/index.ts");
const exportFile = new Map();
for (const m of index.matchAll(/export\s*\{([^}]+)\}\s*from\s*"\.\/([\w.-]+)"/g))
  for (const raw of m[1].split(",")) {
    const name = raw.trim().replace(/^type\s+/, "");
    if (name) exportFile.set(name, `src/components/ui/${m[2]}.tsx`);
  }
const locate = (impl) => {
  if (impl.includes(":")) {
    const [file, name] = impl.split(":");
    return { name, file: `src/components/${file}.tsx`, importPath: `@/components/${file}` };
  }
  const file = exportFile.get(impl);
  return { name: impl, file, importPath: `@/components/ui/${path.basename(file, ".tsx")}` };
};

// ---------- props from the TypeScript types
const files = [...new Set([...exportFile.values(), "src/components/app-shell.tsx"])].map((f) => path.join(root, f));
const config = ts.parseJsonConfigFileContent(JSON.parse(read("tsconfig.json")), ts.sys, root);
const program = ts.createProgram(files, { ...config.options, noEmit: true });
const checker = program.getTypeChecker();
const own = (decl) => {
  const f = decl.getSourceFile().fileName;
  return f.startsWith(path.join(root, "src")) && !f.includes("node_modules");
};

const fmt = (t) => checker.typeToString(t, undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType).replace(/import\("[^"]+"\)\./g, "").replace(/'/g, '"');
/** Readable prop type: aliases like Variant expanded to their values, long icon unions shown as IconName, no "| undefined". */
function typeText(t) {
  const alias = t.aliasSymbol?.declarations?.[0];
  if (alias && !own(alias)) return t.aliasSymbol.name; // ReactNode, CSSProperties … stay named
  if (t.isUnion()) {
    const parts = t.types.filter((x) => !(x.flags & ts.TypeFlags.Undefined));
    if (parts.length > 12 && parts.every((x) => x.isStringLiteral())) return parts.some((x) => x.value === "check") ? "IconName" : "string";
    const lits = parts.filter((x) => x.flags & ts.TypeFlags.BooleanLiteral);
    const rest = parts.filter((x) => !(x.flags & ts.TypeFlags.BooleanLiteral)).map((x) => (x.isUnion() ? typeText(x) : fmt(x)));
    return [...rest, ...(lits.length === 2 ? ["boolean"] : lits.map(fmt))].join(" | ");
  }
  return fmt(t);
}

function defaultsOf(fn) {
  const out = {};
  const param = fn?.parameters?.[0];
  if (param && ts.isObjectBindingPattern(param.name))
    for (const el of param.name.elements) if (el.initializer) out[(el.propertyName ?? el.name).getText()] = el.initializer.getText();
  return out;
}

function propsOf(file, name) {
  const sf = program.getSourceFile(path.join(root, file));
  const sym = checker.getSymbolAtLocation(sf).exports.get(name) ?? [...checker.getExportsOfModule(checker.getSymbolAtLocation(sf))].find((s) => s.name === name);
  if (!sym) return { props: [], extends: [] };
  const decl = sym.valueDeclaration ?? sym.declarations?.[0];
  let fn = decl;
  if (decl && ts.isVariableDeclaration(decl)) {
    // forwardRef(function X(props, ref) {...})
    const init = decl.initializer;
    fn = init && ts.isCallExpression(init) ? init.arguments.find((a) => ts.isFunctionExpression(a) || ts.isArrowFunction(a)) : init;
  }
  const type = checker.getTypeOfSymbolAtLocation(sym, decl);
  const sig = type.getCallSignatures()[0];
  const param = sig?.getParameters()[0];
  if (!param) return { props: [], extends: [] };
  const pType = checker.getTypeOfSymbolAtLocation(param, decl);
  const defaults = defaultsOf(fn);
  const props = [];
  const inherited = new Set();
  for (const p of pType.getProperties()) {
    const d = p.declarations?.[0];
    if (!d) continue;
    if (!own(d)) {
      const holder = d.parent && ts.isInterfaceDeclaration(d.parent) ? d.parent.name.getText() : null;
      if (holder) inherited.add(holder.replace(/<.*/, ""));
      continue;
    }
    const t = typeText(checker.getTypeOfSymbolAtLocation(p, d));
    props.push({
      name: p.name,
      type: t.length > 140 ? t.slice(0, 137) + "…" : t,
      required: !(p.flags & ts.SymbolFlags.Optional),
      default: defaults[p.name],
      description: ts.displayPartsToString(p.getDocumentationComment(checker)) || undefined,
    });
  }
  props.sort((a, b) => Number(b.required) - Number(a.required));
  const ext = [...inherited].filter((n) => /HTMLAttributes|AriaAttributes|DOMAttributes/.test(n));
  return { props, extends: ext.length ? ["Native HTML attributes of the underlying element"] : [] };
}

// ---------- DX tokens a component uses (Tailwind token utilities and var(--ds-…) in its source)
const tw = read("dist/tailwind.css");
const themeMap = new Map([...tw.matchAll(/^\s+--([\w-]+):\s*var\((--ds-[\w-]+)\);/gm)].map((m) => [m[1], m[2]]));
const textStyles = new Set([...tw.matchAll(/@utility text-([\w-]+) \{/g)].map((m) => m[1]));
const special = { "focus-ring": "--ds-shadow-focus-ring", "h-control-sm": "--ds-size-control-sm", "h-control-md": "--ds-size-control-md", "h-control-lg": "--ds-size-control-lg" };
const prefixes = { bg: "color", text: "color", border: "color", fill: "color", stroke: "color", ring: "color", outline: "color", divide: "color", accent: "color", rounded: "radius", shadow: "shadow" };

function functionSource(src, name) {
  const re = new RegExp(`^export (?:function ${name}\\b|const ${name}\\b)`, "m");
  const m = re.exec(src);
  if (!m) return "";
  const rest = src.slice(m.index + 1);
  const next = rest.search(/^export /m);
  return next === -1 ? src.slice(m.index) : src.slice(m.index, m.index + 1 + next);
}

function tokensOf(file, name) {
  const full = read(file);
  let src = functionSource(full, name);
  // also the module-level class maps and helpers the component uses (e.g. button variants, fieldBox)
  for (const m of full.matchAll(/^(?:export )?const (\w+)\b[^\n]*=/gm)) {
    if (m[1] === name || !new RegExp(`\\b${m[1]}\\b`).test(src)) continue;
    const rest = full.slice(m.index + 1);
    const end = rest.search(/^(?:export |const |function |type )/m);
    src += "\n" + (end === -1 ? full.slice(m.index) : full.slice(m.index, m.index + 1 + end));
  }
  const found = new Map();
  const add = (token, via) => { if (!found.has(token)) found.set(token, via); };
  for (const [, v] of src.matchAll(/var\((--ds-[\w-]+)\)/g)) add(v, `var(${v})`);
  for (const [, cls] of src.matchAll(/(?<![\w-])((?:[a-z-]+:)*[a-z]+(?:-[\w/.[\]-]+)+)/g)) {
    const base = cls.split(":").pop().replace(/\/\d+$/, "");
    if (special[base]) { add(special[base], base); continue; }
    if (base.startsWith("text-") && textStyles.has(base.slice(5))) { add(`text-style:${base.slice(5)}`, base); continue; }
    const [pre, ...restParts] = base.split("-");
    const key = restParts.join("-");
    const ns = prefixes[pre];
    if (!ns) continue;
    const themeKey = ns === "color" ? `color-${key}` : `${ns}-${key}`;
    if (themeMap.has(themeKey)) add(themeMap.get(themeKey), base);
  }
  return [...found].map(([token, via]) => ({ token, via })).sort((a, b) => a.token.localeCompare(b.token));
}

// ---------- write component data
const data = {};
for (const s of specs) {
  const impl = coded[s.slug];
  if (!impl) continue;
  const loc = locate(impl);
  const { props, extends: ext } = propsOf(loc.file, loc.name);
  data[s.slug] = { export: loc.name, file: loc.file, importPath: loc.importPath, props, extends: ext, tokens: tokensOf(loc.file, loc.name) };
}
fs.writeFileSync(path.join(root, "src/site/component-data.json"), JSON.stringify(data, null, 1) + "\n");

// ---------- examples index
const exDir = path.join(root, "src/examples");
const entries = [];
for (const slug of fs.existsSync(exDir) ? fs.readdirSync(exDir).filter((d) => fs.statSync(path.join(exDir, d)).isDirectory()).sort() : [])
  for (const f of fs.readdirSync(path.join(exDir, slug)).filter((f) => /^\d\d-[\w-]+\.tsx$/.test(f)).sort()) {
    const src = fs.readFileSync(path.join(exDir, slug, f), "utf8");
    const title = src.match(/@title\s+(.+)/)?.[1].trim() ?? f.replace(/^\d\d-|\.tsx$/g, "");
    const description = src.match(/@description\s+([\s\S]+?)\s*\*\//)?.[1].replace(/\s*\n\s*\*?\s*/g, " ").trim();
    const preview = src.match(/@preview\s+(\S+)/)?.[1];
    entries.push({ slug, file: `${slug}/${f}`, id: `${slug}-${f.replace(/\.tsx$/, "")}`.replace(/[^\w]/g, "_"), title, description, preview });
  }
let idx = "// Generated by scripts/build-docs-data.mjs from src/examples/<slug>/*.tsx. Do not edit by hand.\n";
idx += 'import type { ComponentType } from "react";\n';
for (const e of entries) idx += `import ${e.id} from "./${e.file.replace(/\.tsx$/, "")}";\n`;
idx += "\n/** preview: a route shown in a frame instead of rendering inline (page-level landmarks such as the app shell). */\n";
idx += "export type Example = { file: string; title: string; description?: string; preview?: string; Component: ComponentType };\n";
idx += "export const examples: Record<string, Example[]> = {\n";
for (const slug of [...new Set(entries.map((e) => e.slug))]) {
  idx += `  ${JSON.stringify(slug)}: [\n`;
  for (const e of entries.filter((x) => x.slug === slug)) idx += `    { file: ${JSON.stringify(e.file)}, title: ${JSON.stringify(e.title)}, ${e.description ? `description: ${JSON.stringify(e.description)}, ` : ""}${e.preview ? `preview: ${JSON.stringify(e.preview)}, ` : ""}Component: ${e.id} },\n`;
  idx += "  ],\n";
}
idx += "};\n";
fs.mkdirSync(exDir, { recursive: true });
fs.writeFileSync(path.join(exDir, "index.ts"), idx);
console.log(`✓ ${Object.keys(data).length} components (props, tokens) → src/site/component-data.json · ${entries.length} examples → src/examples/index.ts`);

// ---------- blocks index (src/blocks/<category>-NN/page.tsx; src/blocks/_parts/ holds parts several blocks share)
const blockCategories = [
  ["sidebar", "Sidebar", "App navigation: collapsible, icon rail, floating, inset, nested, on the right, under a sticky header."],
  ["dashboard", "Dashboard", "Overview screens with key numbers, charts, lists and tables."],
  ["auth", "Authentication", "Sign-in and sign-up screens with validation and accessible errors."],
  ["settings", "Settings", "Account, team and billing settings."],
  ["data-table", "Data table", "Tables with search, filters, sorting, selection, row actions and pagination."],
  ["empty-state", "Empty states", "Full-page empty states: first use, no results, all caught up, no access."],
];
const blDir = path.join(root, "src/blocks");
const blocks = [];
for (const name of fs.existsSync(blDir) ? fs.readdirSync(blDir).filter((d) => !d.startsWith("_") && fs.statSync(path.join(blDir, d)).isDirectory()) : []) {
  const src = fs.readFileSync(path.join(blDir, name, "page.tsx"), "utf8");
  const category = name.replace(/-\d+$/, "");
  if (!blockCategories.some(([c]) => c === category)) throw new Error(`Block ${name}: unknown category ${category}`);
  const title = src.match(/@title\s+(.+)/)?.[1].trim();
  const description = src.match(/@description\s+([\s\S]+?)\s*(?:\*\/|\* @)/)?.[1].replace(/\s*\n\s*\*?\s*/g, " ").trim();
  const route = src.match(/@route\s+(\S+)/)?.[1] ?? `/${category}`;
  const height = Number(src.match(/@height\s+(\d+)/)?.[1] ?? 720);
  if (!title || !description) throw new Error(`Block ${name}: add @title and @description to page.tsx`);
  blocks.push({ name, category, title, description, route, height });
}
const catOrder = blockCategories.map(([c]) => c);
blocks.sort((a, b) => catOrder.indexOf(a.category) - catOrder.indexOf(b.category) || a.name.localeCompare(b.name, "en", { numeric: true }));
let bidx = "// Generated by scripts/build-docs-data.mjs from src/blocks/<name>/page.tsx. Do not edit by hand.\n";
bidx += 'import type { ComponentType } from "react";\n\n';
bidx += `export const blockCategories = ${JSON.stringify(blockCategories.map(([id, title, description]) => ({ id, title, description })), null, 1)} as const;\n\n`;
bidx += "export type Block = { name: string; category: string; title: string; description: string; route: string; height: number; load: () => Promise<{ default: ComponentType }> };\n";
bidx += "export const blocks: Block[] = [\n";
for (const b of blocks) bidx += `  { ...${JSON.stringify(b)}, load: () => import("./${b.name}/page") },\n`;
bidx += "];\n";
fs.writeFileSync(path.join(blDir, "index.ts"), bidx);
console.log(`✓ ${blocks.length} blocks → src/blocks/index.ts`);

// ---------- v3 → v4 redirects (v3 had one page per Figma page; v4 has one page per component)
const ia = JSON.parse(read("src/site/ia.json"));
const slugify = (s) => s.toLowerCase().replace(/^kit · /, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const pageHref = (page) => ia.routes[page] ?? `/components/${ia.primary[page] ?? specs.find((x) => x.page === page).slug}/`;
const pages = [
  ["/start/getting-started/", "/docs/figma-to-code/"],
  ["/start/cli/", "/docs/installation/"],
  ["/start/react-native/", "/docs/react-native/"],
  ["/start/downloads/", "/docs/downloads/"],
  ["/start/changelog/", "/docs/changelog/"],
  ["/start/governance/", "/contribute/governance/"],
  ["/start/workflow/", "/contribute/workflow/"],
  ["/start/new-brand/", "/themes/adding-a-brand/"],
  ["/start/gallery/", "/components/"],
  ["/foundations/icons/", "/icons/"],
  ["/foundations/themes-and-brands/", "/themes/"],
  ...ia.groups
    .filter(([, slug]) => !["foundations", "patterns"].includes(slug))
    .flatMap(([, slug, list]) => list.filter((p) => !ia.routes[p]).map((p) => [`/${slug}/${slugify(p)}/`, pageHref(p)])),
];
const md = [...pages.map(([from, to]) => [`/md${from.replace(/\/$/, "")}.md`, `/md${to.replace(/\/$/, "")}.md`]), ["/md/index.md", "/md/docs.md"]];
fs.writeFileSync(path.join(root, "src/site/redirects.json"), JSON.stringify([...pages, ...md], null, 1) + "\n");
console.log(`✓ ${pages.length} page + ${md.length} Markdown redirects → src/site/redirects.json`);

