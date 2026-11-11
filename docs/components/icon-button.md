# Icon Button

> A square button with only an icon (row actions, toolbars, close, overflow menus).

**Figma:** [Button page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=4-172) · 90 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Icon | Instance swap | — | `icon` |
| Accessible label | Text | More actions | `accessibleLabel` |
| Variant | Variant | Primary · Secondary · Ghost | `variant` |
| Tone | Variant | Default · Danger | `tone` |
| State | Variant | Default · Hover · Focus · Disabled · Pressed | `(pseudo-classes / disabled)` |
| Size | Variant | Medium · Small · Large | `size` |

## When

The icon is universally understood (More, Close, Edit, Trash) and space is tight, e.g. per-row actions in lists. If the action needs words to be clear → Button with a label.

## Property notes

Variant (Primary | Secondary | Ghost) · Tone (Default | Danger) · State (Default | Hover | Pressed | Focus | Disabled) · Size (Large 48 | Medium 40 | Small 32) · Icon · Accessible label.

## Accessibility

Always set Accessible label to the action ("More actions for Jane Cooper"). Pair with a tooltip (v0.5). Target ≥24px in Compact.

## Tokens

Same as Button; square size/control-*; icon size/icon-md (Medium) / size/icon-sm (Small).

## Code

```tsx
<IconButton icon="more" label="More actions for Jane Cooper" variant="ghost|secondary|primary" size="md|sm" />
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
