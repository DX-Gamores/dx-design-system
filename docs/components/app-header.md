# App Header

> The top bar of every app screen. Height = layout/header-height (64 Desktop / 56 Tablet+Mobile).

**Figma:** [Navigation page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=49-2) · 3 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Product name | Text | Acme | `productName` |
| Actions | Slot | — | `actions` |
| Show actions slot | Boolean | false | `showActionsSlot` |
| Layout | Variant | Desktop · Desktop with nav · Mobile | `layout` |

## Layouts

Desktop (Menu button collapses the Sidebar to a rail · brand · search · notifications · account) · Desktop with nav (header-only pattern: brand + top nav links, no sidebar) · Mobile (Menu opens the Sidebar Drawer · brand · search icon · account).

## Property notes

Layout · Product name. Replace the logo-mark with your logo; nested instances are editable. · Actions (slot: extra header actions such as a help menu, language or theme switch)

## Accessibility

`<header role="banner">`. Skip Link comes before it. Top nav links use Tab visuals but link semantics (aria-current="page"), not role=tab. Menu button has aria-expanded + aria-controls.

## Code

```tsx
<AppHeader productName="Acme" userName="Jane Cooper" onMenuClick={…} onSearch={…} />
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
