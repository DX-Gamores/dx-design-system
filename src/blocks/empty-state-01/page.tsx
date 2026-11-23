/**
 * @title First use: no projects yet
 * @description What's empty, why, and one way forward — plus three templates to start from and an import option.
 * @route /projects
 */
import { FolderKanban, KanbanSquare, ListChecks, Sprout, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { TopBar } from "../_parts/top-bar";

const templates: { name: string; description: string; icon: LucideIcon }[] = [
  { name: "Product launch", description: "Milestones, owners and a launch checklist.", icon: KanbanSquare },
  { name: "Client onboarding", description: "Kick-off, access requests and first deliverables.", icon: ListChecks },
  { name: "Crop season", description: "Fields, crews and tasks from planting to harvest.", icon: Sprout },
];

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col bg-canvas">
      <TopBar current="Products" />
      <main id="main" className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center gap-10 px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-brand-subtle text-icon-brand"><Icon name={FolderKanban} size={24} /></span>
          <h1 className="text-heading-h2">No projects yet</h1>
          <p className="max-w-md text-body-medium text-fg-secondary">Projects keep your team's tasks, files and updates in one place. Create your first one, or start from a template.</p>
          <div className="flex flex-wrap justify-center gap-2"><Button leadingIcon="plus">Create project</Button><Button variant="secondary" leadingIcon="upload">Import from CSV</Button></div>
        </div>
        <section aria-labelledby="tpl-title" className="flex w-full flex-col gap-4 text-start">
          <h2 id="tpl-title" className="text-heading-h4">Start from a template</h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {templates.map((t) => (
              <li key={t.name}>
                <a href="#" className="flex h-full flex-col gap-2 rounded-container border border-line-default bg-surface p-4 hover:border-line-strong hover:bg-neutral-hover focus-visible:focus-ring">
                  <Icon name={t.icon} className="text-icon-brand" />
                  <span className="text-label-large">{t.name}</span>
                  <span className="text-body-small text-fg-secondary">{t.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
