# Select

> Choose one option from a list (select-only combobox; no typing to filter).

**Figma:** [Select page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=23-2) · 24 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Label | `label` |
| Value | Text | Select an option | `value` |
| Helper text | Text | Helper text | `helperText` |
| Show label | Boolean | true | `showLabel` |
| Show helper | Boolean | true | `showHelper` |
| Show leading icon | Boolean | false | `showLeadingIcon` |
| Leading icon | Instance swap | — | `leadingIcon` |
| State | Variant | Default · Focus · Error · Disabled · Hover · Read-only | `(pseudo-classes / disabled)` |
| Filled | Variant | False · True | `filled` |
| Size | Variant | Medium · Small | `size` |

## When

5–15 mutually exclusive options. Fewer than 5 → Radio. Needs search/filter → Combobox. Multiple choices → Checkbox list.

## Property notes

State (Default | Hover | Focus | Error | Disabled | Read-only) · Filled (False | True) · Label, Value, Helper text · Show label, Show helper, Show leading icon · Leading icon (swap). Open state = field in Focus + "Select Menu" below it.

## Accessibility

In Disabled, the helper stays text/secondary so the reason it is disabled stays readable (v0.8 code audit). role=combobox + listbox. Enter/Space/↓ opens; ↑↓ move; Enter selects; Esc closes; typing jumps to matching option. Label always visible.

## Tokens

Same as Text Field + chevron in color/icon/primary.

## Code

```tsx
<Select label="Time zone" placeholder="…" options={[{ value, label }]} error="…" /> (native <select>) Size (Medium 40 | Small 32).
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
