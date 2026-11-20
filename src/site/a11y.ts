// Accessibility notes for every component page: keyboard, ARIA and target size.
// Follows the WAI-ARIA Authoring Practices (APG) pattern each component implements; tests in tests/components.spec.ts check the keyboard rows.
export type A11y = { pattern?: string; keyboard: [string, string][]; aria: string[]; notes?: string[] };

const button: A11y = {
  pattern: "Button",
  keyboard: [["Tab", "Moves focus to the button"], ["Enter / Space", "Activates it"]],
  aria: ["A native <button>, so role, focus and disabled state come for free.", "loading sets aria-busy and keeps the label readable; the spinner is hidden from screen readers."],
  notes: ["Height 32–48px (control-sm…lg), above the 24px WCAG 2.2 target minimum.", "Danger tone pairs color with the action word (Delete, Remove), never color alone."],
};
const field = (extra: string[] = []): A11y => ({
  keyboard: [["Tab", "Moves focus into the field"], ["Type", "Edits the value"]],
  aria: ["The visible label is a <label for>, so clicking it focuses the field.", "Helper text and error are linked with aria-describedby; an error also sets aria-invalid.", ...extra],
  notes: ["Never use the placeholder as the label.", "Error text says how to fix it, not just that something is wrong."],
});
const listbox = (what: string): A11y => ({
  pattern: "Combobox / Listbox",
  keyboard: [["↓ / ↑", "Opens the list, then moves through options"], ["Enter", "Picks the active option"], ["Esc", "Closes the list and keeps the value"], ["Home / End", "First / last option"], ["Type", what]],
  aria: ["The input has role=combobox, aria-expanded and aria-controls pointing at the role=listbox.", "The active option is tracked with aria-activedescendant, so focus stays in the input.", "Options have role=option and aria-selected; disabled options aria-disabled."],
});
const calendar: A11y = {
  pattern: "Date picker dialog / Grid",
  keyboard: [["← → ↑ ↓", "Moves one day or one week"], ["Page Up / Page Down", "Previous / next month"], ["Home / End", "Start / end of the week"], ["Enter / Space", "Picks the focused day"], ["Esc", "Closes the calendar and returns focus to the field"]],
  aria: ["The calendar is a role=grid with column headers for weekdays.", "Each day is a button whose accessible name is the full date; today is marked aria-current=date.", "Disabled days have aria-disabled and are skipped by the arrow keys' selection."],
};
const slider: A11y = {
  pattern: "Slider",
  keyboard: [["← / →", "One step down / up"], ["Page Down / Page Up", "10% down / up"], ["Home / End", "Minimum / maximum"]],
  aria: ["Each thumb has role=slider with aria-valuemin, aria-valuemax, aria-valuenow and aria-valuetext (the formatted value).", "The label names the slider; a range slider names each thumb (Minimum, Maximum)."],
  notes: ["Optional number inputs mean dragging is never required (WCAG 2.5.7)."],
};
const menu: A11y = {
  pattern: "Menu button",
  keyboard: [["Enter / Space / ↓", "Opens the menu and focuses the first item"], ["↑ / ↓", "Moves between items"], ["Home / End", "First / last item"], ["A letter", "Jumps to the next item starting with it"], ["Esc", "Closes and returns focus to the trigger"]],
  aria: ["The trigger has aria-haspopup=menu and aria-expanded; the list is role=menu with role=menuitem children.", "Disabled items stay visible with aria-disabled; the arrow keys skip them."],
};
const shell: A11y = {
  pattern: "Landmarks",
  keyboard: [["Tab (first)", "Shows the Skip link; Enter jumps to the main content"], ["Tab", "Header actions, then the sidebar links, then the page"]],
  aria: ["Header is role=banner, sidebar is a <nav> with aria-label, content is <main id=main>.", "The current nav item has aria-current=page; counts include hidden text such as “3 unread”.", "On phones the sidebar opens from the menu button (aria-expanded, aria-controls) and closes with its Close button or the backdrop."],
};
const tabs: A11y = {
  pattern: "Tabs (automatic activation)",
  keyboard: [["← / →", "Moves to and shows the previous / next tab"], ["Home / End", "First / last tab"], ["Tab", "Leaves the tab list, to the first control in the panel"]],
  aria: ["role=tablist containing role=tab elements with aria-selected and aria-controls; only the selected tab is in the Tab order.", "Each panel is role=tabpanel, labelled by its tab."],
};
const segmented: A11y = {
  pattern: "Radio group",
  keyboard: [["← / → or ↑ / ↓", "Moves the selection (and focus) to the next option"], ["Home / End", "First / last option"], ["Tab", "Leaves the control"]],
  aria: ["role=radiogroup with an aria-label; each segment is role=radio with aria-checked.", "Icon-only segments get their label as aria-label."],
};
const stepper: A11y = {
  keyboard: [["Tab", "Moves between clickable steps (completed and current)"], ["Enter", "Goes to that step"]],
  aria: ["An ordered list (<ol>) so screen readers announce “step 2 of 4”.", "The current step has aria-current=step; status (complete, error) is in the accessible name, not only the icon."],
};
const table: A11y = {
  keyboard: [["Tab", "Moves to sortable headers and the controls in cells"], ["Enter / Space", "Sorts by the focused column"]],
  aria: ["A real <table> with a <caption> (visible or visually hidden).", "Sortable headers are buttons inside <th>; the <th> carries aria-sort.", "Row actions are named per row, e.g. “More actions for Jane Cooper”."],
};
const overlayDialog: A11y = {
  pattern: "Dialog (modal)",
  keyboard: [["Tab / Shift+Tab", "Cycles inside the dialog only"], ["Esc", "Closes it"], ["Enter", "Activates the focused button"]],
  aria: ["A native <dialog> opened with showModal(): role=dialog, aria-modal, and the rest of the page is inert.", "Labelled by its title and described by its description.", "On close, focus returns to the element that opened it. Danger dialogs focus Cancel first."],
};
const ai: A11y = {
  keyboard: [["Tab", "Moves through the actions (Stop, Copy, Regenerate, feedback) and source links"]],
  aria: ["Streaming text is in an aria-live=polite region, announced in chunks, not per character.", "“AI-generated” is text, not only an icon, so it is announced.", "While it streams, Stop is the first control and the region is aria-busy."],
};

export const a11y: Record<string, A11y> = {
  button,
  "icon-button": { ...button, aria: ["A native <button>; the required label prop becomes its aria-label.", "Pair with a Tooltip showing the same label for sighted users."], notes: ["32–48px square, above the 24px target minimum."] },
  link: { keyboard: [["Tab", "Moves focus to the link"], ["Enter", "Follows it"]], aria: ["A native <a href>.", "External links add an icon and “(opens in a new tab)” to the accessible name."], notes: ["Link text says where it goes; never “click here”.", "Underlined in body text so it doesn't rely on color (WCAG 1.4.1)."] },
  "text-field": field(),
  textarea: field(["maxLength stops typing at the limit, so say the limit in the helper text."]),
  "search-field": { ...field(["role=searchbox; the clear button is named “Clear search”."]), keyboard: [["Type", "Filters / searches"], ["Esc", "Clears the text"], ["Tab", "Moves to the clear button when there is text"]] },
  select: { keyboard: [["Tab", "Moves to the select"], ["↑ / ↓ / Space", "Opens the native list and changes the value"]], aria: ["A native <select> with a visible <label>, so it works with every screen reader and the mobile picker."] },
  "select-option": listbox("Jumps to the option starting with those letters"),
  "select-menu": listbox("Jumps to the option starting with those letters"),
  combobox: listbox("Filters the list"),
  "combobox-option": listbox("Filters the list"),
  "combobox-menu": listbox("Filters the list"),
  "date-field": { ...field(["Typed dates are parsed on Enter or blur and shown in a full format (Mar 14, 2027); a date it can’t read explains the expected format."]), keyboard: [["Type", "A date like 11/18 or Nov 18, then Enter"], ["Tab", "Moves to the “Choose date” button"], ["Enter / Space", "Opens the calendar"]] },
  calendar,
  "calendar-day": calendar,
  checkbox: { keyboard: [["Tab", "Moves to the checkbox"], ["Space", "Checks / unchecks"]], aria: ["A native <input type=checkbox> with its <label>; the whole label is clickable.", "Groups of checkboxes sit in a <fieldset> with a <legend>."] },
  radio: { pattern: "Radio group", keyboard: [["Tab", "Moves into the group (to the checked option)"], ["↑ ↓ / ← →", "Moves and selects"]], aria: ["Native radios in a <fieldset> with a <legend>; one Tab stop per group.", "An error on the group is linked to the fieldset with aria-describedby."] },
  toggle: { pattern: "Switch", keyboard: [["Tab", "Moves to the switch"], ["Space / Enter", "Turns it on or off"]], aria: ["role=switch with aria-checked.", "The label says what is switched; the state is announced as on/off, not by color."], notes: ["Use for settings that apply immediately. For choices saved with a form, use Checkbox."] },
  slider,
  "slider-thumb": slider,
  chip: { keyboard: [["Tab", "Moves to the chip, or to a tag’s remove button"], ["Enter / Space", "Toggles a filter chip, or removes a tag"]], aria: ["Filter chips are toggle buttons with aria-pressed.", "A tag’s remove button is named “Remove <label>”."] },
  "file-upload": { keyboard: [["Tab", "Moves to the drop zone, then each file’s remove button"], ["Enter / Space", "Opens the file picker"]], aria: ["The drop zone is a real button that opens the file picker, so drag and drop is never required.", "Accepted types and size are its description (aria-describedby).", "Each file’s error is role=alert; upload progress is a role=progressbar named “Uploading <file>”; remove buttons are named “Remove <file>”."] },
  alert: { keyboard: [["Tab", "Moves to the action and the dismiss button"]], aria: ["An alert shown with the page is plain content. One inserted later sets live: danger becomes role=alert (announced at once), other tones role=status.", "The title says what happened in words; the icon and color only reinforce it.", "The dismiss button is named “Dismiss”."] },
  toast: { keyboard: [["Tab", "Reaches the toast’s action and Dismiss button; the toast never takes focus itself"]], aria: ["Toasts render in a role=status live region (role=alert for danger).", "Hovering or focusing a toast pauses its timer (WCAG 2.2.1). Any action in a toast also exists elsewhere in the UI."] },
  "progress-bar": { keyboard: [], aria: ["role=progressbar with aria-valuenow, aria-valuemin and aria-valuemax, named by its label.", "The percentage is shown as text next to the bar."] },
  skeleton: { keyboard: [], aria: ["Skeletons are aria-hidden. Put aria-busy=true and a visually hidden “Loading…” on the region that is loading (see the example)."], notes: ["Reduced motion stops the pulse."] },
  spinner: { keyboard: [], aria: ["role=status with a visually hidden label (default “Loading”)."], notes: ["Reduced motion slows the rotation instead of stopping it, so progress is still visible."] },
  "empty-state": { keyboard: [["Tab", "Moves to the actions"]], aria: ["The title is a heading at the right level for the page.", "The illustration or icon is decorative (aria-hidden)."] },
  tooltip: { pattern: "Tooltip", keyboard: [["Tab (focus)", "Shows the tooltip at once"], ["Esc", "Hides it without moving focus (WCAG 1.4.13)"]], aria: ["role=tooltip, linked from the trigger with aria-describedby while it is shown.", "Shows on hover after a short delay, and immediately on keyboard focus."], notes: ["Never put the only copy of important information or interactive content in a tooltip."] },
  badge: { keyboard: [], aria: ["Plain text, so it is read in place.", "Counts include context for screen readers, e.g. “12 members”."], notes: ["Tone is reinforced by the text (Active, Failed), never color alone."] },
  dialog: overlayDialog,
  drawer: { ...overlayDialog, pattern: "Dialog (modal), side sheet" },
  popover: { pattern: "Disclosure (non-modal)", keyboard: [["Enter / Space", "Opens it from the trigger and moves focus inside"], ["Tab", "Moves through its content, then out"], ["Esc", "Closes and returns focus to the trigger"]], aria: ["The trigger has aria-expanded and aria-controls; the panel is role=dialog (non-modal) with a title.", "Clicking outside closes it."] },
  menu,
  "menu-item": menu,
  "nav-item": shell,
  sidebar: shell,
  "skip-link": { keyboard: [["Tab (first on the page)", "Shows the link"], ["Enter", "Moves focus to <main>"]], aria: ["The first focusable element; visually hidden until focused (WCAG 2.4.1)."] },
  "app-header": shell,
  breadcrumbs: { keyboard: [["Tab", "Moves through the links"]], aria: ["A <nav aria-label=Breadcrumb> with an ordered list.", "The last item is the current page: text with aria-current=page, not a link.", "Separators are aria-hidden."] },
  "page-header": { keyboard: [["Tab", "Moves to the actions"]], aria: ["The title is the page's <h1> (or the level you pass with headingLevel).", "One primary action at most."] },
  tab: tabs,
  tabs,
  "segmented-control": segmented,
  "segmented-control-item": segmented,
  stepper,
  step: stepper,
  "accordion-item": { pattern: "Accordion", keyboard: [["Tab", "Moves between headers"], ["Enter / Space", "Opens or closes the section"]], aria: ["Each header is a <button> inside a heading, with aria-expanded and aria-controls.", "The panel is a region labelled by its header."] },
  avatar: { keyboard: [], aria: ["Has the person's name as its accessible name (alt text or aria-label).", "Use decorative when the name is already shown next to it, so it isn't read twice."] },
  card: { keyboard: [["Tab", "Moves to the actions inside"]], aria: ["The title is a real heading (headingLevel) so cards show up in the headings list.", "If the whole card is a link, only the title is the link; actions stay separate."] },
  divider: { keyboard: [], aria: ["Decorative by default (aria-hidden). With semantic it becomes role=separator with aria-orientation, for a real break between groups."] },
  "list-item": { keyboard: [["Tab", "Moves to the actions in each row"]], aria: ["A <ul>/<li> list with a label; each item's title is its main text.", "Row actions are named per row, e.g. “More actions for Jane Cooper”."] },
  "table-header-cell": table,
  "table-cell": table,
  pagination: { keyboard: [["Tab", "Moves to Previous page and Next page"], ["Enter / Space", "Goes to that page"]], aria: ["A <nav aria-label=Pagination>; the buttons are named “Previous page” and “Next page” and are disabled at the ends.", "“Page 2 of 5” carries aria-current=page.", "The summary (“Showing 1–10 of 48”) is a polite live region, so the change is announced."] },
  "form-section": { keyboard: [], aria: ["A <fieldset>/<section> with a heading, so screen-reader users can jump between sections."] },
  "error-summary": { keyboard: [["(on submit)", "Takes focus so the errors are read first"], ["Tab / Enter", "Each link moves focus to its field"]], aria: ["role=alert with a heading “There are N problems”.", "Each error links to the field id; the same message appears next to the field."] },
  "form-actions": { keyboard: [["Tab", "Moves to Cancel, then Save"]], aria: ["Save is never disabled; it submits and shows errors instead (WCAG 3.3.1).", "The unsaved-changes status is in a live region."] },
  "ai-response": ai,
  "ai-label": { keyboard: [], aria: ["Text (“AI-generated”, “Edited by you”), not only an icon, so the provenance is announced."] },
  citation: { keyboard: [["Tab", "Moves to the source link"]], aria: ["A link whose name is the source title; the number is aria-hidden."] },
  "ai-confidence": { keyboard: [], aria: ["The level is text (High / Medium / Low confidence), not a color dot alone."] },
  "stat-card": { keyboard: [], aria: ["The value and label are read together; the trend says the direction in words (“up 12%”), not only an arrow or color."] },
};
