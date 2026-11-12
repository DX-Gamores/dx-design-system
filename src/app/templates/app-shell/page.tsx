import { PageHeader } from "@/components/app-shell";
import { AcmeShell, ContentSlot } from "@/templates/shell";

export const metadata = { title: "App shell" };
// Starter: duplicate, keep the header, sidebar and spacing, replace the content slot.
export default function Page() {
  return <AcmeShell><PageHeader title="Page title" description="One sentence about what this page is for." /><ContentSlot /></AcmeShell>;
}
