import { Avatar } from "@/components/ui/display";

const items = [
  { who: "Wade Warren", what: "moved “Pricing page” to Review", when: "12 min ago" },
  { who: "Esther Howard", what: "commented on “Hero copy”", when: "1 h ago" },
  { who: "Jane Cooper", what: "completed “Navigation spec”", when: "3 h ago" },
  { who: "Brooklyn Simmons", what: "uploaded 14 photos to Assets", when: "Yesterday" },
];

export function Activity() {
  return (
    <section aria-labelledby="act-title" className="flex flex-col gap-4 rounded-container border border-line-default bg-surface p-[var(--ds-padding-card)] lg:col-span-2">
      <h2 id="act-title" className="text-heading-h4">Recent activity</h2>
      <ol className="flex flex-col gap-4">
        {items.map((i) => (
          <li key={i.what} className="flex gap-3">
            <Avatar name={i.who} decorative />
            <p className="flex min-w-0 flex-1 flex-col text-body-small"><span><span className="text-label-medium">{i.who}</span> {i.what}</span><span className="text-caption-default text-fg-secondary">{i.when}</span></p>
          </li>
        ))}
      </ol>
    </section>
  );
}
