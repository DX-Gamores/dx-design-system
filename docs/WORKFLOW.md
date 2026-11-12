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
4. Ask Claude to **re-export the code kit**. That refreshes `figma/variables.raw.json`, `figma/styles-components.raw.json` and `figma/icons.json`, runs `npm run build:all`, and opens a PR titled with the new version.
5. Note the change in the Figma changelog and in the PR. Bump the version in `package.json`, following the versioning rules on the Governance page:
   - **Patch:** fixes.
   - **Minor:** new components or tokens.
   - **Major:** renames or removals.

## Developers

- **Tokens:** pull the new version. Nothing to do unless a token was renamed, which is a major version with a migration note.
- **Components:** the copies in your project are yours. Compare against `src/components/ui` when the changelog mentions a component you use.
- **Questions:** comment on the Figma frame, or open a GitHub issue on this repo with the label `design-system`.

## The docs site (GitHub Pages)

The site at https://dx-gamores.github.io/dx-design-system/ mirrors the Figma file page for page. It is generated, not hand-written:

| On the site | Comes from |
|---|---|
| Sidebar groups and order | The Figma page list (`src/site/content.ts` → `nav`) |
| Page eyebrow, summary, "In the Figma page" outline | `figma/pages.content.json` (exported from each page's header and section headers) |
| Specs | `docs/components/*.md` (`npm run specs`, from component descriptions) |
| Live examples | `src/site/demos.tsx` — real components from `src/components/ui` |
| "Coded" badges | `coded` in `src/site/content.ts` — add a spec slug when its component ships |
| Foundations pages | `figma/variables.raw.json` + text/effect styles, rendered with the live CSS variables (`src/site/foundations/`) |
| Contrast audit | Measured in the browser from the tokens: 27 pairs × 3 brands × 4 modes |
| Do & don't | Live, view-only Figma embeds of each page's Do & don't frame (`doDont` in `figma/pages.content.json`) — viewers need view access to the file, no paid seat |

To publish an update:

```bash
npm run build:pages          # static export to out/ (base path /dx-design-system)
```

Then commit the contents of `out/` to the `gh-pages` branch. Claude does this as part of "re-export the code kit".
