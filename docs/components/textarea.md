# Textarea

> Multi-line free text (comments, descriptions, feedback).

**Figma:** [Textarea page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=26-2) · 12 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Label | `label` |
| Value | Text | Describe the issue… | `value` |
| Helper text | Text | Helper text | `helperText` |
| Counter | Text | 0 / 500 | `counter` |
| Show label | Boolean | true | `showLabel` |
| Show helper | Boolean | true | `showHelper` |
| Show counter | Boolean | true | `showCounter` |
| State | Variant | Default · Focus · Error · Disabled · Hover · Read-only | `(pseudo-classes / disabled)` |
| Filled | Variant | False · True | `filled` |

## When

Answers longer than one line. Single-line values → Text Field.

## Property notes

State (Default | Hover | Focus | Error | Disabled | Read-only) · Filled (False | True) · Label, Value, Helper text, Counter · Show label, Show helper, Show counter. The field grows with content from a minimum height (size/textarea-min).

## Accessibility

In Disabled, the helper stays text/secondary so the reason it is disabled stays readable (v0.8 code audit). Visible label; helper/error and counter linked via aria-describedby; announce the limit, not every keystroke.

## Tokens

same as Text Field + size/textarea-min, spacing/2 vertical padding.

## Code

<Textarea label="Bio" showCounter maxLength={160} helperText="…" error="…" />

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
