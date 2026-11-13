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

Components live in [\`src/components/ui\`](https://github.com/DX-Gamores/dx-design-system/tree/main/src/components/ui). Copy the ones you need into your project and own them (the shadcn/ui approach). They only depend on the tokens, so they re-skin for any brand.

### Start a new app from the starter

The [starter app](/starter/) is a sidebar dashboard (stat cards, chart, members list, empty state) built only from DX tokens and components. To use it as the base of a new Next.js project:

1. Create the app and install the kit and fonts:

\`\`\`bash
npx create-next-app@latest my-app --ts --tailwind --app --src-dir
cd my-app
npm i github:DX-Gamores/dx-design-system @fontsource/inter @fontsource/roboto-mono
\`\`\`

2. Copy these folders from the [repo](https://github.com/DX-Gamores/dx-design-system) into the same paths in \`my-app\`: \`src/components/\`, \`src/lib/cn.ts\`, \`src/app/fonts.ts\` and \`src/app/starter/\`.

3. Point the tokens alias at the package in \`tsconfig.json\`:

\`\`\`json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"], "@dxform/tokens": ["./node_modules/@dxform/design-system/dist/tokens.ts"] } } }
\`\`\`

4. Import the CSS shown above in \`src/app/globals.css\`, then run \`npm run dev\` and open [localhost:3000/starter](http://localhost:3000/starter).

5. Trim \`src/app/fonts.ts\` to the fonts your brand uses (Inter and Roboto Mono for the default brand).

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
