import { DocsShell } from "@/site/docs-shell";
import { FIGMA_FILE, REPO, VERSION, meta, nav } from "@/site/content";
import parity from "@/site/parity.json";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsShell nav={nav} version={VERSION} repo={REPO} figma={FIGMA_FILE} syncedAt={meta.syncedAt} parity={`${parity.coded}/${parity.specs}`}>
      {children}
    </DocsShell>
  );
}
