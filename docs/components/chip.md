# Chip

> Compact selectable token for filters and tags.

**Figma:** [Chip page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=106-2) · 8 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Chip label | `label` |
| Removable | Boolean | false | `removable` |
| Selected | Variant | False · True | `selected` |
| State | Variant | Default · Hover · Focus · Disabled | `(pseudo-classes / disabled)` |

## When

filter bars, multi-select choices, removable tags. Not for actions (use Button) or status (use Badge).

## Property notes

Selected (False | True) · State (Default | Hover | Focus | Disabled) · Label · Removable.

## Tokens

bg/surface, bg/selected, border/strong, border/selected, text/brand; radius/full; size/control-sm.

## Code

<Chip selected onRemove={…}>Label</Chip>

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
