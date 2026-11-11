# Stepper

> Shows where someone is in a linear, multi-step flow (onboarding, checkout, setup) and lets them go back to finished steps.

**Figma:** [Stepper page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=189-56) · 6 variants · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Steps | Variant | 3 · 4 · 5 | `steps` |
| Orientation | Variant | Horizontal · Vertical | `orientation` |

## When

3–7 steps that must happen in order. 2 steps → Back/Next buttons. Independent sections → Tabs. System progress → Progress. One long form → Form Section.

## Property notes

Steps (3 | 4 | 5) · Orientation (Horizontal for desktop page tops | Vertical for side panels and mobile). Each step is exposed: set State, Label, Description, Number.

## Accessibility

<nav aria-label="Progress"><ol>; current step aria-current="step"; completed steps are links ("Step 1, Account, completed"); errors in text. Mobile: collapse to "Step 2 of 5 · Company".

## Tokens

bg/brand + icon/on-color (complete) · border/focus-brand ring (current) · border/strong (upcoming) · bg/danger-subtle + text/danger (error) · connector border/default → bg/brand.

## Code

<Stepper current={1} steps={[{ label: 'Account', description: '…', status: 'complete' }, …]} onStepClick={goTo} />

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
