import { MdPage } from "@/site/md-page";

export const metadata = { title: "Working with one seat" };

export default function Page() {
  return (
    <MdPage
      file="docs/WORKFLOW.md"
      href="/start/workflow/"
      title="Working with one seat"
      summary="Only the design lead edits Figma. Everyone else builds from this site, the repo and view-only Figma links."
    />
  );
}
