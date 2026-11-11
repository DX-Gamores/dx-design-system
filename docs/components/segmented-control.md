# Segmented Control

> Pick one of 2–5 related options that change how the same content is shown (view, period, filter). Selection applies immediately.

**Figma:** [Segmented Control page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=182-56) · 8 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Items | Variant | 2 · 3 · 4 · 5 | `items` |
| Size | Variant | Medium · Small | `size` |

## When

2–5 short, mutually exclusive options; switch views (List | Board), periods (Day | Week | Month) or filters (All | Open | Closed). More than 5 or long labels → Select. Separate content panels → Tabs. Choice submitted with a form → Radio. On/off → Toggle. Actions → Buttons.

## Property notes

Items (2–5) · Size (Medium 40 | Small 32). Each segment is exposed: set Selected, Label, Show icon, Icon, Show label from the parent. Segments are equal width — resize the control or set it to Fill for full width.

## Accessibility

Role=radiogroup + aria-label; segments role=radio + aria-checked. Tab enters on the selected segment; ←/→ move and select; Home/End jump. If it swaps panels, use the Tabs pattern (tablist/tab) instead. Icon-only segments need aria-label + Tooltip. Small segments are 24px tall (WCAG 2.5.8 minimum).

## Tokens

Track bg/surface-subtle + border/default · selected bg/surface-raised + border/default + Elevation/1 · text/secondary → text/primary · radius 8 outer / 4 inner · size/control-md|sm.

## Code

```tsx
<SegmentedControl aria-label="View" value={view} onChange={setView} options={[{ value: 'list', label: 'List' }, …]} size="md" />
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
