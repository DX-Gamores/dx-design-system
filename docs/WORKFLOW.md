# Working with one Figma seat

The design lead holds the only paid Figma seat. Everyone else works from this repo and **view-only** Figma links. That's enough, because nothing a developer needs is locked inside Dev Mode.

```
 Design (1 seat)                    Repo (everyone)                   Apps
 ───────────────                    ───────────────                   ────
 Edit Figma ──► Release audit ──►   figma/*.raw.json refreshed  ──►   npm update / pull
 (components,    (10 checks,        npm run build:all                 tokens.css, specs,
  tokens, docs)   all green)        PR: "Design system vX.Y.Z"        components follow
        ▲                                     │
        └──── Figma comments / GitHub issues ◄┘  (devs ask questions where the work is)
```

## What view-only developers can and can't do in Figma

| Can | Can't (needs a paid seat) |
|---|---|
| Open every page and read the visual docs | Dev Mode: code snippets, token names in Inspect |
| Leave comments on any frame | Code Connect |
| See every state, size and theme side by side | Edit or publish the library |

This repo replaces the "Can't" column. Token names, code snippets and component APIs all live here.

## Release steps (design lead)

1. Make the change in Figma. Update the component description: it becomes the spec.
2. Ask Claude to run the release audit (Governance page → Release health). Fix anything red.
3. Publish the library in Figma.
4. Ask Claude to **re-export the code kit**. That refreshes the files in `figma/` (variables, components, icons, page outlines, `meta.json` with the new version and sync date), runs `npm run build:all`, and pushes to `main`.
5. **CI does the rest** (GitHub Actions, `.github/workflows/ci.yml`):
   - **Generated files are fresh** — tokens, icons and specs match the Figma export.
   - **Parity** — `npm run check`: every Figma page is on the site, every published component has a spec, every spec is coded and has a live example, and the version matches Figma. A miss fails the build and names the fix.
   - **Tests** — keyboard behaviour, an axe WCAG 2.2 scan of every page in light and dark, links, and no sideways scrolling at 390px.
   - **Deploy** — the docs site is published to GitHub Pages automatically.
   - **Visual regression** (non-blocking) — every live example and template at 1440 / 834 / 390 compared with the committed baselines. After an intended visual change, run **Actions → Update visual baselines**.
6. Note the change in the Figma changelog and `src/site/changelog.ts`. Bump the version in `package.json` and `figma/meta.json` together, following the versioning rules on the Governance page:
   - **Patch:** fixes.
   - **Minor:** new components or tokens.
   - **Major:** renames or removals.

## Checking your work locally

```bash
npm run check          # parity + types
npm run build:pages    # static site in out/
npm test               # all tests (needs the build); npm run test:functional / test:visual
npm run serve:pages    # http://localhost:4173/dx-design-system/
```

## Developers

- **Tokens:** pull the new version. Nothing to do unless a token was renamed, which is a major version with a migration note.
- **Components:** the copies in your project are yours. Compare against `src/components/ui` when the changelog mentions a component you use.
- **Questions:** comment on the Figma frame, or open a GitHub issue on this repo with the label `design-system`.

## The docs site (GitHub Pages)

The site at https://dx-gamores.github.io/dx-design-system/ mirrors the Figma file page for page. It is generated, not hand-written:

| On the site | Comes from |
|---|---|
| Sidebar groups and order | `src/site/ia.json` — same groups and order as the Figma file (checked by `npm run check`) |
| Page eyebrow, summary, "In the Figma page" outline | `figma/pages.content.json` (exported from each page's header and section headers) |
| Specs | `docs/components/*.md` (`npm run specs`, from component descriptions) |
| Live examples | `src/site/demos.tsx` — real components from `src/components/ui` |
| "Coded" badges | `src/site/coded.json` — spec slug → the code that implements it (checked by `npm run check`) |
| Figma vs code panel | `figma/components.figma.json` — each published component set's node |
| Foundations pages | `figma/variables.raw.json` + text/effect styles, rendered with the live CSS variables (`src/site/foundations/`) |
| Contrast audit | Measured in the browser from the tokens: 27 pairs × 3 brands × 4 modes |
| Do & don't | Live, view-only Figma embeds of each page's Do & don't frame (`doDont` in `figma/pages.content.json`) — viewers need view access to the file, no paid seat |

Every page footer shows the version, the Figma sync date and the parity count. Each spec has a **Compare with the Figma component** panel: the live Figma component set next to a link to its code.

Publishing is automatic: every push to `main` that passes CI deploys the site.
