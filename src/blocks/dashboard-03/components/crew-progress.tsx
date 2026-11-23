import { Progress } from "@/components/ui/feedback";
import { Avatar } from "@/components/ui/display";

const crews = [
  { lead: "Ramon Cruz", task: "Harvest · F-02", value: 82, tone: "success" as const },
  { lead: "Ana Reyes", task: "Fertilizer · F-05", value: 54, tone: "brand" as const },
  { lead: "Leo Santos", task: "Irrigation repair · F-07", value: 25, tone: "warning" as const },
  { lead: "Mia Garcia", task: "Scouting · east block", value: 100, tone: "success" as const },
];

export function CrewProgress() {
  return (
    <section aria-labelledby="crews-title" className="flex flex-col gap-4 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)] lg:col-span-2">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="crews-title" className="text-heading-h4">Today's work by crew</h2>
        <span className="text-body-small text-fg-secondary">3 of 4 on track</span>
      </div>
      <ul className="flex flex-col gap-4">
        {crews.map((c) => (
          <li key={c.lead} className="flex items-center gap-3">
            <Avatar name={c.lead} decorative />
            <div className="min-w-0 flex-1"><Progress value={c.value} tone={c.tone} label={`${c.lead} — ${c.task}`} /></div>
          </li>
        ))}
      </ul>
    </section>
  );
}
