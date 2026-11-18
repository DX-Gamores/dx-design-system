# DX Design System v4 revamp — progress log

The plan lives in the **DX Design System — Revamp & Improvement Plan** doc (Claude artifact). This file is the code-side record: every work session adds one entry at the top, so anyone can see what changed and where we left off.

**Maintainers:** Gab (design lead, only Figma editor) and Claude.
**Phases:** 0 Quick wins → 1 Distribution → 2 Site redesign → 3 Blocks + theme builder → 4 Figma and launch.

> **Important: every entry ends with a Cleanup line.** A session isn't finished until it has followed [docs/CLEANUP.md](CLEANUP.md): tokens revoked, merged branches deleted, scratch and build output removed, old links replaced. Write down what was cleaned up and what is left for Gab.

## Where we left off

- Phase: **0 · Quick wins — done and cleaned up.** Docs site live and public on Vercel (https://dx-design-system.vercel.app); GitHub Pages switched off and its branch deleted.
- Open: merge `revamp/cleanup-process` (cleanup checklist added to every process).
- Next up: Phase 1 · Distribution — shadcn registry (`registry.json`, `@dx/init`), React Native token build, Lucide icon base, Downloads page, `llms.txt`.

---

## 2026-11-18 · Cleanup, and cleanup made part of every process

**Checked**

- Vercel: Vercel Authentication is now off, so the site is public. Production deploy of `94f2660` (PR #2 merge) is ready.
- GitHub: PR #2 merged; the CI `deploy` job is gone from `main`; GitHub Pages is switched off (Branch → None) and the `gh-pages` branch is deleted.
- Figma: searched every text layer and prototype link on Cover, Getting Started, Governance, Templates, Starter & Empty States and Doc Kit & Template. No links to the old github.io address (the file has no URL links at all), so nothing to change.

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
