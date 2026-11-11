# Accordion Item

> One collapsible section.

**Figma:** [Accordion page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=106-1409) · 6 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Title | Text | What is included in the plan? | `title` |
| Description | Text | Every plan includes unlimited projects, 10 GB of storage per member and email support. | `description` |
| Content | Slot | — | `content` |
| Show content | Boolean | false | `showContent` |
| Expanded | Variant | False · True | `expanded` |
| State | Variant | Default · Hover · Focus | `(pseudo-classes / disabled)` |

## When

FAQs, grouped settings, long forms where users need only some sections. Not for navigation (use Tabs) or primary content that everyone needs.

## Property notes

Expanded (False | True) · State (Default | Hover | Focus) · Title · Description · Content (slot, expanded only).

## Tokens

border/default divider, bg/neutral-hover, text/primary, text/secondary, icon/secondary; spacing/4 padding.

## Accessibility

header is a button with aria-expanded and aria-controls.

## Code

<Accordion><Accordion.Item title="…">…</Accordion.Item></Accordion>

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
