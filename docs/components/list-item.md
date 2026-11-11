# List Item

> One row in a simple list (members, files, notifications). Replaces hand-built rows from the v0.4.1 agent test.

**Figma:** [Lists & Tables page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=51-2) · 4 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Title | Text | Jane Cooper | `title` |
| Description | Text | jane@acme.com | `description` |
| Show leading | Boolean | true | `showLeading` |
| Show description | Boolean | true | `showDescription` |
| Show meta | Boolean | true | `showMeta` |
| Show action | Boolean | true | `showAction` |
| Trailing | Slot | — | `trailing` |
| Show trailing | Boolean | false | `showTrailing` |
| State | Variant | Default · Hover · Selected · Focus | `(pseudo-classes / disabled)` |

## Property notes

State (Default | Hover | Selected | Focus) · Title, Description · Show leading (Avatar, exposed — swap for an icon if needed) · Show meta (Badge, exposed) · Show action (Icon Button, exposed; set Accessible label per row). · Trailing (slot: badge, toggle, price, custom controls)

## Text

title and description wrap (never clip); keep descriptions to one sentence.

## Layout

Stack items with a Divider between them inside a bg/surface + border/default + radius/lg container. Padding padding/card × padding/row (density-aware). Need columns, sorting or comparison → Table.

## Code

<List label="…"><ListItem title="…" description="…" leading={<Avatar …/>} meta={<Badge …/>} action={<Menu …/>} /></List>

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
