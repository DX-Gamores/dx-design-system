/**
 * Two ways to build the docs site:
 * - Vercel (primary from v4): plain `next build`. No base path; Vercel serves the app at the domain root.
 * - GitHub Pages (legacy, until Vercel is live): `npm run build:pages` sets PAGES_BASE_PATH and
 *   produces a static site in out/ for https://<owner>.github.io/dx-design-system/.
 * trailingSlash stays on for both, so every URL matches the sidebar links (/actions/button/).
 * @type {import("next").NextConfig}
 */
const base = process.env.PAGES_BASE_PATH;

export default {
  reactStrictMode: true,
  trailingSlash: true,
  ...(base !== undefined && {
    output: "export",
    basePath: base,
    images: { unoptimized: true },
  }),
};
