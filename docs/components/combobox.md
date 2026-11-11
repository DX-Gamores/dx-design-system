# Combobox

> A text field you can type into to filter a list, then pick one option (ARIA 1.2 combobox, list autocomplete).

**Figma:** [Combobox page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=174-56) · 24 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Assignee | `label` |
| Value | Text | Search people… | `value` |
| Helper text | Text | Type a name or email | `helperText` |
| Show label | Boolean | true | `showLabel` |
| Show helper | Boolean | true | `showHelper` |
| Show leading icon | Boolean | true | `showLeadingIcon` |
| Leading icon | Instance swap | — | `leadingIcon` |
| State | Variant | Default · Focus · Error · Disabled · Hover · Read-only | `(pseudo-classes / disabled)` |
| Filled | Variant | False · True | `filled` |
| Size | Variant | Medium · Small | `size` |

## When

long or searchable lists (people, places, projects, 15+ options). 5–15 fixed options → Select. Fewer than 5 → Radio. Free text with no list → Text Field. Global search → Search Field.

## Property notes

State (Default | Focus | Error | Disabled | Hover | Read-only) · Filled (False | True) · Size (Medium 40 | Small 32) · Label, Value, Helper text · Show label, Show helper, Show leading icon · Leading icon (swap). Focus shows the caret; Filled shows the clear (×) button. Open state = field in Focus + "Combobox Menu" 4px below.

## Accessibility

role=combobox, aria-expanded, aria-controls → listbox, aria-activedescendant for the highlighted option, aria-autocomplete=list. Typing filters; ↓/↑ move; Enter selects; Esc closes then clears; Tab selects nothing and leaves. Announce result count via a polite live region.

## Tokens

same as Select + caret in bg/brand, clear in icon/secondary.

## Code

<Combobox label="Assignee" options={people} onInputChange={search} loading={isLoading} onCreate={addPerson} />

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
