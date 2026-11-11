# Toast

> A brief, non-blocking confirmation that appears in a corner (bottom-right or bottom-center) and goes away.

**Figma:** [Toast page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=37-2) · 5 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Message | Text | Message | `message` |
| Show action | Boolean | false | `showAction` |
| Show close | Boolean | true | `showClose` |
| Tone | Variant | Neutral · Success · Danger · Warning · Info | `tone` |

## When

Confirming an action the user just took ("Invitation sent", "Link copied"), optionally with Undo. Anything the user must notice or act on → Alert or Dialog.

## Property notes

Tone (Neutral | Success | Danger | Warning | Info) · Message · Show action (nested Ghost Button, exposed, e.g. "Undo") · Show close.

## Behaviour

Auto-dismiss after ≥5 s; hover or focus pauses the timer (WCAG 2.2.1). Danger toasts and toasts with an action do NOT auto-dismiss. Stack max 3, newest on top. Enter: duration/moderate + easing/enter; exit: duration/fast + easing/exit; Reduced = no slide.

## Accessibility

Render inside one persistent live region: role=status (polite) for Neutral/Success, role=alert for Danger. Don't move focus to the toast. Never the only evidence that something happened.

## Tokens

bg/surface, border/default, Elevation/3, radius/md, padding/row, icon colors text/success|danger, icon/primary.

## Code

const toast = useToast(); toast.show({ message: "…", tone: "neutral|success|danger", action: { label: "Undo", onClick } })  — wrap the app in <ToastProvider>

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
