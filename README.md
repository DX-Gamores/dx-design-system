# DX Design System — code kit

The code side of the **DX Design System** Figma file. Developers don't need a Figma seat to use it: everything they need from Figma — colours, type, spacing, motion, component rules, icons — is exported here as code.

| You want to… | Use |
|---|---|
| Get the brand right in any web project | [`dist/tokens.css`](dist/tokens.css) — CSS variables for 3 brands × 4 colour modes × 2 densities |
| Style with Tailwind (v4) | [`dist/tailwind.css`](dist/tailwind.css) — `bg-surface`, `text-fg-primary`, `border-line-default`, `text-heading-h1`, `shadow-elevation-2` … |
| Build a component correctly | [`docs/components/`](docs/components/README.md) — 63 specs: props, states, tokens, keyboard and accessibility. Every one is coded in [`src/components/ui`](src/components/ui) |
| Start a new app | [`src/templates`](src/templates) — Dashboard, Members, Settings, Sign in/up, empty states and both starter shells as code you copy. Clickable at [`/templates/dashboard`](https://dx-gamores.github.io/dx-design-system/templates/dashboard/) |
| Feed tokens to another tool | [`tokens/tokens.json`](tokens/tokens.json) — W3C Design Tokens format, all modes |
| Draw charts | [`dist/tokens.ts`](dist/tokens.ts) → `dataviz.series`, colour-blind-checked |

**Docs site:** [dx-gamores.github.io/dx-design-system](https://dx-gamores.github.io/dx-design-system/) — every Figma page mirrored: specs, live components, governance and changelog, with brand / theme / density switches. No Figma seat needed.

**Also on Claude:** [DX Design System on Claude](https://claude.ai/artifact/Qrht2ZAQ4WQJXYr4bHC332) — tokens per theme, live component previews, specs and icons (ask the design lead for access).

**Figma (view-only is enough):** [DX Design System](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System) · every page has visual docs you can read without a seat.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000 — docs site · /starter = starter app
```

Use the brand / theme / density switches in the header. They flip the same variable modes as Figma.

## Use it in another project

```bash
npm i github:DX-Gamores/dx-design-system      # or copy the dist/ folder
```

```css
/* app/globals.css */
@import "tailwindcss";
@import "@dxform/design-system/tokens.css";
@import "@dxform/design-system/tailwind.css";
```

```html
<html data-brand="default" data-theme="light" data-density="comfortable">
```

Components live in [`src/components/ui`](src/components/ui). Copy the ones you need into your project and own them (the shadcn/ui approach). They only depend on the tokens, so they re-skin for any brand. To start a new app from the shell, copy [`src/app/starter`](src/app/starter) too.

More detail is in **[docs/GETTING-STARTED.md](docs/GETTING-STARTED.md)**, **[docs/NEW-BRAND.md](docs/NEW-BRAND.md)** and **[docs/WORKFLOW.md](docs/WORKFLOW.md)**.

## What's inside

```
figma/                 Exports from the Figma file: variables, components, icons, page outlines (don't edit)
scripts/               build-tokens · build-icons · build-specs  (npm run build:all)
tokens/tokens.json     W3C DTCG tokens, every mode
dist/                  tokens.css · tailwind.css · tokens.ts  (generated, committed)
docs/components/       63 component specs (generated from Figma descriptions)
src/components/ui/     React components for all 63 Figma specs — actions, inputs (Combobox, DatePicker,
                       Slider, RadioGroup, Chip, FileUpload…), feedback (Toast, Tooltip…), overlays
                       (Dialog, Drawer, Popover, Menu), navigation, data display (Table, List), form and
                       AI patterns, Icon (69 icons). No UI library dependency — copy what you need.
src/app/(docs)/        Docs site: one page per Figma page (generated from figma/ + docs/)
src/templates/         Figma templates as components: shells, dashboard, members, settings, auth, empty states, examples
src/app/templates/     Full-screen routes for the templates (a clickable prototype)
src/app/starter/       Starter app: app shell, dashboard, placeholder sections
src/site/              Docs-site building blocks: navigation, live demos, page layouts
```

## Rules that keep the brand consistent

1. **Never hard-code a colour, size or font.** Use a token class or `var(--ds-…)`. If a token is missing, ask design — don't invent one.
2. **Names match Figma.** `color/bg/surface` in Figma = `--ds-color-bg-surface` in CSS = `bg-surface` in Tailwind.
3. **States come from the browser.** Hover, focus and disabled are pseudo-classes, not props.
4. **Accessibility is part of "done".** Each spec lists its keyboard and screen-reader behaviour. The components already follow it.

Version **3.2.0** · generated from Figma on Nov 11, 2026.
