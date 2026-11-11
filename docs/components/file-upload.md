# File Upload

> Drop zone for attaching files.

**Figma:** [File Upload page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=107-37) · 5 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Helper text | Text | PDF, PNG or JPG, up to 10 MB | `helperText` |
| State | Variant | Default · Hover · Dragging · Error · Disabled | `(pseudo-classes / disabled)` |

## When

Forms that need documents or images. State the accepted types and size limit in Helper text. List uploads below with Progress Bar + a remove Icon Button.

## Property notes

State (Default | Hover | Dragging | Error | Disabled) · Helper text.

## Tokens

Border/strong (dashed), border/focus while dragging, bg/selected, bg/danger-subtle + text/danger for errors, shape/radius-container.

## Accessibility

The whole zone is a labelled button that opens the file picker; announce upload progress and errors.

## Code

```tsx
<FileUpload accept=".pdf,.png,.jpg" maxSize="10MB" onFiles={…} />
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
