# Text Field

> Single-line text input with label and helper text.

**Figma:** [Text Field page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=4-173) · 24 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Label | `label` |
| Value | Text | Placeholder | `value` |
| Helper text | Text | Helper text | `helperText` |
| Show label | Boolean | true | `showLabel` |
| Show helper | Boolean | true | `showHelper` |
| Show leading icon | Boolean | false | `showLeadingIcon` |
| Leading icon | Instance swap | — | `leadingIcon` |
| State | Variant | Default · Focus · Error · Disabled · Hover · Read-only | `(pseudo-classes / disabled)` |
| Filled | Variant | False · True | `filled` |
| Size | Variant | Medium · Small | `size` |

## When

Short free-text entry (name, email, search query). For long text use a Textarea (v0.4); for choosing from options use Select (v0.4).

## Property notes

State (Default | Hover | Focus | Error | Disabled | Read-only) · Filled (False | True) · Label, Value, Helper text (text) · Show label, Show helper (boolean).

## Rules

Always show a visible label — placeholder is never the label. In Error, replace helper text with how to fix it. Default width 320; stretch (fill) inside forms.

## Accessibility

In Disabled, the helper stays text/secondary so the reason it is disabled stays readable (v0.8 code audit). Border/strong meets 3:1. Error is communicated by text, not only color. Label is programmatically linked to the input.

## Tokens

bg/surface, border/strong|focus|danger|disabled, text/placeholder, radius/md, size/control-md, spacing/2-3.

## Code

<TextField label="Email" placeholder="…" helperText="…" error="…" leadingIcon="search" hideLabel disabled /> Size (Medium 40 | Small 32).

Dates → Date Field + Calendar (Date Picker); keep plain Text Fields for far-away dates people type, like birthdays.

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
