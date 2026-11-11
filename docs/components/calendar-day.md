# Calendar Day

> One cell of the Calendar grid (40×40 hit area, 32px circle).

**Figma:** [Date Picker page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=185-56) · 10 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Day | Text | 18 | `day` |
| State | Variant | Default · Hover · Focus · Today · Selected · Range start · In range · Range end · Outside month · Disabled | `(pseudo-classes / disabled)` |

## States

Default · Hover · Focus (keyboard, Focus/Ring) · Today (brand ring + brand text, aria-current="date") · Selected (bg/brand) · Range start / In range / Range end (bg/brand-subtle band) · Outside month (text/secondary, still selectable) · Disabled (text/disabled + a drawn strike line — not colour alone; aria-disabled).

Day = the number. Use inside Calendar; don't place on its own.

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
