import { notFound } from "next/navigation";
import { PageHeader } from "@/components/app-shell";
import { Card, EmptyState } from "@/components/ui";

// Placeholder routes for the starter sidebar. Replace each with a real page.
const sections = {
  projects: { title: "Projects", icon: "folder", empty: "No projects yet", hint: "Create a project to start tracking work." },
  reports: { title: "Reports", icon: "chart", empty: "No reports yet", hint: "Reports you create will show up here." },
  settings: { title: "Settings", icon: "settings", empty: "Settings aren't set up", hint: "Build this page with Form Section + Form Actions from the design system." },
} as const;

export function generateStaticParams() {
  return Object.keys(sections).map((section) => ({ section }));
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const s = sections[section as keyof typeof sections];
  if (!s) notFound();
  return (
    <>
      <PageHeader title={s.title} />
      <Card>
        <EmptyState icon={s.icon} title={s.empty} description={s.hint} />
      </Card>
    </>
  );
}
