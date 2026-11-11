# Spinner

> Indicates that something is in progress when its duration and shape are unknown.

**Figma:** [Loading page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=42-2) · 3 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Size | Variant | Small · Medium · Large | `size` |

## When

Short waits (< ~2 s) for an action or a small region; inside buttons for "Saving…". Known layout → Skeleton. Long tasks → progress with text (planned).

## Property notes

Size (Small 16 — inline/buttons · Medium 20 — inputs, small regions · Large 32 — panels).

## Motion

Rotate 360° with a 1s linear loop; Reduced = slow (≥2s) rotation or a static indicator plus text.

## Accessibility

Provide text ("Loading members…") via aria-label or visible label; set aria-busy on the region; don't announce repeatedly.

## Tokens

Border/default track, bg/brand indicator, size/icon-sm | icon-md | control-sm.

## Code

```tsx
<Spinner size="sm|md|lg" label="Loading members" />
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
