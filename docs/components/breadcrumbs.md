# Breadcrumbs

> Shows where the page sits in the hierarchy. Up to 2 ancestor Links (exposed) + the current page (plain text, aria-current="page"). <nav aria-label="Breadcrumb">. Hide on Mobile when the back path is obvious; never more than 4 levels.

**Figma:** [Navigation page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=49-2) · 1 variant · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Current page | Text | Team members | `currentPage` |
| Show level 1 | Boolean | true | `showLevel1` |

## Code

```tsx
<Breadcrumbs items={[{ label: "Settings", href }, { label: "Members" }]} />
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
