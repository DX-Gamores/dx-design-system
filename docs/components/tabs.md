# Tabs

> Switch between related views of the same content without leaving the page.

**Figma:** [Tabs page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=40-2) · 1 variant · open in view-only mode — no seat needed.

## When

2–6 peer views (Members / Invites / Roles). Sequential steps → a stepper (planned). Navigation between pages → navigation (v0.6). Filtering a list → Select or chips.

## Structure

Tab instances in a tablist over a Divider baseline. Override labels/selection on nested tabs; add or remove tabs.

## Accessibility

role=tablist / tab / tabpanel; only the selected tab is in the Tab order; ←/→ move between tabs (Home/End jump). Automatic activation (panel switches on arrow) when panels are instant; manual activation (Enter/Space) when panels load slowly.

## Motion

indicator slides with duration/moderate + easing/standard; Reduced = no slide.

## Code

<Tabs label="Member views" tabs={[{ id, label, count, panel }]} />

Switching how the same content is shown (no separate panels) → Segmented Control.

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
