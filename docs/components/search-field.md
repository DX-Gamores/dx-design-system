# Search Field

> Single-line search with a search icon and clear button.

**Figma:** [Search Field page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=106-1255) · 16 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Value | Text | Search | `value` |
| State | Variant | Default · Hover · Focus · Disabled | `(pseudo-classes / disabled)` |
| Filled | Variant | False · True | `filled` |
| Size | Variant | Medium · Small | `size` |

## When

Header search, table toolbars, list filters. For picking one value from a long list use Combobox.

## Property notes

State (Default | Hover | Focus | Disabled) · Filled (False | True — shows the clear button) · Size (Medium 40 | Small 32) · Value.

## Tokens

Field/bg, field/border, field/radius → shape/radius-control, border/hover, border/focus, icon/secondary.

## Accessibility

Role="searchbox", label "Search `<thing>`", clear button label "Clear search".

## Code

```tsx
<SearchField size="md|sm" onClear={…} />
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
