# Tab

> One item in a Tabs bar. Selected tabs use color/text/brand with a 2px brand indicator; unselected use text/secondary.

**Figma:** [Tabs page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=40-2) · 8 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Tab | `label` |
| Show count | Boolean | false | `showCount` |
| Show icon | Boolean | false | `showIcon` |
| Icon | Instance swap | — | `icon` |
| Selected | Variant | False · True | `selected` |
| State | Variant | Default · Hover · Focus · Disabled | `(pseudo-classes / disabled)` |

## Property notes

Selected (False | True) · State (Default | Hover | Focus | Disabled) · Label · Show count (nested Badge, exposed).

## Code

Tab: { id, label, count, disabled, panel } inside <Tabs tabs={…} /> Show icon + Icon: optional leading icon that takes the label color.

Switching how the same content is shown (no separate panels) → Segmented Control.

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
