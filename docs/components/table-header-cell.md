# Table Header Cell

> Column header. Sort: None (sortable, unsorted) · Ascending · Descending · Not sortable.

**Figma:** [Lists & Tables page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=51-2) · 4 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Name | `label` |
| Sort | Variant | None · Ascending · Descending · Not sortable | `sort` |

## Accessibility

`<th scope="col">` with aria-sort on the sorted column only; the label is a button that toggles sort. Resize width to the column; use the same width for every cell in that column.

## Code

```tsx
<Table columns={[{ key, header, sortable, render }]} sort={{ key, direction }} … />  (header cell)
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
