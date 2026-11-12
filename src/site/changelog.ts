// Mirrors the Changelog and "What's next" sections of the Figma Getting Started page.
export type Release = { v: string; title: string; notes: string; kind: "breaking" | "new" | "fix" };
export const releases: Release[] = [
  { v: "3.2.0", kind: "new", title: "Modern motion, AI and every language", notes: "Spring tokens + CSS linear() · AI Patterns (AI Response, AI Label, Citation, AI Confidence) · Localization & RTL (48/48 screens at +40%) · Release health gate · 2 overflow fixes in templates" },
  { v: "3.1.0", kind: "new", title: "Six components people kept asking for", notes: "Combobox · Segmented Control · Date Picker · Stepper · Slider · Data-viz palette (21 tokens) · 72 descriptions un-escaped · Skip Link focus ring fixed" },
  { v: "3.0.1", kind: "fix", title: "Visual docs for every page", notes: "Visual docs on 33 pages · 191 variants re-bound · 6 starter shells + 32 empty-state screens · contrast re-audit 324/324" },
  { v: "3.0.0", kind: "breaking", title: "Components for every project", notes: "Tone + Pressed + Large on buttons · 7 new components · 69 icons · Button Danger deprecated" },
  { v: "2.1.0", kind: "new", title: "Foundations complete", notes: "Brand shape · responsive type · Effects collection · 684 contrast checks" },
  { v: "2.0.0", kind: "breaking", title: "Color system & brand roles", notes: "22 ramps × 11 steps · brand roles · CSS renames" },
  { v: "1.1.0", kind: "new", title: "Scale", notes: "High-contrast modes · component tokens · slots · template states" },
  { v: "1.0.0", kind: "breaking", title: "Governance & 1.0", notes: "Hybrid model · Definition of Done · WCAG 2.2 38/38 · docs site" },
  { v: "0.8.0", kind: "new", title: "Code bridge", notes: "React package · DTCG tokens · Storybook · parity tests" },
  { v: "0.6.0", kind: "new", title: "Patterns & templates", notes: "Layout collection · app shell · lists & tables · 15 templates" },
  { v: "0.5.0", kind: "new", title: "Feedback & overlays", notes: "Tooltip, Alert, Toast, Dialog, Menu, Tabs · Motion collection" },
  { v: "0.4.x", kind: "new", title: "Icons & core inputs", notes: "28 icons · Select, Radio, Toggle, Textarea · agent-test fixes" },
  { v: "0.3.0", kind: "new", title: "Theming axes", notes: "Violet brand · Compact density · theme matrix" },
  { v: "0.2.0", kind: "new", title: "AI-ready", notes: "Descriptions everywhere · DTCG export · DESIGN.md" },
  { v: "0.1.0", kind: "new", title: "MVP", notes: "146 variables · 12 text styles · 6 components" },
];

export type RoadItem = { title: string; status: "Done" | "In progress" | "Planned" | "Needs you"; size: "S" | "M" | "L"; note: string };
export const roadmap: { lane: string; sub: string; items: RoadItem[] }[] = [
  {
    lane: "Docs site",
    sub: "Make this site match the Figma file, page for page.",
    items: [
      { title: "Phase 1 · Docs structure", status: "Done", size: "M", note: "Figma's groups and pages in the sidebar, 63 specs as pages, Getting started, Governance and Changelog." },
      { title: "Phase 2 · Foundations from tokens", status: "Done", size: "M", note: "Colour roles and every semantic token with live values, palette, type, spacing and density, shape, motion demos, layout; live 324-pair contrast audit; data viz with colour-blind simulation; content and RTL pages; Do / Don't frames embedded live from Figma." },
      { title: "Phase 3 · Code the remaining components", status: "Planned", size: "L", note: "About 30: inputs, overlays, navigation, data display and patterns — each with a live demo and state matrix." },
      { title: "Phase 4 · Patterns and templates", status: "Planned", size: "M", note: "Form and AI patterns, templates and empty states as working example pages." },
      { title: "Phase 5 · Keep Figma and the site matched", status: "Planned", size: "M", note: "Parity check in the build, visual comparison per release, auto-deploy, version badge." },
    ],
  },
  {
    lane: "System health",
    sub: "Keeps docs and library honest.",
    items: [
      { title: "Docs that regenerate", status: "In progress", size: "M", note: "Code docs regenerate from Figma (npm run build:all). The Figma-side doc builder is still run by Claude." },
      { title: "Release health gate", status: "Done", size: "S", note: "10 checks on the Governance page, all green before v3.2.0." },
      { title: "Adoption tracking", status: "Needs you", size: "M", note: "Figma Library Analytics needs the Organization or Enterprise plan." },
      { title: "Code Connect", status: "Needs you", size: "S", note: "65 templates ready — needs the Organization plan." },
    ],
  },
];
