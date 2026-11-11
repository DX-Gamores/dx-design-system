# Drawer

> Full-height side panel over the page.

**Figma:** [Popover & Drawer page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=107-2) · 1 variant · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Content | Slot | — | `content` |
| Title | Text | Filters | `title` |
| Show footer | Boolean | true | `showFooter` |

## When

record details, filters, multi-field edits that keep the page in context. Short confirmations → Dialog; small details → Popover.

## Property notes

Title · Content (slot) · Show footer (primary + secondary actions). Width 400 (Desktop/Tablet), full width on Mobile.

## Tokens

bg/surface-raised, Elevation/3, border/default dividers, spacing/6 padding; scrim color/bg/overlay; layer z/modal.

## Accessibility

role="dialog", aria-modal, focus trapped, Escape and the close button dismiss.

## Code

<Drawer open title="Filters" footer={…}>…</Drawer>

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
