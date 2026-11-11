# Form Actions

> The buttons that submit or cancel a form.

**Figma:** [Form Patterns page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=52-2) · 2 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Status | Text | You have unsaved changes | `status` |
| Show status | Boolean | false | `showStatus` |
| Variant | Variant | Inline · Sticky | `variant` |

## Variants

Inline (end of a short form, after the last section) · Sticky (long settings pages: pinned to the bottom of the viewport, appears when there are unsaved changes; surface-raised + Elevation/2).

## Rules

Primary (save/submit) on the right, Cancel to its left. On Mobile, buttons fill the width (Primary on top). Disable nothing — validate on submit and show the Error Summary.

## Code

<FormActions variant="inline|sticky" status="You have unsaved changes" onCancel={…} />

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
