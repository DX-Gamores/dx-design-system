# Empty State

> Explains why a space is empty and what to do next.

**Figma:** [Empty State page](https://www.figma.com/design/myYAMZWk4yKLQMWGBdJVJd/DX-Design-System?node-id=41-2) · 1 variant · open in view-only mode — no seat needed.

## Properties

| Figma property | Type | Options / default | Suggested React prop |
|---|---|---|---|
| Icon | Instance swap | — | `icon` |
| Title | Text | No members yet | `title` |
| Description | Text | Invite people to collaborate on projects in this workspace. | `description` |
| Show actions | Boolean | true | `showActions` |
| Show secondary action | Boolean | false | `showSecondaryAction` |
| Media | Slot | — | `media` |
| Show icon | Boolean | true | `showIcon` |
| Show media | Boolean | false | `showMedia` |

## When

First use (nothing created yet), no search/filter results, or cleared lists. Errors that prevent loading → Alert. While loading → Skeleton/Spinner (never show an empty state before data arrives).

## Property notes

Icon (swap) · Title · Description · Show actions · Show secondary action. Actions are exposed Button instances. · Media (slot: custom illustration or image) · Show icon (turn off when using Media)

## Writing

Title says what's missing ("No members yet" / "No results for “wade”"); description says how to fill it; the primary action does exactly that. For no-results, offer "Clear filters" instead of a create action.

## Tokens

bg/surface-subtle circle (size/control-lg), icon/primary, Heading/H4, Body/Small, gap/stack, spacing/10 vertical padding.

## Code

<EmptyState icon="user" title="…" description="…" actions={<Button …/>} headingLevel={2} />

---
_Generated from the Figma component description by `npm run specs`. Edit the description in Figma, re-export, regenerate._
