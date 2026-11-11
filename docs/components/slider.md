# Slider

> Pick a value (Single) or a range (Range) on a continuous scale where the exact number matters less than the position: volume, price filters, zoom.

**Figma:** [Slider page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=191-56) · 4 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Label | Text | Label | `label` |
| Value | Text | Value | `value` |
| Show header | Boolean | true | `showHeader` |
| Show min/max | Boolean | true | `showMinmax` |
| Show input | Boolean | false | `showInput` |
| Type | Variant | Single · Range | `type` |
| State | Variant | Default · Disabled | `(pseudo-classes / disabled)` |

## When

approximate values within known bounds. Exact numbers → Text Field (number) — or turn on Show input. Few discrete choices → Segmented Control / Radio.

## Property notes

Type (Single | Range) · State (Default | Disabled) · Label · Value (formatted, e.g. "₱2,000 – ₱8,000") · Show header · Show min/max · Show input (numeric fields synced with the thumbs). Thumbs are exposed: set Hover/Focus/Pressed from the parent. Move a thumb by nudging its x; the fill is a separate layer.

## Accessibility

each thumb role="slider" with aria-valuemin/max/now + aria-valuetext ("₱2,000"); Range thumbs get aria-label "Minimum price" / "Maximum price". ←↓ −1 step, →↑ +1, PgUp/PgDn ±10%, Home/End min/max. WCAG 2.5.7: dragging is never required — click the track or type in the input. Thumb hit area 40px.

## Tokens

rail bg/control-off · fill bg/brand · thumb bg/surface + 2px bg/brand · disabled bg/disabled + icon/disabled.

## Code

<Slider label="Volume" value={v} onChange={setV} min={0} max={100} /> · <RangeSlider label="Price" value={[2000, 8000]} min={0} max={10000} step={500} format={peso} showInputs />

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
