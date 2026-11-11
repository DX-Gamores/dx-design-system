import { Badge } from "@/components/ui";
import { DocHeader, Panel, PrevNext, Section } from "@/site/blocks";
import { releases, roadmap, type RoadItem } from "@/site/changelog";

export const metadata = { title: "Changelog & roadmap" };

const kindTone = { breaking: "danger", new: "brand", fix: "success" } as const;
const kindLabel = { breaking: "Breaking", new: "New", fix: "Fixes & docs" } as const;
const statusTone: Record<RoadItem["status"], "success" | "info" | "neutral" | "warning"> = { Done: "success", "In progress": "info", Planned: "neutral", "Needs you": "warning" };

export default function Changelog() {
  return (
    <>
      <DocHeader eyebrow="Start here" title="Changelog & roadmap" summary="Every release on one line, and what comes next. Figma, tokens and code share one version number." />
      <Section title="Roadmap" description="Yellow items need a decision or access from the design-system owner. S / M / L = rough effort.">
        <div className="flex flex-col gap-6">
          {roadmap.map((lane) => (
            <div key={lane.lane} className="flex flex-col gap-3">
              <div><h3 className="text-heading-h4">{lane.lane}</h3><p className="text-body-small text-fg-secondary">{lane.sub}</p></div>
              <ul className="grid gap-3 md:grid-cols-2">
                {lane.items.map((i) => (
                  <li key={i.title}>
                    <Panel className="flex h-full flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2"><Badge tone={statusTone[i.status]}>{i.status}</Badge><Badge>{i.size}</Badge></div>
                      <span className="text-label-large">{i.title}</span>
                      <span className="text-body-small text-fg-secondary">{i.note}</span>
                    </Panel>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Changelog" description="Red = breaking (read the migration). Blue = new things. Green = fixes and docs.">
        <ol className="flex flex-col divide-y divide-line-default rounded-container border border-line-default bg-surface">
          {releases.map((r) => (
            <li key={r.v} className="flex flex-col gap-2 p-4 md:flex-row md:gap-6">
              <div className="flex shrink-0 items-start gap-2 md:w-48">
                <Badge tone={kindTone[r.kind]}>{`v${r.v}`}</Badge>
                <span className="text-caption-default text-fg-secondary">{kindLabel[r.kind]}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-label-large">{r.title}</span>
                <span className="text-body-small text-fg-secondary">{r.notes}</span>
              </div>
            </li>
          ))}
        </ol>
      </Section>
      <PrevNext href="/start/changelog/" />
    </>
  );
}
