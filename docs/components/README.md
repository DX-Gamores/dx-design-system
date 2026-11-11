# Component specs

63 components, generated from the Figma file. Each page lists the Figma properties, when to use it, accessibility rules, tokens and the code API.

### Button

- [Button](./button.md) — triggers an action.
- [Icon Button](./icon-button.md) — a square button with only an icon (row actions, toolbars, close, overflow menus).

### Link

- [Link](./link.md) — navigates to another page or resource. Always underlined so it is identifiable without color.

### Text Field

- [Text Field](./text-field.md) — single-line text input with label and helper text.

### Select

- [Select](./select.md) — choose one option from a list (select-only combobox; no typing to filter).
- [Select Option](./select-option.md) — one row inside a Select Menu (listbox option). States: Default, Hover, Selected (brand-subtle + check), Disabled. Reused later by Menu (v0.5).
- [Select Menu](./select-menu.md) — the open listbox shown under a focused Select (4px gap). Elevation/2, radius/md. Override option labels and states on the nested Select Option instances; add or remove rows as needed.

### Combobox

- [Combobox](./combobox.md) — a text field you can type into to filter a list, then pick one option (ARIA 1.2 combobox, list autocomplete).
- [Combobox Option](./combobox-option.md) — one row in the Combobox Menu. Same states as Select Option; Active = the option highlighted with the arrow keys (aria-activedescendant) — DOM focus stays in the input, so it gets a background + 2px brand bar, not a focus ring, Selected = the committed value (check).
- [Combobox Menu](./combobox-menu.md) — the listbox that opens 4px under a focused Combobox. Content: Results (matches bolded; Focus = highlighted with arrow keys) · Recent (empty query) · Loading (async search, show after 300ms) · No results (say what was typed + what to try) · Create (offer to add the typed value). Show keyboard hint for first-run or power-user surfaces. Max height 320 then scroll; width = field width.

### Date Picker

- [Date Field](./date-field.md) — type a date or open the Calendar from the calendar button. Pair with Calendar (popover, 4px below) to make a Date Picker.
- [Calendar Day](./calendar-day.md) — one cell of the Calendar grid (40×40 hit area, 32px circle).
- [Calendar](./calendar.md) — month grid that opens in a popover under Date Field (Date Picker), or sits inline on booking pages.

### Textarea

- [Textarea](./textarea.md) — multi-line free text (comments, descriptions, feedback).

### Search Field

- [Search Field](./search-field.md) — single-line search with a search icon and clear button.

### Checkbox

- [Checkbox](./checkbox.md) — select zero, one or many independent options.

### Radio

- [Radio](./radio.md) — pick exactly one option from a small, visible set (2–5). Always used in a group with a visible group label.

### Toggle

- [Toggle](./toggle.md) — switch a single setting on or off with immediate effect (role=switch).

### Slider

- [Slider](./slider.md) — pick a value (Single) or a range (Range) on a continuous scale where the exact number matters less than the position: volume, price filters, zoom.
- [Slider Thumb](./slider-thumb.md) — the handle. 20px visual, 40px hit area in code.

### Chip

- [Chip](./chip.md) — compact selectable token for filters and tags.

### File Upload

- [File Upload](./file-upload.md) — drop zone for attaching files.

### Alert

- [Alert](./alert.md) — an inline, persistent message about the page or a section (also called banner or callout).

### Toast

- [Toast](./toast.md) — a brief, non-blocking confirmation that appears in a corner (bottom-right or bottom-center) and goes away.

### Progress

- [Progress Bar](./progress-bar.md) — determinate progress.

### Loading

- [Skeleton](./skeleton.md) — a placeholder that mirrors the shape of content while it loads.
- [Spinner](./spinner.md) — indicates that something is in progress when its duration and shape are unknown.

### Empty State

- [Empty State](./empty-state.md) — explains why a space is empty and what to do next.

### Tooltip

- [Tooltip](./tooltip.md) — a short text label that appears on hover or keyboard focus of a control.

### Badge

- [Badge](./badge.md) — short, non-interactive status or category label (1–2 words).

### Dialog

- [Dialog](./dialog.md) — a modal window that interrupts the page for a decision or a short focused task.

### Popover & Drawer

- [Popover](./popover.md) — small floating panel anchored to a trigger.
- [Drawer](./drawer.md) — full-height side panel over the page.

### Menu

- [Menu Item](./menu-item.md) — one action inside a Menu.
- [Menu](./menu.md) — a list of actions that opens from a trigger (usually an Icon Button "More" or a Button with a Chevron Down).

### Navigation

- [Nav Item](./nav-item.md) — one destination in the Sidebar.
- [Sidebar](./sidebar.md) — primary app navigation, used together with the App Header.
- [Skip Link](./skip-link.md) — first focusable element on every page (WCAG 2.4.1). Hidden until it receives keyboard focus, then appears top-left above the App Header; Enter moves focus to <main>. Shown here in its focused state.
- [App Header](./app-header.md) — the top bar of every app screen. Height = layout/header-height (64 Desktop / 56 Tablet+Mobile).
- [Breadcrumbs](./breadcrumbs.md) — shows where the page sits in the hierarchy. Up to 2 ancestor Links (exposed) + the current page (plain text, aria-current="page"). <nav aria-label="Breadcrumb">. Hide on Mobile when the back path is obvious; never more than 4 levels.
- [Page Header](./page-header.md) — the top block of a page's content area: optional Breadcrumbs, title (the page's only H1 in code), description and page-level actions.

### Tabs

- [Tab](./tab.md) — one item in a Tabs bar. Selected tabs use color/text/brand with a 2px brand indicator; unselected use text/secondary.
- [Tabs](./tabs.md) — switch between related views of the same content without leaving the page.

### Segmented Control

- [Segmented Control](./segmented-control.md) — pick one of 2–5 related options that change how the same content is shown (view, period, filter). Selection applies immediately.
- [Segmented Control Item](./segmented-control-item.md) — one segment. Use inside Segmented Control; don't place on its own.

### Stepper

- [Stepper](./stepper.md) — shows where someone is in a linear, multi-step flow (onboarding, checkout, setup) and lets them go back to finished steps.
- [Step](./step.md) — one step of a Stepper. Use inside Stepper.

### Accordion

- [Accordion Item](./accordion-item.md) — one collapsible section.

### Avatar

- [Avatar](./avatar.md) — represents a person or workspace.

### Card

- [Card](./card.md) — container grouping content and up to two actions about one subject.

### Divider

- [Divider](./divider.md) — a 1px rule that separates groups of content.

### Lists & Tables

- [List Item](./list-item.md) — one row in a simple list (members, files, notifications). Replaces hand-built rows from the v0.4.1 agent test.
- [Table Header Cell](./table-header-cell.md) — column header. Sort: None (sortable, unsorted) · Ascending · Descending · Not sortable.
- [Table Cell](./table-cell.md) — one cell in a data table row. Types: Text · Two-line · Avatar (person) · Badge (status) · Numeric (right-aligned, tabular) · Checkbox (row selection, 48px) · Actions (Icon Button "More", 64px).
- [Pagination](./pagination.md) — moves through pages of a table or list. Summary text (what is shown) + previous/next Icon Buttons (Secondary, Small; Disabled at the ends) + current page. <nav aria-label="Table pagination">; announce the new range in a polite status message after paging.

### Form Patterns

- [Form Section](./form-section.md) — groups related fields under a title and description inside long forms and settings pages.
- [Error Summary](./error-summary.md) — shown at the top of a form after a failed submit when there is more than one error.
- [Form Actions](./form-actions.md) — the buttons that submit or cancel a form.

### AI Patterns

- [AI Response](./ai-response.md) — an answer written by AI, with its disclosure, sources and controls.
- [AI Label](./ai-label.md) — discloses that content was made or changed by AI. Generated (accent) | Edited (neutral, after a person edits it). Always visible on AI output; never hidden in a tooltip. Code: <AILabel type="generated" />
- [Citation](./citation.md) — a numbered source behind an AI answer. A link: opens the source, with an accessible name like "Source 1: Leave policy 2026". Put them right under the claim they support.
- [AI Confidence](./ai-confidence.md) — how sure the system is, in words + icon (never colour alone). High (sources agree) · Medium (partial support) · Low (check before using). Only show when the model gives a real signal.

### Kit · Stat Card

- [Stat Card](./stat-card.md) — not Core. Stat Card — one key number on a dashboard.

