# Badge

> Short, non-interactive status or category label (1–2 words).

**Figma:** [Badge page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=4-175) · 6 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Badge | `label` |
| Tone | Variant | Neutral · Brand · Success · Warning · Danger · Info | `tone` |

## When

Show status (Active, Pending), category or "New". Not clickable — use Button for actions.

## Property notes

Tone (Neutral | Brand | Success | Warning | Danger | Info) · Label (text).

## Rules

Same status = same tone everywhere. Danger only for critical states.

## Accessibility

Meaning carried by the label text, not color alone.

## Tokens

Bg/*-subtle with matching text/*, radius/full, spacing/0-5 and spacing/2.

## Code

```tsx
<Badge tone="neutral|brand|success|warning|danger">Active</Badge>
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
