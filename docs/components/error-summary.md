# Error Summary

> Shown at the top of a form after a failed submit when there is more than one error.

**Figma:** [Form Patterns page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=52-2) · 1 variant · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Title | Text | There are 2 problems with your form | `title` |

## Content

Title states how many problems; each error is a Link (exposed) with the same text as the field's error message, pointing to that field (href="#field-id"). Add/remove links as needed.

## Behaviour

On submit with errors, render it, move focus to it (tabindex=-1), and also show each field's Error state. Remove when all errors are fixed. Single error on a short form → just focus the field.

## Accessibility

Role=alert or focus on render; links move focus to the field. Never rely on red alone — the icon + title carry the meaning.

## Tokens

Bg/danger-subtle, border/danger (strong), text/danger icon, Label/Large, Link Small.

## Code

```tsx
<ErrorSummary errors={[{ fieldId: "email", message: "…" }]} />
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
