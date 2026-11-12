/** Figma pages that have a live example on the docs site (see demos.tsx). Shared by server and client code. */
export const demoNames = [
  "Button", "Text Field", "Select", "Textarea", "Search Field", "Checkbox", "Toggle",
  "Alert", "Progress", "Loading", "Empty State", "Badge",
  "Navigation", "Tabs", "Segmented Control", "Stepper",
  "Avatar", "Card", "AI Patterns", "Kit · Stat Card",
  "Themes & Brands", "Icons",
] as const;
export type DemoName = (typeof demoNames)[number];
export const hasDemo = (name: string): name is DemoName => (demoNames as readonly string[]).includes(name);
