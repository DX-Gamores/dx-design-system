# Dialog

> A modal window that interrupts the page for a decision or a short focused task.

**Figma:** [Dialog page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=38-2) · 4 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Title | Text | Invite a member | `title` |
| Description | Text | Description | `description` |
| Show close | Boolean | true | `showClose` |
| Show secondary action | Boolean | true | `showSecondaryAction` |
| Content | Slot | — | `content` |
| Size | Variant | Small · Medium | `size` |
| Tone | Variant | Default · Danger | `tone` |

## When

Confirming destructive/irreversible actions (Tone=Danger), or short tasks that must finish before continuing (invite, rename). Long or multi-step work → a page. Non-blocking messages → Alert/Toast.

## Property notes

Size (Small 400 | Medium 560) · Tone (Default | Danger — Danger uses Button Danger) · Title · Description · Show close · Show secondary action. Footer buttons are exposed instances (edit labels from the dialog). Put form fields in the "Content" slot (v1.1).

## Behaviour

Open over color/bg/overlay scrim. Enter: duration/slow + easing/enter (fade + 8px rise); exit: duration/moderate + easing/exit; Reduced = fade only.

## Accessibility

role=dialog + aria-modal=true, labelled by the title, described by the description. On open, focus moves inside (first field, or Cancel for Danger); Tab/Shift+Tab stay inside; Esc closes; on close focus returns to the trigger. The page behind is inert.

## Tokens

bg/surface, bg/overlay, Elevation/3, radius/xl, padding/card, gap/stack, gap/inline, Heading/H3, Body/Medium.

## Code

<Dialog open onClose={…} title="…" description="…" size="sm|md" tone="default|danger" footer={<>…</>} /> (native <dialog>)

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
