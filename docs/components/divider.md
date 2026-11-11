# Divider

> A 1px rule that separates groups of content.

**Figma:** [Divider page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=27-692) · 2 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Orientation | Variant | Horizontal · Vertical | `orientation` |

## When

Between sections of a list, card or menu when spacing alone is not enough. Prefer whitespace (gap/stack, spacing/*) first.

## Property notes

Orientation (Horizontal | Vertical). In auto layout set Horizontal to Fill width, Vertical to Fill height.

## Accessibility

Decorative by default (no role). Use role=separator only when it separates meaningful groups (e.g. in menus).

## Tokens

border/default fill, border-width/default thickness.

## Code

<Divider orientation="horizontal|vertical" />

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
