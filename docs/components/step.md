# Step

> One step of a Stepper. Use inside Stepper.

**Figma:** [Stepper page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=189-56) · 8 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Company | `label` |
| Description | Text | Name and size | `description` |
| Show description | Boolean | true | `showDescription` |
| Number | Text | 2 | `number` |
| Show connector | Boolean | true | `showConnector` |
| State | Variant | Complete · Current · Upcoming · Error | `(pseudo-classes / disabled)` |
| Orientation | Variant | Horizontal · Vertical | `orientation` |

## States

Complete (bg/brand + check) · Current (brand ring + number, aria-current="step") · Upcoming (border/strong + number) · Error (danger ring + alert icon, description says what to fix). Status is shown by icon + text, never colour alone.

## Property notes

State · Orientation (Horizontal | Vertical) · Label · Description · Show description · Number · Show connector (turn off on the last step).

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
