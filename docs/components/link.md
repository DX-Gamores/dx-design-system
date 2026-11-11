# Link

> Navigates to another page or resource. Always underlined so it is identifiable without color.

**Figma:** [Link page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=27-2) · 6 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Link text | `label` |
| Show trailing icon | Boolean | false | `showTrailingIcon` |
| Trailing icon | Instance swap | — | `trailingIcon` |
| State | Variant | Default · Hover · Focus | `(pseudo-classes / disabled)` |
| Size | Variant | Medium · Small | `size` |

## When

Navigation, inline references, "Learn more". Actions that change data → Button (Ghost if low emphasis).

## Property notes

State (Default | Hover | Focus) · Size (Medium = Body/Medium, Small = Body/Small) · Label · Show trailing icon · Trailing icon (default External Link for links that leave the product).

## Accessibility

Link text must make sense out of context (not "click here"). External links: show the icon and announce "opens in new tab" if applicable. Focus: 2px border/focus outline.

## Tokens

Text/brand, text/brand-hover, border/focus, size/icon-sm, spacing/1.

## Code

```tsx
<Link href="…" size="md|sm" external>View billing history</Link>
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
