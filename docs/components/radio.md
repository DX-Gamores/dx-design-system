# Radio

> Pick exactly one option from a small, visible set (2–5). Always used in a group with a visible group label.

**Figma:** [Radio page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=24-2) · 10 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Radio label | `label` |
| Show label | Boolean | true | `showLabel` |
| Checked | Variant | False · True | `checked` |
| State | Variant | Default · Focus · Disabled · Hover · Error | `(pseudo-classes / disabled)` |

## When

Mutually exclusive choices that benefit from being seen at once. More than ~5 options → Select. Independent choices → Checkbox. Instant on/off → Toggle.

## Property notes

Checked (False | True) · State (Default | Hover | Focus | Error | Disabled) · Label · Show label.

## Accessibility

Radiogroup with an accessible name. Tab enters the group on the selected radio; arrow keys move focus and select; Space selects. State shown by the dot, not color alone.

## Tokens

Bg/surface, bg/brand, border/strong, icon/on-color, radius/full, size/icon-md, gap/inline.

## Code

```tsx
<RadioGroup label="Billing cycle" name="cycle" options={[…]} defaultValue="m" />  ·  single: <Radio label="…" />
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
