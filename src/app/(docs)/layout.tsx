import { DocsShell } from "@/site/docs-shell";
import { FIGMA_FILE, REPO, VERSION, nav } from "@/site/content";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsShell nav={nav} version={VERSION} repo={REPO} figma={FIGMA_FILE}>
      {children}
    </DocsShell>
  );
}
