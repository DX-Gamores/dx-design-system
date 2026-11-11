# Pagination

> Moves through pages of a table or list. Summary text (what is shown) + previous/next Icon Buttons (Secondary, Small; Disabled at the ends) + current page. <nav aria-label="Table pagination">; announce the new range in a polite status message after paging.

**Figma:** [Lists & Tables page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=51-2) · 1 variant · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Summary | Text | Showing 1–10 of 48 | `summary` |
| Page | Text | Page 1 of 5 | `page` |

## Code

```tsx
<Pagination page={1} pageCount={5} summary="Showing 1–10 of 48" onPageChange={…} />
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
