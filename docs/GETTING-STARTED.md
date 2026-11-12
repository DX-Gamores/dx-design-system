# Getting started (developers)

## 1. How tokens map from Figma to code

| Figma variable | CSS variable | Tailwind class |
|---|---|---|
| `color/bg/surface` | `--ds-color-bg-surface` | `bg-surface` |
| `color/text/secondary` | `--ds-color-text-secondary` | `text-fg-secondary` |
| `color/border/default` | `--ds-color-border-default` | `border-line-default` |
| `color/icon/brand` | `--ds-color-icon-brand` | `text-icon-brand` |
| `color/dataviz/series-1` | `--ds-color-dataviz-series-1` | `bg-viz-series-1` / `fill-viz-series-1` |
| `radius/md` | `--ds-radius-md` | `rounded-md` |
| `shape/radius-control` | `--ds-shape-radius-control` | `rounded-control` |
| `size/control-md` | `--ds-size-control-md` | `h-control-md` |
| `spacing/4` (16px) | `--ds-spacing-4` | `p-4` (same 4px scale as Tailwind) |
| Text style `Heading/H1` | `.ds-heading-h1` | `text-heading-h1` |
| Effect `Elevation/2` | `--ds-shadow-elevation-2` | `shadow-elevation-2` |
| Effect `Focus/Ring` | `--ds-shadow-focus-ring` | `focus-visible:focus-ring` |
| `easing/spring-gentle` | `--ds-easing-spring-gentle` | `ease-spring-gentle` |

Prefer **semantic** tokens (`bg-surface`, `text-fg-primary`) over primitives (`--ds-color-blue-600`). Semantic tokens are what change between brands and themes.

## 2. Themes, brands, density

Set these attributes on `<html>`, or on any wrapper (always put both brand and theme on the same element):

| Attribute | Values | Figma collection |
|---|---|---|
| `data-brand` | `default` · `violet` · `amber` | Brand |
| `data-theme` | `light` · `dark` · `light-hc` · `dark-hc` | Color |
| `data-density` | `comfortable` · `compact` | Dimension |
| `data-motion` | `default` · `reduced` | Motion |

These follow the device automatically:

- **No `data-theme`:** it follows the system dark mode and "increase contrast" settings.
- **No `data-motion`:** it follows "reduce motion".
- **Typography and layout:** they follow the breakpoints (Desktop ≥ 1024, Tablet 600–1023, Mobile < 600, Wide ≥ 1440), like the Figma Typography and Layout modes.

## 3. Building a component

1. Open its spec in `docs/components/<name>.md`. It covers when to use it, its properties, tokens, keyboard behaviour and code API.
2. Look at the Figma page in view-only mode for the visual states. The "Every state, side by side" matrix shows each one.
3. If a coded version exists in `src/components/ui`, use or extend it. If not, build it from tokens only, following the spec.
4. Check it on its docs-site page and in the [component gallery](https://dx-gamores.github.io/dx-design-system/start/gallery/) in every brand × theme, plus keyboard-only.

## 4. App-level setup

Most components need nothing. Two need one line each:

```tsx
// app/layout.tsx — toasts render in one shared live region
import { ToastProvider } from "@/components/ui";
<body><ToastProvider>{children}</ToastProvider></body>
```

- **Toast:** call `const toast = useToast(); toast.show({ message: "Saved", tone: "success" })` anywhere inside the provider.
- **Dialog / Drawer:** use the native `<dialog>` element, so the page behind is inert and focus is trapped with no extra setup. Control them with `open` and `onClose`.

## 5. Fonts

The fonts for the three brands are self-hosted with Fontsource (`src/app/fonts.ts`): Inter, Manrope, Poppins and Roboto Mono. Delete the ones your brand doesn't use.

## 6. Updating when design changes

You never edit `dist/` or `docs/components/` by hand. When design publishes a change, the export in `figma/` is refreshed and `npm run build:all` regenerates everything (see [WORKFLOW.md](WORKFLOW.md)).
