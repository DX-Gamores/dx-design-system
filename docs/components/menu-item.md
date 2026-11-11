# Menu Item

> One action inside a Menu.

**Figma:** [Menu page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=39-2) · 8 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Edit | `label` |
| Show icon | Boolean | true | `showIcon` |
| Icon | Instance swap | — | `icon` |
| Show shortcut | Boolean | false | `showShortcut` |
| Shortcut | Text | ⌘E | `shortcut` |
| Tone | Variant | Default · Danger | `tone` |
| State | Variant | Default · Hover · Disabled · Focus | `(pseudo-classes / disabled)` |

## Property notes

Tone (Default | Danger) · State (Default | Hover | Disabled | Focus) · Label · Show icon + Icon (swap) · Show shortcut + Shortcut. Hover also represents keyboard focus (menus use a moving highlight, not a focus ring).

## Rules

Labels stay on one line (truncate with …; keep them short so they never need to). Labels are verbs ("Edit role", "Remove from workspace"). Danger items go last, after a Divider. Use icons on all items in a menu or none.

## Code

Menu item: { label: "Edit role", icon: "edit", tone: "default|danger", disabled }

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
