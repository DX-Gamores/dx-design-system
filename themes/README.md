# Brand gallery

One file per brand made with the theme builder (https://dx-design-system.vercel.app/themes/builder/).
`npm run brands` turns each file into:

- `dist/brands/<slug>.css` — the `[data-brand="<slug>"]` block (also loaded by the docs site)
- `dist/brands/<slug>.tokens.json` — DTCG JSON with the Figma Brand-collection names
- `dist/brands/<slug>.native.ts` — palette, fonts, shape and resolved colours for React Native
- `public/r/v4/theme-<slug>.json` — the registry item: `npx shadcn@latest add @dx/theme-<slug>`

The build fails if a brand doesn't pass the 27-pair contrast audit in all four colour modes.

To add a brand: in the builder, choose **Add to the gallery** (opens a pre-filled file on GitHub), or save the
builder's input as `themes/<slug>.json` and open a pull request.
