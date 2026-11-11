# Popover

> Small floating panel anchored to a trigger.

**Figma:** [Popover & Drawer page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=107-2) · 1 variant · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Content | Slot | — | `content` |
| Title | Text | Billing contact | `title` |
| Description | Text | Invoices and payment reminders go to this address. | `description` |
| Show title | Boolean | true | `showTitle` |
| Show content | Boolean | false | `showContent` |

## When

Extra detail, a short form or a few options next to the trigger. Not for menus of actions (use Menu) or blocking decisions (use Dialog).

## Property notes

Title · Show title · Description · Content (slot) · Show content.

## Tokens

Bg/surface-raised, border/default, shape/radius-container, Elevation/2, spacing/4; layer z/dropdown.

## Accessibility

Aria-haspopup="dialog" on the trigger; focus moves into the popover; Escape closes and returns focus.

## Code

```tsx
<Popover trigger={…} title="…">…</Popover>
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
