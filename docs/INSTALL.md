# Install with the CLI

DX is a [shadcn](https://ui.shadcn.com/docs/registry) registry. The CLI copies DX source into your project, so you own the code: no package to update, no lock-in, and community shadcn components pick up DX branding unchanged.

Works with React 19 and Next.js 15+ (App Router), Tailwind CSS v4.

## 1. New project

```bash
npx create-next-app@latest my-app --ts --tailwind --app --src-dir --import-alias "@/*"
cd my-app
npx shadcn@latest init
```

## 2. Add the DX registry

In `components.json`, add:

```json
{
  "registries": {
    "@dx": "https://dx-design-system.vercel.app/r/v4/{name}.json"
  }
}
```

## 3. Install DX, then components

```bash
npx shadcn@latest add @dx/init @dx/button
```

`@dx/init` adds:

| File | What it is |
| --- | --- |
| `styles/dx-tokens.css` | Every token as a CSS variable: 3 brands × 4 color modes × 2 densities, plus shadcn aliases (`--primary`, `--background`, `--sidebar-*`, `--chart-*`) |
| `styles/dx-tailwind.css` | Tailwind v4 theme: `bg-surface`, `text-fg-secondary`, `rounded-control`, `text-heading-h1`, `focus-ring` … |
| `lib/dx-tokens.ts` | Brand, theme and density lists, chart colors, `readToken()` |
| `lib/cn.ts` | The `cn()` class helper DX components use |
| `globals.css` | Imports for the two CSS files and the brand fonts (Fontsource, self-hosted) |

Then set the theme on `<html>` in `app/layout.tsx`:

```tsx
<html lang="en" data-brand="default" data-theme="light" data-density="comfortable">
```

| Attribute | Values |
| --- | --- |
| `data-brand` | `default` · `violet` · `amber` (or your client brand) |
| `data-theme` | `light` · `dark` · `light-hc` · `dark-hc` |
| `data-density` | `comfortable` · `compact` |

Use it:

```tsx
import { Button } from "@/components/ui/button";

export default function Page() {
  return <Button leadingIcon="download">Export</Button>;
}
```

## What you can install

| Item | Installs |
| --- | --- |
| `@dx/init` | Tokens, Tailwind theme, fonts, `cn()`. Install first. |
| `@dx/<component>` | One per Figma component, e.g. `@dx/button`, `@dx/text-field`, `@dx/dialog`, `@dx/table-cell`. The component name is its page URL on this site. |
| `@dx/app-shell` | AppShell (skip link, header, sidebar), PageHeader and ThemeSwitcher (Next.js) |
| `@dx/ui-<module>` | A whole source file, e.g. `@dx/ui-form` (all form controls) |

Components share source files (for example `TextField`, `Select` and `Checkbox` all live in `form.tsx`), so installing one component installs its whole file and the files it imports. They land in `components/ui/`.

The full list is in [registry.json](https://dx-design-system.vercel.app/r/v4/registry.json).

## Without the registry entry

Every item also installs by URL, with no `components.json` change:

```bash
npx shadcn@latest add https://dx-design-system.vercel.app/r/v4/init.json https://dx-design-system.vercel.app/r/v4/button.json
```

## Updating

DX code in your project is yours. To take a new DX release, overwrite the core files and review the diff:

```bash
npx shadcn@latest add @dx/init @dx/button --overwrite
git diff
```

Keep project-only changes out of `components/ui/` (put them in `components/project/`) so updates stay clean.

## Notes for existing shadcn projects

- **Colors follow DX automatically.** The DX aliases are declared on `:root[data-theme]` and `:root[data-brand]`, so they win over the `:root` and `.dark` blocks that `shadcn init` wrote. Set `data-theme="dark"` instead of the `.dark` class.
- **Radius scale.** `shadcn init` derives `--radius-sm … --radius-xl` from `--radius` in `globals.css`. DX components use `rounded-sm` (4px) and `rounded-md` (8px). For exact DX radii, delete the four `--radius-sm/md/lg/xl` lines from the `@theme inline` block in `globals.css`.
- **Fonts.** Delete `--font-sans` / `--font-mono` from the `@theme inline` block, and the `next/font` Geist setup from `layout.tsx`, if you want DX fonts everywhere.

## React Native

Mobile apps share tokens, not components. See [React Native](REACT-NATIVE.md).
