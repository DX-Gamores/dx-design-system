# Stat Card

> Not Core. Stat Card — one key number on a dashboard.

**Figma:** [Kit · Stat Card page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=107-78) · 3 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Active members | `label` |
| Value | Text | 1,284 | `value` |
| Context | Text | vs. last 30 days | `context` |
| Show trend | Boolean | true | `showTrend` |
| Trend | Variant | Positive · Negative · Neutral | `trend` |

## Property notes

Trend (Positive | Negative | Neutral — sets the Badge tone) · Label · Value · Context · Show trend.

## Rules

Label says what is counted; value uses Heading/H2 with tabular figures; the trend Badge always shows a sign (+/−) so meaning doesn't rely on color; context says the comparison period. Lay out 4 per row on Desktop (3 columns each), 2 on Tablet, 1–2 on Mobile.

## Code

```tsx
<StatCard label="Active members" value="1,284" trend={{ direction: "positive", value: "+12%" }} context="vs. last 30 days" />
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
