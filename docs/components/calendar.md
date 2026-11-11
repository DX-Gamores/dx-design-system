# Calendar

> Month grid that opens in a popover under Date Field (Date Picker), or sits inline on booking pages.

**Figma:** [Date Picker page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=185-56) · 2 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Month | Text | November 2026 | `month` |
| Show footer | Boolean | true | `showFooter` |
| Mode | Variant | Single · Range | `mode` |

## Notes

Mode: Single (Clear · Today footer) | Range (summary · Cancel · Apply footer). Month = header text. Show footer off for inline calendars that apply on click.

## Grid

7 columns × 6 rows always (height never jumps). Week starts Sunday (en-PH, en-US); start Monday for locales that do. Outside-month days stay selectable. Override a day with the Day property on any cell.

## Accessibility

Role="dialog" aria-modal + aria-label "Choose date"; grid role="grid"; selected aria-selected; today aria-current="date". ←→ day · ↑↓ week · Home/End start/end of week · PageUp/PageDown month · Shift+PageUp/PageDown year · Enter/Space select · Esc closes and returns focus to the calendar button.

## Tokens

Bg/surface-raised · border/default · Elevation/2 · radius/lg · bg/brand (selected) · bg/brand-subtle (range) · text/brand (today) · text/disabled + strikethrough.

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
