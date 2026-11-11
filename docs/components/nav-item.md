# Nav Item

> One destination in the Sidebar.

**Figma:** [Navigation page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=49-2) · 8 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Dashboard | `label` |
| Icon | Instance swap | — | `icon` |
| Show count | Boolean | false | `showCount` |
| State | Variant | Default · Hover · Selected · Focus | `(pseudo-classes / disabled)` |
| Collapsed | Variant | False · True | `collapsed` |

## Property notes

State (Default | Hover | Selected | Focus) · Collapsed (False = icon + label | True = 40px icon only, for the tablet rail) · Label · Icon (swap) · Show count (nested Badge, expanded only).

## Accessibility

It is a link. The current page has aria-current="page" (= Selected). Collapsed items keep the label as accessible name and show it in a Tooltip on hover/focus. Focus uses the standard Focus/Ring.

## Code

Nav item: { label, href, icon, count, current } inside <Sidebar items={…} />

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
