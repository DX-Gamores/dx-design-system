# Progress Bar

> Determinate progress.

**Figma:** [Progress page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=106-1356) · 8 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Uploading files | `label` |
| Value | Text | 60% | `value` |
| Show label | Boolean | true | `showLabel` |
| Tone | Variant | Brand · Success · Warning · Danger | `tone` |
| Size | Variant | Medium · Small | `size` |

## When

Uploads, multi-step setup, storage or quota use. Unknown duration → Spinner / Skeleton.

## Property notes

Tone (Brand | Success | Warning | Danger) · Size (Medium 8px | Small 4px) · Label · Value · Show label. Resize "indicator" to the percentage.

## Tokens

Bg/neutral-pressed track; bg/brand, bg/success, bg/warning, bg/danger indicator; radius/full.

## Accessibility

Role="progressbar" with aria-valuenow/min/max and a visible or aria label.

## Code

```tsx
<Progress value={60} tone="brand" size="md" label="Uploading files" />
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
