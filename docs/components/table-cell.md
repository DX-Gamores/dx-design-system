# Table Cell

> One cell in a data table row. Types: Text · Two-line · Avatar (person) · Badge (status) · Numeric (right-aligned, tabular) · Checkbox (row selection, 48px) · Actions (Icon Button "More", 64px).

**Figma:** [Lists & Tables page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=51-2) · 8 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Value | Text | Editor | `value` |
| Secondary | Text | jane@acme.com | `secondary` |
| Cell content | Slot | — | `cellContent` |
| Type | Variant | Text · Two-line · Avatar · Badge · Numeric · Checkbox · Actions · Custom | `type` |

## Notes

COMPOSE A TABLE: a header row of Table Header Cells, then rows = horizontal auto-layout frames of Table Cells with matching widths (fill the flexible column) and EVERY body cell set to Fill height, so bottom borders line up (header cells keep their fixed size/control-md height). Row hover = color/bg/neutral-hover; selected row = color/bg/brand-subtle. Wrap in bg/surface + border/default + radius/lg, clip content.

## Accessibility

real <table> with a caption/accessible name; checkbox cells label "Select <row name>"; action Icon Buttons include the row name ("More actions for Jane Cooper"). On Mobile, switch a table to List Items unless columns are essential.

## Code

<Table caption="…" columns={[…]} rows={…} rowKey={…} />  (cells via column render)

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
