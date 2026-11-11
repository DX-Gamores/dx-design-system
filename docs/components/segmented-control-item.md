# Segmented Control Item

> One segment. Use inside Segmented Control; don't place on its own.

**Figma:** [Segmented Control page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=182-56) · 16 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Label | `label` |
| Show icon | Boolean | false | `showIcon` |
| Icon | Instance swap | — | `icon` |
| Show label | Boolean | true | `showLabel` |
| Selected | Variant | False · True | `selected` |
| State | Variant | Default · Hover · Focus · Disabled | `(pseudo-classes / disabled)` |
| Size | Variant | Medium · Small | `size` |

## Property notes

Selected (False | True) · State (Default | Hover | Focus | Disabled) · Size (Medium 32 | Small 24) · Label · Show label · Show icon · Icon (swap). Icon-only = Show label off + accessible name in code + Tooltip.

SELECTED = bg/surface-raised + border/default + Elevation/1 (not colour alone). Focus = Focus/Ring.

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
