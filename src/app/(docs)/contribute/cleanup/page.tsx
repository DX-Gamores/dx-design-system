import { MdPage } from "@/site/md-page";

export const metadata = { title: "Cleanup checklist" };

export default function Page() {
  return (
    <MdPage
      file="docs/CLEANUP.md"
      href="/contribute/cleanup/"
      eyebrow="Contribute"
      title="Cleanup checklist"
      summary="The last step of every process: credentials, branches, build output, hosting changes, Figma releases and AI work sessions."
    />
  );
}
