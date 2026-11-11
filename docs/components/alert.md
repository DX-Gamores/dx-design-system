# Alert

> An inline, persistent message about the page or a section (also called banner or callout).

**Figma:** [Alert page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=36-2) · 4 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Title | Text | Title | `title` |
| Description | Text | Short explanation of what happened and what to do next. | `description` |
| Show title | Boolean | true | `showTitle` |
| Show action | Boolean | false | `showAction` |
| Show close | Boolean | false | `showClose` |
| Tone | Variant | Info · Success · Warning · Danger | `tone` |

## When

Information the user must notice and may need to act on: errors that block progress, warnings, important status. Stays until resolved or dismissed. Brief confirmation of an action → Toast. Field-level errors → the field's Error state.

## Property notes

Tone (Info | Success | Warning | Danger) · Title, Description · Show title, Show action (nested Link, exposed), Show close (Icon Button "Close").

## Accessibility

Static alerts are plain content. If inserted dynamically: Danger uses role=alert (assertive); others role=status (polite). The icon is decorative — the title carries the meaning. Never rely on tone color alone.

## Tokens

Bg/{brand,success,warning,danger}-subtle, matching text/* for the icon, text/primary + text/secondary, padding/row, radius/md.

## Code

```tsx
<Alert tone="info|success|warning|danger" title="…" action={<Link …/>} onDismiss={…} live>Description</Alert>
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
