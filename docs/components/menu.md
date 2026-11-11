# Menu

> A list of actions that opens from a trigger (usually an Icon Button "More" or a Button with a Chevron Down).

**Figma:** [Menu page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=39-2) · 1 variant · open in view-only mode — no seat needed.

## When

Secondary actions on an object or page. Choosing a value → Select. Navigation → Link list / navigation (v0.6).

## Size

280 default (min 200, max 320); items never wrap.

## Structure

Menu Item instances, Divider between groups, Danger items last. Override labels/icons on nested items; add or remove rows.

## Behaviour

Opens below the trigger (flip if no room) with duration/moderate + easing/enter. Closes on selection, Esc or outside click.

## Accessibility

Trigger has aria-haspopup=menu + aria-expanded; Enter/Space/↓ open with focus on the first item; ↑↓ move, Home/End jump, typing a letter jumps; Enter activates; Esc closes and returns focus to the trigger. role=menu / menuitem; Divider = role=separator.

## Tokens

Bg/surface-raised, border/default, Elevation/2, radius/md, spacing/1.

## Code

```tsx
<Menu label="More actions for Esther Howard" items={[{ label, icon, tone: "danger", separatorBefore }]} />
```

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
