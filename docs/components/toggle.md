# Toggle

> Switch a single setting on or off with immediate effect (role=switch).

**Figma:** [Toggle page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=25-2) · 6 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Toggle label | `label` |
| Show label | Boolean | true | `showLabel` |
| Checked | Variant | False · True | `checked` |
| State | Variant | Default · Focus · Disabled | `(pseudo-classes / disabled)` |

## When

Settings that apply instantly (e.g. "Email notifications"). If the change only applies on Save/Submit → Checkbox. Choosing between options → Radio.

## Property notes

Checked (False | True) · State (Default | Focus | Disabled) · Label · Show label.

## Accessibility

Role=switch with aria-checked; Space toggles (Enter optional). The label describes the setting, not the state ("Wi-Fi", not "Turn Wi-Fi on"). Off track uses color/bg/control-off (≥3:1 against surface).

## Tokens

Bg/control-off, bg/brand, icon/on-color, size/toggle-width/height (density-aware), radius/full.

## Code

```tsx
<Toggle label="Email notifications" defaultChecked onChange={(on) => …} />
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
