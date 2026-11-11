# Sidebar

> Primary app navigation, used together with the App Header.

**Figma:** [Navigation page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=49-2) · 3 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Header | Slot | — | `header` |
| Footer | Slot | — | `footer` |
| Show header | Boolean | false | `showHeader` |
| Show footer | Boolean | false | `showFooter` |
| Variant | Variant | Expanded · Rail · Drawer | `variant` |

## Variants

Expanded (Desktop, 256px, icon + label) · Rail (Tablet, 72px, icons only — labels in Tooltips) · Drawer (Mobile, 288px, opens from the header Menu button over color/bg/overlay, with Close). Width comes from layout/sidebar-width; each variant pins its Layout mode.

## Structure

nav (Nav Item instances; override labels, icons, Selected) → Divider → account row (Avatar + name).

## Accessibility

<nav aria-label="Main">. Drawer behaves like a modal dialog (focus trapped, Esc closes, focus returns to the Menu button). Desktop users can collapse Expanded → Rail with the header Menu button (aria-expanded).

## Code

<Sidebar items={[{ label, href, icon, count, current }]} variant="expanded|rail" />

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
