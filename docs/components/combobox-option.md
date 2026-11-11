# Combobox Option

> One row in the Combobox Menu. Same states as Select Option; Active = the option highlighted with the arrow keys (aria-activedescendant) — DOM focus stays in the input, so it gets a background + 2px brand bar, not a focus ring, Selected = the committed value (check).

**Figma:** [Combobox page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=174-56) · 5 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Option | `label` |
| Show leading icon | Boolean | false | `showLeadingIcon` |
| Leading icon | Instance swap | — | `leadingIcon` |
| Show description | Boolean | false | `showDescription` |
| Description | Text | Secondary detail | `description` |
| State | Variant | Default · Hover · Selected · Disabled · Active | `(pseudo-classes / disabled)` |

## Notes

Optional leading icon (swap) and a second line (Description) for people, places and records. Bold the characters that match the query using the Label text style.

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
