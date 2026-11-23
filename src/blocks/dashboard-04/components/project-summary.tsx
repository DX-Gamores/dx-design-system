import { Avatar } from "@/components/ui/display";
import { Progress } from "@/components/ui/feedback";

const team = ["Jane Cooper", "Wade Warren", "Esther Howard", "Cameron Williamson", "Brooklyn Simmons"];
const load = [
  { name: "Jane Cooper", tasks: 12, tone: "warning" as const, value: 92 },
  { name: "Wade Warren", tasks: 7, tone: "brand" as const, value: 58 },
  { name: "Esther Howard", tasks: 5, tone: "brand" as const, value: 40 },
];

export function ProjectSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <section aria-labelledby="ps-progress" className="flex flex-col gap-3 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)]">
        <h2 id="ps-progress" className="text-heading-h4">Progress</h2>
        <p className="text-heading-h2 tabular-nums">64%</p>
        <Progress value={64} label="Tasks done (82 of 128)" />
        <p className="text-caption-default text-fg-secondary">Due March 14 · 18 weeks left</p>
      </section>
      <section aria-labelledby="ps-team" className="flex flex-col gap-3 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)]">
        <h2 id="ps-team" className="text-heading-h4">Team</h2>
        <ul className="flex -space-x-2">{team.map((n) => <li key={n} className="rounded-full ring-2 ring-[var(--ds-color-bg-surface)]"><Avatar name={n} size="lg" /></li>)}</ul>
        <dl className="grid grid-cols-2 gap-2 text-body-small">
          <dt className="text-fg-secondary">Owner</dt><dd>Jane Cooper</dd>
          <dt className="text-fg-secondary">Client</dt><dd>Acme Inc</dd>
        </dl>
      </section>
      <section aria-labelledby="ps-load" className="flex flex-col gap-3 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)]">
        <h2 id="ps-load" className="text-heading-h4">Workload</h2>
        <ul className="flex flex-col gap-3">{load.map((l) => <li key={l.name}><Progress value={l.value} tone={l.tone} label={`${l.name} · ${l.tasks} open tasks`} /></li>)}</ul>
      </section>
    </div>
  );
}
