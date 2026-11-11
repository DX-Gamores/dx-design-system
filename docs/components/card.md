# Card

> Container grouping content and up to two actions about one subject.

**Figma:** [Card page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=4-176) · 2 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Title | Text | Card title | `title` |
| Body | Text | Supporting text that explains the content of this card in one or two short sentences. | `body` |
| Show actions | Boolean | true | `showActions` |
| Media | Slot | — | `media` |
| Content | Slot | — | `content` |
| Show media | Boolean | false | `showMedia` |
| Show content | Boolean | false | `showContent` |
| Elevation | Variant | Flat · Raised | `elevation` |

## When

Flat (border only) inside other surfaces, lists and dense grids. Raised (Elevation/2) when the card sits directly on the canvas or needs emphasis.

## Property notes

Elevation (Flat | Raised) · Title, Body (text) · Show actions (boolean). Contains nested Button instances (Primary + Secondary) that can be overridden. · Media (slot: image, chart, illustration) · Content (slot: lists, key–value rows, fields)

## Rules

One topic per card. Don't nest cards. Don't mix Flat and Raised in one list. Default width 360; stretch in grids.

## Tokens

Bg/surface, border/default, radius/lg, spacing/6 padding, spacing/4 gap, Heading/H4 + Body/Small.

## Code

```tsx
<Card title="…" elevation="flat|raised" actions={<>…</>}>Body</Card>
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
