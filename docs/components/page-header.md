# Page Header

> The top block of a page's content area: optional Breadcrumbs, title (the page's only H1 in code), description and page-level actions.

**Figma:** [Navigation page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=49-2) · 2 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Title | Text | Team members | `title` |
| Description | Text | Manage who can access the Acme workspace and what they can do. | `description` |
| Show breadcrumbs | Boolean | false | `showBreadcrumbs` |
| Show description | Boolean | true | `showDescription` |
| Show secondary action | Boolean | true | `showSecondaryAction` |
| Show primary action | Boolean | true | `showPrimaryAction` |
| Extra actions | Slot | — | `extraActions` |
| Show extra actions | Boolean | false | `showExtraActions` |
| Layout | Variant | Horizontal · Stacked | `layout` |

## Layouts

Horizontal (Desktop/Tablet: text left, actions right) · Stacked (Mobile: actions below, full width; title uses Heading/H3).

## Property notes

Title, Description, Show breadcrumbs/description/secondary/primary action. Actions are exposed Buttons. · Extra actions (slot: filters, view toggles, export menu)

## Rules

Max one Primary action. Put filters and tabs below the Page Header, not inside it.

## Code

<PageHeader title="…" description="…" breadcrumbs={<Breadcrumbs …/>} actions={<>…</>} />

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
