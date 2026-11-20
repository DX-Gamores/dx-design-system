# Build with AI

Claude, Cursor, Copilot and Codex write better DX code when they can read the DX docs and rules. Everything they need is plain text on this site.

## Give your assistant the docs

| File | What it is |
| --- | --- |
| [llms.txt](https://dx-design-system.vercel.app/llms.txt) | Index of every page with a one-line summary and the key rules. Paste the URL into a chat or add it as a docs source. |
| [llms-full.txt](https://dx-design-system.vercel.app/llms-full.txt) | The whole site as one Markdown file, for tools that take a single document. |
| Markdown pages | Every page has a Markdown version at `/md/<path>.md`, for example [/md/components/button.md](https://dx-design-system.vercel.app/md/components/button.md). Each component page also links to its Markdown. |
| [Registry index](https://dx-design-system.vercel.app/r/v4/registry.json) | Every installable item, so an assistant can pick the right component and install it. |

## Add the rules to your project

One command adds `AGENTS.dx.md`: use DX components before writing new ones, use semantic tokens instead of raw colors, theme with `data-*` attributes, icons, accessibility.

```bash
npx shadcn@latest add https://dx-design-system.vercel.app/r/v4/agents.json
```

Then add one line to your `AGENTS.md` (Codex, Cursor, Copilot) or `CLAUDE.md` (Claude Code):

```md
See AGENTS.dx.md for the DX Design System rules.
```

## Prompts that work

- "Build a members settings page with DX components. Use the app shell, a page header, a table with sorting and a dialog to invite people. Read https://dx-design-system.vercel.app/llms.txt first."
- "This screen uses raw hex colors and px values. Replace them with DX semantic tokens (see the token explorer)."
- "Install the DX components this page needs with the shadcn CLI, then import them from `@/components/ui/*`."

## Check what the assistant wrote

- No raw colors (`#2563eb`, `blue-600`) and no fixed control heights in product code.
- Every input has a visible label; icon-only buttons have a `label`.
- The screen still looks right with `data-theme="dark"` and `data-density="compact"` on `<html>`.
