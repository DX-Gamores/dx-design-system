# Combobox Menu

> The listbox that opens 4px under a focused Combobox. Content: Results (matches bolded; Focus = highlighted with arrow keys) · Recent (empty query) · Loading (async search, show after 300ms) · No results (say what was typed + what to try) · Create (offer to add the typed value). Show keyboard hint for first-run or power-user surfaces. Max height 320 then scroll; width = field width.

**Figma:** [Combobox page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=174-56) · 5 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Show keyboard hint | Boolean | false | `showKeyboardHint` |
| Content | Variant | Results · Recent · Loading · No results · Create | `content` |

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
