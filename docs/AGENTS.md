# DX Design System — instructions for AI coding assistants

This project uses the DX Design System (DXFORM). Follow these rules when you write UI code here.

Docs for AI: https://dx-design-system.vercel.app/llms.txt (index) and https://dx-design-system.vercel.app/llms-full.txt (everything). Every docs page has a Markdown twin at `/md/<group>/<page>.md`.

## Components

- Use DX components from `@/components/ui/*` before writing your own. Check the list in the registry index: https://dx-design-system.vercel.app/r/v4/registry.json
- Missing a DX component? Install it, don't hand-roll it: `npx shadcn@latest add https://dx-design-system.vercel.app/r/v4/<name>.json` (names match the docs URLs, e.g. `text-field`, `dialog`, `table-cell`).
- Building a whole screen (app sidebar, dashboard, sign-in, settings, data table, empty state)? Start from a block: `npx shadcn@latest add https://dx-design-system.vercel.app/r/v4/<block>.json` (e.g. `sidebar-07`, `dashboard-01`, `auth-01`; list at https://dx-design-system.vercel.app/blocks/). App navigation uses the `Sidebar*` parts from `@/components/ui/sidebar`.
- Don't edit files in `components/ui/` for one project. Put project-only components in `components/project/` and compose DX components there.
- Buttons: one Primary per view; Secondary for supporting actions; Ghost for toolbars; `tone="danger"` for destructive actions, confirmed in a Dialog.
- Every form control needs a visible label (`label` prop). Toolbar search may hide it with `hideLabel` but keeps an accessible name.

## Tokens

- Never hard-code colors, spacing, radius, shadows or font sizes. Use DX semantic tokens:
  - Tailwind: `bg-canvas`, `bg-surface`, `bg-surface-subtle`, `text-fg-primary`, `text-fg-secondary`, `text-fg-brand`, `border-line-default`, `border-line-strong`, `rounded-control`, `rounded-container`, `shadow-elevation-2`, `focus-ring`.
  - Text styles: `text-heading-h1` … `text-heading-h4`, `text-body-large|medium|small`, `text-label-large|medium|small`, `text-caption-default`, `text-code-medium|small`.
  - CSS: `var(--ds-color-bg-surface)`, `var(--ds-spacing-4)`, `var(--ds-shape-radius-control)`.
- Status colors: `bg-danger-subtle text-fg-danger`, `bg-success-subtle text-fg-success`, `bg-warning-subtle text-fg-warning`, `bg-info-subtle text-fg-info`.
- shadcn class names also work and map to DX (`bg-primary`, `text-muted-foreground`, `border-border`), but prefer the DX names.
- Don't use primitive ramps (`blue-600`, `--ds-color-blue-600`) in product UI; they bypass brand and dark mode.

## Theming

- Brand, color mode and density are attributes on `<html>`: `data-brand` (`default`, `violet`, `amber`, or a client brand), `data-theme` (`light`, `dark`, `light-hc`, `dark-hc`), `data-density` (`comfortable`, `compact`). Don't use a `.dark` class.
- Client brands come from the theme builder (https://dx-design-system.vercel.app/themes/builder/) and install as `npx shadcn@latest add https://dx-design-system.vercel.app/r/v4/theme-<brand>.json`. Never hard-code brand colours; change the brand, not the components.
- Anything you build must work in all four color modes and both densities. Don't set fixed heights on controls; use `h-control-sm|md|lg`.

## Icons

- `<Icon name="check" />` for DX names (24px grid, 2px stroke). Any Lucide icon: `import { Rocket } from "lucide-react"; <Icon name={Rocket} />`.
- Decorative icons have no label. An icon that is the only content of a control needs a label (`IconButton` requires `label`).

## Accessibility (WCAG 2.2 AA)

- Keyboard: everything clickable is a `button` or `a`; visible focus comes from `focus-ring`.
- Target size ≥ 24×24 px; contrast comes from tokens, so don't override text colors on colored backgrounds.
- Use `Dialog`, `Drawer`, `Menu`, `Tooltip` from DX; they handle focus, Escape and ARIA.

## React Native

Use `createTheme({ brand, mode, density })` from `tokens.native.ts` and read every color, size and text style from the theme object. Don't hard-code values.
