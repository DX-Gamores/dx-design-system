import { Stepper } from "@/components/ui/navigation";

export function Milestones() {
  return (
    <section aria-labelledby="ms-title" className="flex flex-col gap-4 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)] lg:col-span-3">
      <h2 id="ms-title" className="text-heading-h4">Milestones</h2>
      <Stepper steps={[
        { label: "Discovery", description: "Done Nov 2", status: "complete" },
        { label: "Content model", description: "Done Nov 20", status: "complete" },
        { label: "Templates", description: "Due Jan 15", status: "current" },
        { label: "Launch", description: "Mar 14", status: "upcoming" },
      ]} />
    </section>
  );
}
