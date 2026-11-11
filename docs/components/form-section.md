# Form Section

> Groups related fields under a title and description inside long forms and settings pages.

**Figma:** [Form Patterns page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=52-2) · 2 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Title | Text | Profile | `title` |
| Description | Text | This information is visible to everyone in the workspace. | `description` |
| Fields | Slot | — | `fields` |
| Layout | Variant | Side by side · Stacked | `layout` |

## Layouts

Side by side (Desktop/Tablet: intro column 340px + fields filling the rest, gap = layout/gutter) · Stacked (Mobile).

## Content

the "fields" frame holds placeholder fields — replace with any inputs (Text Field, Select, Textarea, Radio group, Toggle…), keep gap/stack between them. Sections are separated by a top border and layout/section-gap padding.

## Accessibility

each section is a <fieldset> (or region) with the title as its <legend>/heading.

## Code

<FormSection title="…" description="…">{fields}</FormSection>

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
