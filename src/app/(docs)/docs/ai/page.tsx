import { MdPage } from "@/site/md-page";

export const metadata = { title: "Build with AI" };

export default function Page() {
  return (
    <MdPage
      file="docs/AI.md"
      href="/docs/ai/"
      title="Build with AI"
      summary="Point Claude, Cursor or Copilot at the DX docs and rules so the code they write uses DX components and tokens."
    />
  );
}
