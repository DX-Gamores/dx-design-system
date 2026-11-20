# Deploying the docs site

From v4 the docs site, registry and downloads are hosted on **Vercel** at https://dx-design-system.vercel.app. GitHub Pages was retired in November 2026 (see the end of this page).

## First-time setup on Vercel (one person, about 10 minutes)

1. Sign in at [vercel.com](https://vercel.com) with the GitHub account that can see `DX-Gamores/dx-design-system`.
2. **Add New → Project → Import** the `dx-design-system` repo.
3. Framework preset: **Next.js**. Leave the root directory as `./`. Vercel reads `vercel.json`, so the install and build commands are already set:
   - Install: `npm ci`
   - Build: `npm run check:parity && next build` (the build fails if Figma and code are out of step)
4. No environment variables are needed. Do **not** set `PAGES_BASE_PATH`; that is only for the GitHub Pages build.
5. Deploy. Every push to `main` becomes a production deploy, and every pull request gets its own preview URL.
6. Optional: add a custom domain under **Settings → Domains** (for example `design.dxform.ph`). Update the registry URL in the plan once it is chosen.

## Checks after the first deploy

- Open `/`, `/components/button/`, `/components/` and `/starter/`. Brand, theme and density switches work.
- Press `⌘K` (Mac) or `Ctrl+K` (Windows) and search for "dialog".
- Hover a code block on `/docs/figma-to-code/` and press **Copy**.

## Who can see the site

Vercel → project **dx-design-system** → **Settings → Deployment Protection**. Keep **Vercel Authentication** on **Only Preview Deployments** (or off): with it on for everything, developers without a Vercel login on the team get a login screen instead of the docs.

## GitHub Pages (retired)

Done in November 2026:

1. The `deploy` job was removed from `.github/workflows/ci.yml`. The test jobs stay: they still run `npm run build:pages`, because Playwright serves that static export.
2. Links in `README.md`, `docs/` and the site point at the Vercel URL.
3. Repo **Settings → Pages → Source** set to *None* (Gab, after merging). The `gh-pages` branch can be deleted afterwards.
4. Figma file checked on 2026-11-18: it has no links to the old address.
5. `gh-pages` branch deleted; merged branches `revamp/phase-0` and `revamp/retire-pages` deleted.

## Cleanup after a deploy change (required)

Any change to hosting, domains or the deploy pipeline ends with section 4 of [docs/CLEANUP.md](CLEANUP.md): switch off the old site in the same piece of work, replace every old link (repo, site, Figma, plan doc, AI handoff file), check who can see the new site in a private browser window, and revoke any token used.
