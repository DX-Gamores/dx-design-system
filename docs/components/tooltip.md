# Tooltip

> A short text label that appears on hover or keyboard focus of a control.

**Figma:** [Tooltip page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=35-2) · 4 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Text | Text | Tooltip text | `text` |
| Placement | Variant | Top · Bottom · Left · Right | `placement` |

## When

Naming Icon Buttons ("Edit", "More actions") and clarifying truncated text. Not for essential information, rich content or actions — use inline text, Alert or a popover.

## Property notes

Placement (Top | Bottom | Left | Right — side of the target the tooltip sits on) · Text (≤ 1 short line; wraps at 240px).

## Behaviour

Show on hover after ~duration/moderate delay and immediately on focus; hide on blur, pointer leave or Esc. Must stay visible while the pointer is over it (WCAG 1.4.13). Enter with duration/fast + easing/enter.

## Accessibility

Role=tooltip, referenced by aria-describedby (or provides the name of an icon-only button). Never put interactive elements inside.

## Tokens

Bg/inverse, text/inverse, Body/Small, radius/md, spacing/2 × spacing/3.

## Code

```tsx
<Tooltip content="Edit member" placement="top|bottom|left|right"><IconButton … /></Tooltip>
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
