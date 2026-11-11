# Checkbox

> Select zero, one or many independent options.

**Figma:** [Checkbox page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=4-174) · 15 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Checkbox label | `label` |
| Show label | Boolean | true | `showLabel` |
| Checked | Variant | False · True · Indeterminate | `checked` |
| State | Variant | Default · Focus · Disabled · Hover · Error | `(pseudo-classes / disabled)` |

## When

Multiple selection or a single opt-in applied on submit. Use Radio (v0.4) for mutually exclusive choices and Toggle (v0.4) for instant on/off settings.

## Property notes

Checked (False | True | Indeterminate) · State (Default | Hover | Focus | Error | Disabled) · Label (text) · Show label (boolean).

## Rules

Indeterminate only for a parent whose children are partially selected. Whole row is the click target.

## Accessibility

Unchecked border ≥3:1. State shown by icon, not color alone. Space toggles.

## Tokens

bg/surface, bg/brand, border/strong, icon/on-color, radius/sm, size/icon-md.

## Code

<Checkbox label="Email" defaultChecked | indeterminate | disabled />

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
