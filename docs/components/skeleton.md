# Skeleton

> A placeholder that mirrors the shape of content while it loads.

**Figma:** [Loading page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=42-2) · 3 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Shape | Variant | Text · Circle · Block | `shape` |

## When

Loading content whose layout is known (lists, cards, profiles) and takes longer than ~300ms. Unknown layout or short actions → Spinner.

## Property notes

Shape (Text — resize width to the expected line length; Circle — avatar; Block — images/cards). Compose skeleton rows that match the real layout exactly.

## Motion

Optional shimmer/pulse with duration/slow + easing/standard, looping; Reduced = static.

## Accessibility

Mark the loading region aria-busy=true and announce completion via a polite status message; skeletons are hidden from assistive tech.

## Tokens

Bg/surface-subtle, radius/sm | full | md, size/avatar-lg.

## Code

```tsx
<Skeleton shape="text|circle|block" width={…} />
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
