# Button

> Triggers an action.

**Figma:** [Button page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=4-172) · 90 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Button | `label` |
| Show leading icon | Boolean | false | `showLeadingIcon` |
| Leading icon | Instance swap | — | `leadingIcon` |
| Show trailing icon | Boolean | false | `showTrailingIcon` |
| Trailing icon | Instance swap | — | `trailingIcon` |
| Variant | Variant | Primary · Secondary · Ghost | `variant` |
| Tone | Variant | Default · Danger | `tone` |
| State | Variant | Default · Hover · Focus · Disabled · Pressed | `(pseudo-classes / disabled)` |
| Size | Variant | Medium · Small · Large | `size` |

## When

Primary = the single main action in a view. Secondary = supporting actions (Cancel, Back). Ghost = low-emphasis, toolbar or inline actions. Tone=Danger = destructive or irreversible actions (Delete, Remove, Revoke), ideally confirmed in a dialog; never the default focused action.

## Property notes

Variant (Primary | Secondary | Ghost) · Tone (Default | Danger) · State (Default | Hover | Pressed | Focus | Disabled) · Size (Large 48 | Medium 40 | Small 32) · Label · Show/Leading icon · Show/Trailing icon.

## Tokens

Button/* component tokens (primary, secondary, ghost, danger); button/radius → shape/radius-control.

## Code

```tsx
<Button variant="primary|secondary|ghost" tone="default|danger" size="lg|md|sm" />. v3.0 replaces the deprecated Button Danger.
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
