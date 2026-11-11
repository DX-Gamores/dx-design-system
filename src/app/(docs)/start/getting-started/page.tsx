import { MdPage } from "@/site/md-page";

export const metadata = { title: "Getting started" };

const install = `## 0. Install

Add the kit to any web project straight from GitHub (or copy the \`dist/\` folder):

\`\`\`bash
npm i github:DX-Gamores/dx-design-system
\`\`\`

\`\`\`css
/* app/globals.css */
@import "tailwindcss";
@import "@dxform/design-system/tokens.css";
@import "@dxform/design-system/tailwind.css";
\`\`\`

\`\`\`html
<html data-brand="default" data-theme="light" data-density="comfortable">
\`\`\`

Components live in [\`src/components/ui\`](https://github.com/DX-Gamores/dx-design-system/tree/main/src/components/ui). Copy the ones you need into your project and own them (the shadcn/ui approach). They only depend on the tokens, so they re-skin for any brand. To start a new app, copy \`src/app/starter\` as well.

`;

export default function Page() {
  return (
    <MdPage
      file="docs/GETTING-STARTED.md"
      href="/start/getting-started/"
      title="Getting started"
      summary="Install the tokens, map Figma names to code, and build a component the way the spec describes."
      before={install}
    />
  );
}
