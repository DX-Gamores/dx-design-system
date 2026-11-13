# DX Design System v4 revamp — progress log

The plan lives in the **DX Design System — Revamp & Improvement Plan** doc (Claude artifact). This file is the code-side record: every work session adds one entry at the top, so anyone can see what changed and where we left off.

**Maintainers:** Gab (design lead, only Figma editor) and Claude.
**Phases:** 0 Quick wins → 1 Distribution → 2 Site redesign → 3 Blocks + theme builder → 4 Figma and launch.

## Where we left off

- Phase: **0 · Quick wins** — code done on branch `revamp/phase-0`, waiting to be pushed and merged.
- Blocked on: GitHub access for Claude (to push the branch and open the pull request); Vercel project setup (Gab, see `docs/DEPLOY.md`).
- Next up: Phase 1 · Distribution — shadcn registry (`registry.json`, `@dx/init`), React Native token build, Lucide icon base, Downloads page, `llms.txt`.

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
