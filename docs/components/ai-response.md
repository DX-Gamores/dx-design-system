# AI Response

> An answer written by AI, with its disclosure, sources and controls.

**Figma:** [AI Patterns page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=197-56) · 4 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| State | Variant | Streaming · Complete · Stopped · Error | `(pseudo-classes / disabled)` |

## States

Streaming (cursor + Stop) · Complete (sources, confidence, Copy · Regenerate · Edit, feedback) · Stopped (partial answer kept, labelled) · Error (Alert explains what happened; Try again).

## Rules

Always show the AI Label; cite sources under the claim; let people stop, edit and undo; show confidence only when it's real.

## Accessibility

Container aria-live="polite" aria-busy while streaming; announce by sentence, not by token; Stop is the first focusable control; icon buttons have names.

## Code

```tsx
<AIResponse status="complete" sources={[…]} confidence="high" onRegenerate={…} onFeedback={…}>{text}</AIResponse>
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
