# Deploying the docs site

From v4 the docs site, registry and downloads are hosted on **Vercel**. GitHub Pages keeps running until the Vercel site is live and checked, then its deploy job is switched off.

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

- Open `/`, `/actions/button/`, `/start/gallery/` and `/starter/`. Brand, theme and density switches work.
- Press `⌘K` (Mac) or `Ctrl+K` (Windows) and search for "dialog".
- Hover a code block on `/start/getting-started/` and press **Copy**.

## Switching off GitHub Pages

When the Vercel site is confirmed:

1. In `.github/workflows/ci.yml`, delete the `deploy` job (it publishes `out/` to the `gh-pages` branch). Keep the test jobs: they still run `npm run build:pages` because Playwright serves the static export.
2. In the repo **Settings → Pages**, set the source to *None*.
3. Replace links to `dx-gamores.github.io/dx-design-system` in `README.md` and the Figma file with the Vercel URL.
