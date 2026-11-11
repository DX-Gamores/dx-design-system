# Avatar

> Represents a person or workspace.

**Figma:** [Avatar page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=27-623) · 9 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Initials | Text | JC | `initials` |
| Show status | Boolean | false | `showStatus` |
| Size | Variant | Small · Medium · Large | `size` |
| Type | Variant | Initials · Icon · Image | `type` |

## When

Next to names in lists, comments, headers and account menus. Use Type=Initials when a name is known, Type=Icon as the fallback. For photos, add an image fill to the avatar frame on the instance (initials stay as fallback).

## Property notes

Size (Small 24 | Medium 32 | Large 40) · Type (Initials | Icon | Image — replace the "image" layer fill with a photo) · Initials (text, 1–2 characters).

## Accessibility

Decorative when the name is shown beside it (alt=""); otherwise the accessible name is the person's name, not the initials.

## Tokens

size/avatar-sm|md|lg, radius/full, bg/brand-subtle, text/brand.

## Code

<Avatar name="Jane Cooper" size="sm|md|lg" decorative /> Show status: presence dot (success color; recolor the "status" layer for away/busy).

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
