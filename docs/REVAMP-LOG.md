# DX Design System v4 revamp — progress log

The plan lives in the **DX Design System — Revamp & Improvement Plan** doc (Claude artifact). This file is the code-side record: every work session adds one entry at the top, so anyone can see what changed and where we left off.

**Maintainers:** Gab (design lead, only Figma editor) and Claude.
**Phases:** 0 Quick wins → 1 Distribution → 2 Site redesign → 3 Blocks + theme builder → 4 Figma and launch.

> **Important: every entry ends with a Cleanup line.** A session isn't finished until it has followed [docs/CLEANUP.md](CLEANUP.md): tokens revoked, merged branches deleted, scratch and build output removed, old links replaced. Write down what was cleaned up and what is left for Gab.

## Where we left off

- Phase: **3b · Theme builder — code complete on `revamp/phase-3b`** (see the 2026-11-23 · Phase 3b entry). With it, Phase 3 is done: Blocks (3a, PR #7) are merged and live.
- **Gate G3:** the made-up pilot brand **Mangrove** passes all 27 contrast pairs in light, dark, light-hc and dark-hc (108/108) and installs as `@dx/theme-mangrove`. A real client brand can be added the same way (builder → "Add to the gallery").
- CI's freshness check now covers `src/blocks/index.ts` (Gab edited `.github/workflows/ci.yml` on GitHub, commit `60da0c7`); everything the theme work generates is under `dist/` and `public/r/`, which it also checks.
- Waiting on network permission: `ui.shadcn.com` and `*.vercel.app` (real CLI test from the AI session). `www.figma.com` is blocked for the AI session, so image refreshes run from Gab's Mac with a script.
- Still open: DX custom icons Lucide lacks; custom domain; brand guide and logo; moving the 3 working pages to a "DX Workshop" Figma file; a "DX Blocks & Templates" Figma file; importing gallery brands into Figma (Phase 4).
- Next up: Phase 4 · Figma and launch (code syntax on variables, variant cleanup, Blocks page in Figma, Project Starter, v4.0.0).

---

## 2026-11-23 · Phase 3b · Theme builder and brand gallery

**Decisions (Gab):** the G3 pilot brand is made up for now (Mangrove: green #2f7d4f, amber accent, stone neutrals, Plus Jakarta Sans, large corners).

**Code (branch `revamp/phase-3b`, on top of `main` ca6ccbc)**

| Change | Files |
| --- | --- |
| Theme engine (pure TypeScript, no imports): OKLCH ramps that hold the seed colour exactly, sRGB gamut mapping, role picking that fixes its own contrast (dark text on light brands, a darker focus ring, a 7:1 step for high contrast), the 27-pair audit in all four modes resolved from the Figma variables, and outputs (CSS, DTCG/Figma, React Native), share-link encoding | `src/lib/theme/engine.ts` |
| Theme builder page: start from a brand, name, primary, accent (ramp or hex), neutrals (gray / slate / zinc / stone / neutral / tinted), heading and body font (10 Fontsource families), control and card corners, density; live contrast badge and notes, ramps with role markers, a preview in all four modes, contrast details per mode, exports (install, CSS, Tokens · Figma, React Native, settings), share link, "Add to the gallery" (pre-filled `themes/<brand>.json` on GitHub) | `src/site/theme-builder.tsx`, `src/site/theme-presets.ts`, `src/app/(docs)/themes/builder/page.tsx` |
| Brand gallery: `themes/*.json` → `npm run brands` → `dist/brands/<slug>.css/.tokens.json/.native.ts`, `dist/brands.css`, `gallery.json`; **fails the build if a brand doesn't pass 108/108** | `themes/`, `scripts/build-brands.mjs`, `package.json` (`brands`, in `build:all`) |
| Registry: `@dx/theme-<brand>` items (brand CSS → `styles/`, React Native → `lib/`, DTCG → `tokens/`, Fontsource dependency and CSS imports); brand CSS uses `:root[data-brand]` so it wins over the default brand wherever it's imported | `scripts/build-registry.mjs`, `public/r/v4/theme-mangrove.json` |
| Site: Theme builder and Brand gallery pages and nav, wide layout for the builder, gallery brands in Customize and across the site, `?brand=` / `?theme=` / `?density=` on block previews, Markdown twins, AGENTS.md and "Adding a brand" lead with the builder | `src/app/(docs)/themes/gallery/page.tsx`, `src/site/customize.tsx`, `src/site/content.ts`, `src/site/docs-shell.tsx`, `src/site/view-params.tsx`, `src/app/view/layout.tsx`, `src/app/globals.css`, `src/app/fonts.ts`, `src/site/llms.ts`, `docs/NEW-BRAND.md`, `docs/AGENTS.md` |
| Tests: engine (ramps hold the seed and darken step by step; 27 sample brand/neutral combinations pass 108/108; dark text on light brands; share links round-trip), G3 (every gallery brand 108/108; `theme-mangrove` registry item; axe on a dashboard block in Mangrove in all four modes), builder (light primary flips to dark text; share link restores settings; "Add to the gallery" link), gallery page | `tests/themes.spec.ts` |

**Verified:** `npm run build:all` (no diff after commit), `npm run check`, `npm run build:pages`, functional tests (see PR), axe on the builder and gallery pages in light and dark. `@dx/init` + `@dx/theme-mangrove` installed from the registry JSON into an empty project: files land in `styles/`, `lib/`, `tokens/`, the React Native file type-checks.

**Not done / notes**

- Built-in presets in the builder are regenerated from a seed, so they are close to Default / Violet / Amber but not identical; the gallery page shows the real built-in ramps.
- Figma import of a gallery brand is manual for now (DTCG export + a variables plugin, or Claude with `use_figma` once Gab says go).
- Fonts outside the 10 offered need a licence from the client; add them to `FONTS` in the engine and as a Fontsource dependency.

**Cleanup:** screenshots and the install simulation are in the AI session's scratch space, outside the repo; no credentials used. Left for Gab: delete branches `revamp/phase-3a` and `revamp/cleanup-process` on GitHub if still there.

---

## 2026-11-23 · Phase 3a · Blocks

**Decisions (Gab):** Phase 3 in two PRs (Blocks first); keep the planned mix of 31 blocks; the G3 pilot brand is made up for now.

**Code (branch `revamp/phase-3a`, on top of `main` b87a915)**

| Change | Files |
| --- | --- |
| Composable Sidebar (shadcn part names, DX tokens): provider with Ctrl/⌘ + B, `sidebar` / `floating` / `inset` variants, `offcanvas` / `icon` (72px rail) / `none`, left or right, a modal drawer with Close on phones, tooltips in the rail, `useDisclosure` for collapsible rows. Desktop sidebar is an `<aside>` landmark | `src/components/ui/sidebar.tsx`, `src/components/ui/index.ts` |
| Menu: `top-start`, `top-end`, `right-end` placements and a wrapper `className`; Dialog `size="lg"`; Table scroll box is `relative` so screen-reader-only text can't widen the page | `src/components/ui/overlays.tsx`, `src/components/ui/data.tsx` |
| 31 blocks: 16 sidebars, 4 dashboards (incl. a field-operations one), 3 auth, 2 settings, 2 data tables, 4 empty states. Shared parts (nav, team switcher, account menu, SVG charts…) live once in `_parts` | `src/blocks/<name>/`, `src/blocks/_parts/` |
| Blocks index generated from each page's `@title` / `@description` / `@route` | `scripts/build-docs-data.mjs` → `src/blocks/index.ts` |
| `@dx/<block>` registry items (`registry:block`): page → `app/<route>/page.tsx`, parts → `components/`, imports rewritten to `@/components/…`, dependencies collected from imports | `scripts/build-registry.mjs`, `public/r/v4/<block>.json` |
| Site: Blocks in the header and sidebar, `/blocks/` (install steps + categories), `/blocks/<category>/` with a block viewer (Preview at desktop / 834 / 390, dark toggle for the frame only, open in new tab; Code shows every installed file; copy install command), full-page previews at `/view/<block>/`, wider layout on Blocks pages, Blocks card on the home page, Markdown twins + llms.txt | `src/site/block-viewer.tsx`, `src/site/blocks-data.ts`, `src/app/(docs)/blocks/`, `src/app/view/`, `src/site/content.ts`, `src/site/docs-shell.tsx`, `src/site/llms.ts`, `src/app/(docs)/page.tsx` |
| Sidebar component page: a second example with the composable parts; AGENTS.md tells assistants to start screens from a block | `src/examples/sidebar/02-composable.tsx`, `docs/AGENTS.md` |
| Tests: block counts, every block self-contained in the registry, gallery and viewer, Ctrl+B / rail, disclosure, phone drawer (Esc returns focus), table search/select, auth errors. Every `/view/<block>/` also runs through axe (light + dark), links and 390px | `tests/blocks.spec.ts`, `tests/registry.spec.ts`, `package.json` |

**Verified:** `npm run build:all` (no diff after commit), `npm run check` (parity 63/63, 11/11), `npm run build:pages`, functional tests (see PR), axe WCAG 2.2 light + dark on all 31 block pages, no sideways scroll at 390px. Each block was also installed on its own into an empty project from its registry JSON (all dependencies resolved) and type-checked: 31/31 clean. Screens checked at 1280 and 390, light and dark, expanded / icon rail / drawer.

**Not done / notes**

- CI's "generated files are fresh" check didn't list `src/blocks/index.ts` at merge time (workflow edits need the `workflow` scope). Fixed afterwards in `60da0c7`.
- Visual regression doesn't cover blocks yet (would add 31 baselines); add after the Figma "DX Blocks & Templates" file exists.
- Sidebar component page still documents the AppShell as its main example; the composable Sidebar is the second example.
- Real `npx shadcn add @dx/<block>` from the AI session still needs `ui.shadcn.com`; the install simulation above covers file layout and imports.

**Cleanup:** screenshots and the install simulation live outside the repo in the AI session's scratch space; no credentials used. Left for Gab: delete branch `revamp/cleanup-process` (its one unmerged log line, the Figma "Docs site →" badge note, is already in this log under Phase 1), revoke the `workflow` scope on the `gh` login if not needed.

---

## 2026-11-20 · Figma images for component and pattern pages

**Code (branch `revamp/figma-images`, on top of `main` 5330c1b)**

| Change | Files |
| --- | --- |
| 90 frames exported read-only from Figma (Anatomy, States, Do & don't for every page in `figma/doc-frames.json`), 1280px wide PNG. `FigmaFrame` already shows an image when the file exists, so no component code changed | `public/figma/<node-id>.png` |
| Test: the Button page shows its Anatomy, States and Do & don't images and each one loads | `tests/component-pages.spec.ts` |
| Where we left off brought up to date (Phase 2 merged) | `docs/REVAMP-LOG.md` |

**How the images were made:** the AI session asked Figma for each frame (read-only, nothing in Figma changed); `www.figma.com` is blocked for the session, so a script on Gab's Mac downloaded the files and opened the PR. To refresh after Figma edits, ask the AI session for a new image script.

**Not done / notes**

- Accessibility frames are not exported (the site writes those notes from the code instead).
- Images are not checked by the visual tests; a changed frame only shows up in review.

**Cleanup:** the image links from Figma expire on their own; the script and its link list live in `~/dx-figma/` on Gab's Mac, which can be deleted after merge. Left for Gab: delete `~/dx-phase-1`, `~/dx-phase-2`, `~/dx-figma` and branch `revamp/figma-images` after merge; revoke the `workflow` scope on the `gh` login if not needed.

---

## 2026-11-20 · Phase 2 · Site redesign

**Decisions (Gab):** component pages live at `/components/<name>/` (flat A–Z); live Figma embeds are replaced by exported images (read-only from Figma); this session delivers the branch (repo access was requested; the git proxy still refused it at the end of the session).

**Code (branch `revamp/phase-2`, 7 commits on top of `main` 3374625)**

| Change | Files |
| --- | --- |
| Task-based IA: Get started · Foundations · Tokens · Components (A–Z) · Patterns · Templates · Themes · Contribute. Start pages moved to `/docs/`, `/contribute/`, `/themes/`; new Build with AI and Cleanup pages | `src/site/content.ts`, `src/site/ia.json`, `src/app/(docs)/{docs,contribute,themes}/`, `docs/AI.md` |
| 45 page + 46 Markdown v3 URLs redirect permanently on Vercel | `src/site/redirects.json` (generated), `next.config.mjs` |
| New shell: section links, ⌘K, Customize popover (brand, density, high contrast, dark), dark toggle, collapsible sidebar (sheet below 1024px), On this page rail, no theme flash on load | `src/site/docs-shell.tsx`, `src/site/customize.tsx`, `src/site/theme-boot.ts`, `src/app/layout.tsx` |
| New home page; old overview is now Introduction (`/docs/`) | `src/app/(docs)/page.tsx`, `src/app/(docs)/docs/page.tsx` |
| 63 component pages on one template: Preview/Code (Desktop / 834 / 390, per-preview dark mode, copy) → Installation (CLI / Manual) → Usage → Examples → When to use → Anatomy → Do & don't → API → Tokens → Accessibility → Mobile → Figma spec → Related → Changelog | `src/site/component-page.tsx`, `src/site/preview.tsx`, `src/app/(docs)/components/` |
| 87 examples (real code, Shiki highlighting) for all 63 components | `src/examples/<slug>/*.tsx`, `src/examples/index.ts` (generated) |
| Props from the TypeScript types, tokens each component uses, example index, redirects — all generated from code | `scripts/build-docs-data.mjs`, `src/site/component-data.json` |
| Accessibility notes per component, checked against each component's code | `src/site/a11y.ts` |
| Token explorer: 567 variables, tier filter, values per brand × mode, copy as CSS / Tailwind / React Native / value | `src/app/(docs)/tokens/`, `src/site/token-data.ts`, `src/site/token-explorer.tsx`, `src/site/token-paths.ts` |
| Icon browser: Figma categories, search by DX or Lucide name, copy 4 ways, SVG pack | `src/app/(docs)/icons/`, `src/site/icon-browser.tsx` |
| Figma embeds → FigmaFrame (image in `public/figma/<id>.png` when exported, else a link card); frame index from a read-only Figma script | `src/site/blocks.tsx`, `figma/doc-frames.json` |
| Parity check follows the new IA (every Figma page has a place; every coded component has an example) | `scripts/check-parity.mjs` |
| Tests: v3 URLs exist or redirect; 63 pages on the template; Code tab and preview controls; RN paths in the explorer; keyboard tests on the new pages; visual tests on component previews | `tests/redirects.spec.ts`, `tests/component-pages.spec.ts`, `tests/v3-routes.json`, `tests/*.spec.ts` |

**Verified:** `npm run build:all` (no diff), `npm run check` (parity 63/63, 11/11), `npm run build:pages`, functional tests **204 passed**, axe WCAG 2.2 on every page in light and dark **225 passed** (429 total), no sideways scroll at 390px. Screens checked at 1440 and 390, light and dark, Violet brand.

**Gate G2:** all 63 component pages on the template ✓ · axe, parity and 390px pass ✓ · every v3 URL redirects or still exists ✓ (redirects themselves run on Vercel; check on the preview).

**Not done / notes**

- Anatomy and Do & don't show "Open in Figma" cards until `www.figma.com` is allowed for the AI session; then images are exported and committed with no code change.
- Visual regression baselines must be re-recorded on CI after merge.
- Blocks link in the header waits for Phase 3.

**For Gab**

- [ ] Push `revamp/phase-2` and open the PR (or give the session repo access).
- [ ] After merge: **Actions → Update visual baselines**.
- [ ] Allow `www.figma.com`, `ui.shadcn.com`, `*.vercel.app` for the AI session (Capabilities → allowed domains).

**Cleanup:** removed screenshots and scratch scripts; no credentials used; `out/`, `.next/`, `test-results/` are ignored build output. Left for Gab: delete `revamp/cleanup-process` if still there; revoke the `workflow` scope on the `gh` login if not needed.

---

## 2026-11-18 · Phase 1 · Distribution

**Checked first:** Phase 0 is merged (PR #1) and live on Vercel; PRs #2 and #3 merged. The last log commit on `revamp/cleanup-process` (`a5a4e38`, Figma badge note) was not in `main`, so it is carried on this branch. Figma: Icons frames renamed; the three working pages (Research, QA · Agent test, Doc Kit) are still in the main file.

**Decisions taken with Gab's go-ahead (defaults, easy to change)**

- Token build stays on the existing script; **no Style Dictionary/Terrazzo yet**. It already resolves all 567 variables, and Style Dictionary handles the 9 Figma mode collections poorly. React Native output is a second script reading the same export. Revisit before Flutter.
- Registry served from `dx-design-system.vercel.app/r/v4/` until the custom domain is decided (one constant per file).
- Progress log kept here only (the plan doc wasn't updated from this session).

**Code (branch `revamp/phase-1`)**

| Change | Files |
| --- | --- |
| React Native tokens: every alias resolved (hex, dp numbers), colors per brand × mode, palette, fonts, density sizes, typography (phone/tablet), elevation (RN 0.76 `boxShadow` + legacy props), component tokens, motion (ms, bezier, springs), `createTheme({ brand, mode, density })` | `scripts/build-native.mjs`, `dist/tokens.native.ts`, `package.json` (`./tokens.native` export), `tsconfig.json` |
| shadcn alias layer: `--background`, `--primary`, `--muted`, `--border`, `--ring`, `--radius`, `--chart-1..5`, `--sidebar-*` → DX tokens, on `:root[data-theme]`/`[data-brand]` so they beat `shadcn init`'s `:root`/`.dark`; Tailwind `bg-primary`, `text-muted-foreground` … Additive only | `scripts/build-tokens.mjs`, `dist/tokens.css`, `dist/tailwind.css` |
| shadcn registry: `init` (tokens, Tailwind theme, `dx-tokens.ts`, `cn()`, fonts, globals.css imports), 13 `ui-<module>` items with dependencies from imports, `app-shell`, `agents`, and 63 component items | `scripts/build-registry.mjs`, `registry.json`, `public/r/v4/*.json` |
| Lucide icon base: `Icon` renders Lucide; the 69 DX names map in `icon-map.ts`; any Lucide icon via `name={Rocket}`; `mirror` prop. Figma-drawn originals kept in `icons.generated.tsx` (not shipped) | `src/components/ui/icon.tsx`, `src/components/ui/icon-map.ts`, `scripts/build-icons.mjs`, `src/site/lucide-names.json` |
| Icons page: copy as DX / Lucide React / React Native / SVG | `src/site/demos.tsx` |
| Downloads page: tokens in 5 formats + zip, icon SVG zip, starter zip, all built at build time | `src/app/(docs)/start/downloads/page.tsx`, `src/app/downloads/[file]/route.ts`, `src/site/downloads.ts`, `src/site/zip.ts` |
| AI-readable docs: `/llms.txt`, `/llms-full.txt`, Markdown twin of every page at `/md/<group>/<page>.md`; `AGENTS.md` rules (registry item installs `AGENTS.dx.md`) | `src/site/llms.ts`, `src/app/llms.txt/`, `src/app/llms-full.txt/`, `src/app/md/[...path]/`, `docs/AGENTS.md` |
| Docs: Install with the CLI, React Native; Getting started leads with the CLI; README | `docs/INSTALL.md`, `docs/REACT-NATIVE.md`, `src/app/(docs)/start/{cli,react-native}/`, `src/site/content.ts`, `README.md` |
| Release workflow: on a `v*` tag, attach every download, `llms-full.txt` and an offline docs zip to the GitHub release | `.github/workflows/release.yml` |
| CI: freshness check covers the registry and Lucide name map; gallery axe test marked slow (flaky timeout under parallel load) | `.github/workflows/ci.yml`, `tests/a11y.spec.ts` |
| Tests: native colors = CSS in 3 brands × 4 modes (1,464 values); shadcn aliases; registry completeness; downloads served and valid; every Markdown twin resolves | `tests/tokens.spec.ts`, `tests/registry.spec.ts`, `tests/site.spec.ts` |

**Verified:** `npm run check` (parity 63/63, 11/11), `npm run build:pages`, plain `next build` (Vercel mode: `/llms.txt`, `/md/…`, `/downloads/…`, `/r/v4/…` all 200), `npm run test:functional` **261 passed**.

**Gate G1 (local):** fresh `create-next-app` (Next 16.4, Tailwind 4.3) with shadcn's `globals.css`, then `npx shadcn@4.23.0 add @dx/init @dx/button @dx/alert @dx/card @dx/text-field @dx/agents` from a local copy of the registry: about 7 s, `next build` passes, and default/light, violet/dark/compact and amber render themed (DX fonts, Lucide icons, shadcn classes on DX tokens). The sandbox couldn't reach ui.shadcn.com, so `shadcn init` and shadcn's base-color file were stubbed; re-run once against the deployed registry. React Native: `createTheme` type-checks and is tested in Node; not yet tried in an Expo app.

**Known differences in existing shadcn projects** (documented in `docs/INSTALL.md`): `shadcn init`'s `@theme inline` redefines `--radius-sm…xl` (DX components use `rounded-sm`/`rounded-md`) and `--font-sans`; delete those lines for exact DX values. The shadcn CLI can't override them from a registry item.

**For Gab**

- [ ] Push `revamp/phase-1` (`git am` the patch, or `git fetch` the bundle) and open the PR. Or add the repo to the AI session's sources so Claude can push.
- [ ] After merging: **Actions → Update visual baselines**.
- [ ] After the Vercel deploy, try the real thing in a new folder: `npx create-next-app@latest`, `npx shadcn@latest init`, then `npx shadcn@latest add https://dx-design-system.vercel.app/r/v4/init.json https://dx-design-system.vercel.app/r/v4/button.json`.
- [ ] Decide the custom domain (before v4.0.0).
- [ ] For the DX custom icons (Agriculture & Field Ops, AI, Filled): OK for Claude to export them from the Figma Icons page (read-only)?
- [ ] Still open from before: move the 3 working pages to a "DX Workshop" file; revoke the old GitHub token; turn on automatic deletion of head branches; brand guide and logo.

**Cleanup:** removed the scratch Next.js app, the shadcn CLI scratch install, the local registry stub and test servers; regenerated the registry with production URLs (no `localhost` left). No credentials used or stored. `out/`, `.next/`, `test-results/` are git-ignored build output. Left for Gab: delete `revamp/cleanup-process` once this branch is merged (its one extra commit is included here).

---

## 2026-11-18 · Cleanup, and cleanup made part of every process

**Checked**

- Vercel: Vercel Authentication is now off, so the site is public. Production deploy of `94f2660` (PR #2 merge) is ready.
- GitHub: PR #2 merged; the CI `deploy` job is gone from `main`; GitHub Pages is switched off (Branch → None) and the `gh-pages` branch is deleted.
- Figma: searched every text layer and prototype link on Cover, Getting Started, Governance, Templates, Starter & Empty States and Doc Kit & Template. No links to the old github.io address (the file has no URL links at all), so nothing to change.
- Figma change (Gab's go-ahead): the "Docs site →" badge in the Developer path on the Getting Started page (`124:164`) now links to https://dx-design-system.vercel.app/, as a text link on its label and a click action on the instance. No visual change.

**Code (branch `revamp/cleanup-process`)**

| Change | Files |
| --- | --- |
| New checklist: cleanup is the last step of every process (credentials, branches, build output, hosting changes, Figma releases, AI sessions) | `docs/CLEANUP.md` |
| Cleanup step added to each process | `docs/WORKFLOW.md` (release step 7), `docs/GETTING-STARTED.md` (component step 5), `docs/DEPLOY.md`, `README.md` |
| Pull request template with a required cleanup checklist | `.github/pull_request_template.md` |
| Every log entry now ends with a Cleanup line | `docs/REVAMP-LOG.md` |
| Fix: links like `CLEANUP.md` inside `docs/*.md` now open `docs/CLEANUP.md` on GitHub (they pointed at the repo root) | `src/site/content.ts` |

**Verified:** `npm run check` (parity 63/63, 11/11), `npm run build:pages`, `npm run test:functional` (244 passed).

**Cleanup:** deleted the merged branches `revamp/phase-0` and `revamp/retire-pages` (remote and local) and the local `gh-pages` copy; removed build and test output from the workspace; checked that no token is stored in git config, files or shell history. Left for Gab: revoke the GitHub token used for this push; turn on **Settings → General → Automatically delete head branches**; delete `revamp/cleanup-process` after merging.

---

## 2026-11-18 · Vercel live, GitHub Pages retired

**Vercel (set up by Gab)** — project `dx-design-system` (team `gamores-projects`). First production deploy built from `18ad7a8` (PR #1 merge): `npm ci` → parity 63/63, 11/11 checks → `next build`, 54 s. Checked `/`, `/foundations/icons/` (69 icons), `/actions/button/`, `/starter/` and `/templates/members/`: all 200, search and footer present, assets at the domain root (no `/dx-design-system` base path).

Found: **Vercel Authentication is on for all deployments**, so people without a Vercel login on the team see a login screen. Fix in `docs/DEPLOY.md` → "Who can see the site".

**Code (branch `revamp/retire-pages`)**

| Change | Files |
| --- | --- |
| Removed the `deploy` job (gh-pages publish). Verify and visual jobs unchanged; they still build the static export for Playwright | `.github/workflows/ci.yml` |
| Links now point at `dx-design-system.vercel.app` | `README.md`, `docs/GETTING-STARTED.md`, `docs/WORKFLOW.md` |
| Deploy guide: who can see the site, what was retired, what's left | `docs/DEPLOY.md` |
| Comments: the static export is now only for tests | `next.config.mjs`, `scripts/serve-out.mjs`, `playwright.config.ts` |

**For Gab**

- [ ] Merge the `revamp/retire-pages` pull request.
- [ ] GitHub repo → Settings → Pages → Source: *None*. Then delete the `gh-pages` branch.
- [ ] Vercel → Settings → Deployment Protection → Vercel Authentication: **Only Preview Deployments**.
- [ ] Replace any `dx-gamores.github.io` links in the Figma file.
- [ ] Revoke the GitHub token used for this push.

**Cleanup:** done in the entry above (branches deleted, Pages switched off).

---

## 2026-11-13 · Phase 0 · Quick wins

**Decisions recorded** (see the plan doc's Decisions table): React Native first, Flutter later · only the design lead edits Figma · Lucide as the icon base with DX custom icons on top · open-source fonts unless a client supplies a licence · hosting moves to Vercel · Gab and Claude maintain the site · company branding pending.

**Code (branch `revamp/phase-0`)**

| Change | Files |
| --- | --- |
| ⌘K / Ctrl+K search over all 52 pages and 63 components, with keyboard navigation; `/` also opens it | `src/site/search.tsx`, `src/site/docs-shell.tsx`, `src/app/(docs)/layout.tsx` |
| Copy button on every code block (Markdown pages, specs, hand-written blocks) | `src/site/search.tsx` (`useCodeCopy`) |
| Overview stats say what they count: "Icons in code" (69 of 258 in Figma) and "12 · Themes · 3 brands × 4 colour modes" | `src/app/(docs)/page.tsx` |
| Gallery explains that 63 includes sub-components such as Icon Button | `src/app/(docs)/start/gallery/page.tsx` |
| Getting started: step-by-step "Start a new app from the starter" | `src/app/(docs)/start/getting-started/page.tsx` |
| Vercel-ready: plain `next build` works with no base path; `trailingSlash` on for both builds; `vercel.json`; deploy guide | `next.config.mjs`, `vercel.json`, `docs/DEPLOY.md` |
| Tests for search and copy | `tests/site.spec.ts` |

**Verified:** `npm run check` (parity 63/63, 11/11 checks, `tsc`), `npm run build:pages`, plain `next build`, and the functional suite — 244 Playwright tests (pages and links, 390px, axe light and dark, components, templates, new search and copy tests). One axe run on the gallery timed out once and passed on rerun, with and without these changes.

**Figma**

- Icons page: renamed 3 documentation frame layers so their numbers match the visible labels (`04 · SIZE & COLOR`, `05 · DO & DON'T`, `06 · ACCESSIBILITY`). The canvas labels were already correct.

**For Gab**

- [ ] Restore GitHub access for Claude, or push `revamp/phase-0` yourself.
- [ ] Move the 3 "Working files (not for publishing)" pages (Research, QA · Agent test, Doc Kit & Template) into a new unpublished "DX Workshop" file. Figma's API can't move pages between files.
- [ ] Create the Vercel project (`docs/DEPLOY.md`, about 10 minutes).
- [ ] Ask the company lead for the DXFORM brand guide and logo.

**Notes for next session**

- `figma/icons.json` has 69 icons; the Figma Icons page now has 258. Phase 1 replaces the hand-coded set with Lucide plus DX custom icons, so the remaining 189 don't need coding one by one.
- The header brand/theme/density controls are still native dropdowns; they become a Customize popover in Phase 2.
