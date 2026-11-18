/**
 * Two ways to build the docs site:
 * - Vercel (the live site, https://dx-design-system.vercel.app): plain `next build`, served at the domain root.
 * - Static export for tests: `npm run build:pages` sets PAGES_BASE_PATH and writes out/, which
 *   Playwright serves at http://localhost:4173/dx-design-system/. (GitHub Pages hosting was retired in v4.)
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
