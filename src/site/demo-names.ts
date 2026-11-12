/** Figma pages that have a live example on the docs site (see demos.tsx). Shared by server and client code. */
export const demoNames = [
  "Button", "Link",
  "Text Field", "Select", "Combobox", "Date Picker", "Textarea", "Search Field", "Checkbox", "Radio", "Toggle", "Slider", "Chip", "File Upload",
  "Alert", "Toast", "Progress", "Loading", "Empty State", "Tooltip", "Badge",
  "Dialog", "Popover & Drawer", "Menu",
  "Navigation", "Tabs", "Segmented Control", "Stepper", "Accordion",
  "Avatar", "Card", "Divider", "Lists & Tables",
  "Form Patterns", "AI Patterns", "Kit · Stat Card",
  "Themes & Brands", "Icons",
] as const;
export type DemoName = (typeof demoNames)[number];
export const hasDemo = (name: string): name is DemoName => (demoNames as readonly string[]).includes(name);
