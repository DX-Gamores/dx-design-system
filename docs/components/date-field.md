# Date Field

> Type a date or open the Calendar from the calendar button. Pair with Calendar (popover, 4px below) to make a Date Picker.

**Figma:** [Date Picker page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=185-56) · 24 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Due date | `label` |
| Value | Text | mm/dd/yyyy | `value` |
| Helper text | Text | mm/dd/yyyy | `helperText` |
| Show label | Boolean | true | `showLabel` |
| Show helper | Boolean | true | `showHelper` |
| Show leading icon | Boolean | false | `showLeadingIcon` |
| Leading icon | Instance swap | — | `leadingIcon` |
| State | Variant | Default · Focus · Error · Disabled · Hover · Read-only | `(pseudo-classes / disabled)` |
| Filled | Variant | False · True | `filled` |
| Size | Variant | Medium · Small | `size` |

## When

a specific day near today, where weekday context helps (due dates, bookings, report ranges). Birthdays and other far-away known dates → let people type (Date Field without the calendar, or three Text Fields). Relative periods (Last 7 days) → Segmented Control or Select presets.

## Property notes

State (Default | Focus | Error | Disabled | Hover | Read-only) · Filled (False | True) · Size (Medium 40 | Small 32) · Label, Value, Helper text · Show label, Show helper, Show leading icon · Leading icon (swap). Range: same field, Value "Nov 16 – Nov 21, 2026", placeholder "Start – end date".

## Format

always show the format in the helper (mm/dd/yyyy) and accept typing; parse loosely (11/18, Nov 18), display unambiguously (Nov 18, 2026).

## Accessibility

input stays typeable; the calendar button is a separate button with aria-label "Choose date, selected Nov 18, 2026" and opens a dialog. Errors explain the rule ("Pick a date after today").

## Tokens

same as Select; calendar icon in icon/secondary.

## Code

<DatePicker label="Due date" value={date} onChange={setDate} min={today} />

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
