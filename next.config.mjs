/**
 * `npm run build:pages` sets PAGES_BASE_PATH and produces a static site in out/
 * for GitHub Pages (https://<owner>.github.io/dx-design-system/).
 * Plain `npm run build` stays a normal Next.js server build.
 * @type {import("next").NextConfig}
 */
const base = process.env.PAGES_BASE_PATH;

export default {
  reactStrictMode: true,
  ...(base !== undefined && {
    output: "export",
    basePath: base,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};
