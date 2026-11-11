# Adding a brand (new product or client)

Every component reads colours, fonts and corner radius from the **Brand** layer, so a new brand is one new mode, not a redesign.

## In Figma (design, one seat)

1. In **Variables → Brand**, add a mode, e.g. `Client · Acme`.
2. Set its values:
   - **primary:** the 50–950 ramp. Pick from Primitives, or add a new ramp to Primitives first.
   - **accent and neutral:** their ramps.
   - **font-family:** heading and body.
   - **shape:** the control and container radius.
3. Check the **Themes & Brands** page: switch any frame to the new mode and look at all four colour modes.
4. Ask Claude to run the release audit, including the contrast check across brands × modes, then publish.

## In code

1. Re-export the variables (see [WORKFLOW.md](WORKFLOW.md)) and run `npm run tokens`.
2. The build adds a `[data-brand="…"]` block to `dist/tokens.css`. Add its name to the selector map at the top of `scripts/build-tokens.mjs` (`brandSel`) and to `brands` in `dist/tokens.ts`.
3. Load the brand's font in `src/app/fonts.ts`.
4. Set `<html data-brand="acme">`. Nothing else changes.

## Quick option, no Figma change (prototypes only)

Override the brand ramp in your app's CSS:

```css
[data-brand="acme"] {
  --ds-brand-primary-50: #f0f7ff;   /* … through 950 */
  --ds-brand-primary-600: #0057b8;
  --ds-font-family-heading: "Acme Sans", system-ui, sans-serif;
  --ds-font-family-body: "Acme Sans", system-ui, sans-serif;
}
```

Bring it back into Figma before it ships, so design and code stay in sync.

## Contrast checklist for a new brand

- `brand/role/solid` (buttons, selected states) against white text is **≥ 4.5:1**.
  - If it isn't, set `on-solid` to dark text. The amber brand does this.
- In the HC modes, `solid-hc` is **≥ 7:1**.
- Focus ring (`brand/role/focus`) against the surface is **≥ 3:1**.
